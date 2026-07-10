import fs from 'node:fs/promises';
import path from 'node:path';
import { parseStringPromise } from 'xml2js';
import slugify from 'slugify';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const xmlPath = path.resolve(process.cwd(), 'imports', 'wordpress-blogs.xml');
const DEFAULT_CATEGORY = 'General';
const ALLOWED_CATEGORIES = new Set([
  'General',
  'Roofing',
  'Cold Storage',
  'Installation',
  'Poultry Farming',
  'Agriculture',
]);

let Blog;
let connectDB;

async function loadProjectModules() {
  const dbModule = await import('../config/db.js');
  const blogModule = await import('../models/Blog.js');

  Blog = blogModule.default;
  connectDB =
    dbModule.default ||
    dbModule.connectDB ||
    dbModule.connectDatabase ||
    dbModule.connect;
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    if (typeof value._ === 'string') return value._.trim();
    if (typeof value.text === 'string') return value.text.trim();
  }
  return String(value).trim();
}

function getNodeValue(node, key) {
  if (!node) return '';
  if (Object.prototype.hasOwnProperty.call(node, key)) return cleanText(node[key]);
  const lowerKey = key.toLowerCase();
  const match = Object.keys(node).find((entry) => entry.toLowerCase() === lowerKey);
  return match ? cleanText(node[match]) : '';
}

function getMetaValue(item, keys) {
  const metas = asArray(item?.['wp:postmeta'] || item?.postmeta || item?.meta);
  for (const meta of metas) {
    const metaKey = cleanText(meta?.['wp:meta_key'] || meta?.meta_key || meta?.key);
    if (keys.includes(metaKey)) {
      const metaValue = cleanText(meta?.['wp:meta_value'] || meta?.meta_value || meta?.value);
      if (metaValue) return metaValue;
    }
  }
  return '';
}

function stripHtml(html) {
  return cleanText(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortDescriptionFromHtml(html, length = 160) {
  const text = stripHtml(html);
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}

function extractFirstImage(html) {
  const content = cleanText(html);
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/i,
    /<img[^>]+data-src=["']([^"']+)["']/i,
    /<img[^>]+srcset=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (!match?.[1]) continue;
    const value = match[1].split(',')[0].trim().split(' ')[0].trim();
    if (value) return value;
  }

  return '';
}

function getDirectWordPressImage(item) {
  return (
    cleanText(item?.['wp:attachment_url']) ||
    cleanText(item?.attachment_url) ||
    cleanText(item?.featured_image) ||
    cleanText(item?.image) ||
    cleanText(item?.thumbnail)
  );
}

function getAttachmentUrl(item) {
  return (
    cleanText(item?.['wp:attachment_url']) ||
    cleanText(item?.attachment_url) ||
    cleanText(item?.guid?._) ||
    cleanText(item?.guid)
  );
}

function getCategory(item) {
  const categories = asArray(item?.category);
  const category = categories.find((entry) => cleanText(entry?.domain) === 'category')
    || categories.find((entry) => cleanText(entry?.domain) !== 'post_tag')
    || categories[0];

  return cleanText(category?._ || category?.nicename || category?.term || category);
}

function normalizeCategory(wordPressCategory) {
  const normalized = cleanText(wordPressCategory).toLowerCase();

  const exactMap = new Map([
    ['puf panels', 'Roofing'],
    ['puf panel roof', 'Roofing'],
    ['puf panel wall', 'Roofing'],
    ['mushroom farming', 'Agriculture'],
    ['poultry farming', 'Poultry Farming'],
  ]);

  if (exactMap.has(normalized)) {
    return exactMap.get(normalized);
  }

  if (ALLOWED_CATEGORIES.has(wordPressCategory)) {
    return wordPressCategory;
  }

  if (normalized.includes('roof') || normalized.includes('wall') || normalized.includes('panel')) {
    return 'Roofing';
  }

  if (normalized.includes('mushroom') || normalized.includes('agriculture')) {
    return 'Agriculture';
  }

  if (normalized.includes('poultry')) {
    return 'Poultry Farming';
  }

  return DEFAULT_CATEGORY;
}

function getAuthor(item) {
  return cleanText(item?.['dc:creator'] || item?.creator || item?.author) || 'WordPress';
}

function getPublishDate(item) {
  const rawDate =
    cleanText(item?.['wp:post_date_gmt']) ||
    cleanText(item?.['wp:post_date']) ||
    cleanText(item?.pubDate) ||
    cleanText(item?.date);

  const parsed = rawDate ? new Date(rawDate) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function getSeoTitle(item, fallbackTitle) {
  const seoTitle = getMetaValue(item, [
    'wpseo_title',
    '_yoast_wpseo_title',
    'yoast_wpseo_title',
    '_aioseo_title',
    'aioseo_title',
    'rank_math_title',
    '_rank_math_title',
  ]);

  return seoTitle || fallbackTitle;
}

function getSeoDescription(item, contentHtml) {
  const excerpt = cleanText(item?.['excerpt:encoded'] || item?.excerpt?.encoded || item?.excerpt);
  const seoDescription = getMetaValue(item, [
    'wpseo_metadesc',
    '_yoast_wpseo_metadesc',
    'yoast_wpseo_metadesc',
    '_aioseo_description',
    'aioseo_description',
    'rank_math_description',
    '_rank_math_description',
  ]);

  return seoDescription || excerpt || shortDescriptionFromHtml(contentHtml);
}

function getFeaturedImage(item, attachmentMap, contentHtml) {
  const directImage = getDirectWordPressImage(item);
  if (directImage) return directImage;

  const thumbnailId = getMetaValue(item, ['_thumbnail_id']);
  if (thumbnailId && attachmentMap.has(thumbnailId)) {
    return attachmentMap.get(thumbnailId);
  }

  return extractFirstImage(contentHtml);
}

function toBlogPayload(item, attachmentMap) {
  const title = cleanText(item?.title?._) || cleanText(item?.title) || '';
  const content = cleanText(item?.['content:encoded'] || item?.content?.encoded || item?.content);
  const slugSource = cleanText(item?.['wp:post_name'] || item?.slug);
  const wordpressCategory = getCategory(item);
  const slug =
    slugSource ||
    slugify(title, { lower: true, strict: true, trim: true }) ||
    `post-${cleanText(item?.['wp:post_id'] || item?.['wp:ID'] || item?.id || Date.now())}`;

  return {
    title,
    slug,
    content,
    image: getFeaturedImage(item, attachmentMap, content) || '',
    author: getAuthor(item),
    wordpressCategory,
    category: normalizeCategory(wordpressCategory),
    metaTitle: getSeoTitle(item, title),
    metaDescription: getSeoDescription(item, content),
    publishedAt: getPublishDate(item),
    publishDate: getPublishDate(item),
    status: 'published',
    published: true,
  };
}

async function main() {
  try {
    await loadProjectModules();

    if (typeof connectDB !== 'function') {
      throw new Error('Unable to find a MongoDB connection function in ../config/db.js');
    }

    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connection.asPromise();
    }

    console.log('MongoDB connected');

    const xmlExists = await fs
      .access(xmlPath)
      .then(() => true)
      .catch(() => false);

    if (!xmlExists) {
      throw new Error(`WordPress XML file not found at: ${xmlPath}`);
    }

    const xmlContent = await fs.readFile(xmlPath, 'utf8');
    const parsed = await parseStringPromise(xmlContent, {
      explicitArray: false,
      trim: true,
      normalize: false,
      mergeAttrs: false,
    });

    const rawItems = asArray(parsed?.rss?.channel?.item);
    console.log(`Total WordPress items found: ${rawItems.length}`);

    const attachmentMap = new Map();
    for (const item of rawItems) {
      if (cleanText(item?.['wp:post_type']) !== 'attachment') continue;
      const attachmentId = cleanText(item?.['wp:post_id'] || item?.['wp:ID'] || item?.post_id || item?.id);
      const attachmentUrl = getAttachmentUrl(item);
      if (attachmentId && attachmentUrl) {
        attachmentMap.set(attachmentId, attachmentUrl);
      }
    }

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const item of rawItems) {
      const postType = cleanText(item?.['wp:post_type']);
      const postStatus = cleanText(item?.['wp:status']);
      const title = cleanText(item?.title?._) || cleanText(item?.title) || '(untitled)';

      if (!postType) {
        skippedCount += 1;
        console.log(`[Skipped] ${title} - missing post type`);
        continue;
      }

      if (postType !== 'post') {
        skippedCount += 1;
        console.log(`[Skipped] ${title} - unsupported WordPress content type: ${postType}`);
        continue;
      }

      if (postStatus !== 'publish') {
        skippedCount += 1;
        console.log(`[Skipped] ${title} - status is ${postStatus || 'empty'}`);
        continue;
      }

      const blogData = toBlogPayload(item, attachmentMap);
      console.log(
        `[Category mapped] original="${blogData.wordpressCategory || ''}" mapped="${blogData.category}" title="${blogData.title}"`
      );

      if (!blogData.slug) {
        skippedCount += 1;
        console.log(`[Skipped] ${title} - unable to generate a slug`);
        continue;
      }

      if (!blogData.image) {
        console.log(`[No image found] ${blogData.title}`);
      }

      try {
        const existingBlog = await Blog.findOne({ slug: blogData.slug });

        if (existingBlog) {
          await Blog.findByIdAndUpdate(existingBlog._id, blogData, {
            new: true,
            runValidators: true,
          });
          updatedCount += 1;
          console.log(`[Updated blog title] ${blogData.title}`);
        } else {
          await Blog.create(blogData);
          importedCount += 1;
          console.log(`[Imported blog title] ${blogData.title}`);
        }
      } catch (error) {
        failedCount += 1;
        console.error(`[Failed] ${blogData.title} - ${error.message}`);
      }
    }

    console.log('Import completed');
    console.log(`Total imported: ${importedCount}`);
    console.log(`Total updated: ${updatedCount}`);
    console.log(`Total skipped: ${skippedCount}`);
    console.log(`Total failed: ${failedCount}`);
  } catch (error) {
    console.error('Import failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close().catch(() => {});
    }
  }
}

await main();
