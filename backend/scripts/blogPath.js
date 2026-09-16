const categories = new Set([
  "puf-panels",
  "puf-panel-roof",
  "puf-panel-wall",
  "puf-panels/poultry-farming",
  "puf-panels/mushroom-farming",
]);

// Preserve public URLs when importing WordPress or repairing legacy records.
export function splitBlogPath(slug, categorySlug = "puf-panels", permalink = "") {
  if (permalink) {
    const parts = new URL(permalink).pathname.split("/").filter(Boolean);
    const leaf = parts.pop();
    const category = parts.join("/");
    if (leaf === slug.split("/").pop() && categories.has(category)) {
      return { slug: leaf, categorySlug: category };
    }
  }
  const parts = slug.split("/");
  const leaf = parts.pop();
  const category = [categorySlug, ...parts].join("/");
  if (!leaf || !categories.has(category)) {
    throw new Error(`Unsupported legacy blog path: ${categorySlug}/${slug}`);
  }
  return { slug: leaf, categorySlug: category };
}
