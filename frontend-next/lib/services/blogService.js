import api from "@/lib/api/axios";

const getText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const inflightRequests = new Map();

const stableStringify = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return JSON.stringify(value ?? null);
  }

  return JSON.stringify(
    Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = value[key];
        return acc;
      }, {}),
  );
};

const requestOnce = (key, factory) => {
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key);
  }

  const promise = Promise.resolve()
    .then(factory)
    .finally(() => inflightRequests.delete(key));

  inflightRequests.set(key, promise);
  return promise;
};

const extractArrayCandidate = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!isPlainObject(payload)) return [];

  const candidates = [
    payload.data,
    payload.blogs,
    payload.posts,
    payload.data?.data,
    payload.data?.blogs,
    payload.data?.posts,
    payload.payload,
    payload.result,
    payload.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  for (const candidate of candidates) {
    if (isPlainObject(candidate)) {
      const nested = extractArrayCandidate(candidate);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

const extractObjectCandidate = (payload) => {
  if (!isPlainObject(payload) || Array.isArray(payload)) return null;

  const looksLikeBlog =
    "title" in payload ||
    "slug" in payload ||
    "content" in payload ||
    "image" in payload ||
    "author" in payload;

  if (looksLikeBlog) {
    return payload;
  }

  const candidates = [
    payload.data,
    payload.blog,
    payload.post,
    payload.data?.data,
    payload.data?.blog,
    payload.data?.post,
    payload.payload,
    payload.result,
  ];

  for (const candidate of candidates) {
    if (isPlainObject(candidate) && !Array.isArray(candidate)) {
      const nested = extractObjectCandidate(candidate);
      if (nested) return nested;
    }
  }

  return null;
};

export const isPublishedBlog = (blog) => {
  if (!blog) return false;

  return (
    blog.published === true ||
    getText(blog.published) === "true" ||
    getText(blog.status) === "published"
  );
};

export const normalizeCategory = (value) => getText(value);

export const normalizeBlog = (blog) => ({
  ...blog,
  published: isPublishedBlog(blog),
});

export const normalizeBlogList = (payload) =>
  extractArrayCandidate(payload).map((blog) => normalizeBlog(blog));

export const normalizeSingleBlog = (payload) => {
  const blog = extractObjectCandidate(payload);
  return blog ? normalizeBlog(blog) : null;
};

export const fetchBlogs = async (params = {}) => {
  const key = `GET:/blogs:${stableStringify(params)}`;

  return requestOnce(key, async () => {
    const response = await api.get("/blogs", { params });

    return {
      blogs: normalizeBlogList(response.data),
      pagination:
        response.data?.pagination ||
        response.data?.data?.pagination ||
        response.data?.meta?.pagination ||
        {},
      raw: response.data,
    };
  });
};

export const fetchBlogBySlug = async (slug) => {
  const key = `GET:/blogs/${slug}`;

  return requestOnce(key, async () => {
    const response = await api.get(`/blogs/${slug}`);
    return normalizeSingleBlog(response.data);
  });
};
