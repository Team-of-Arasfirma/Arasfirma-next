import api from "@/lib/api/axios";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=70";

export const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim() ||
  "";

export const categoryKey = (value) =>
  firstText(value).replace(/\s+/g, " ").toLowerCase();

export const formatTitleCase = (value) =>
  categoryKey(value).replace(/\b\w/g, (letter) => letter.toUpperCase());

export const categoryOptions = (values) =>
  Array.from(
    new Map(
      values
        .filter((value) => firstText(value))
        .map((value) => [categoryKey(value), formatTitleCase(value)]),
    ).values(),
  );

export const isPublicProject = (project) =>
  Boolean(
    project &&
    typeof project === "object" &&
    !Array.isArray(project) &&
    (project.status === "published" ||
      project.published === true ||
      project.status === "active"),
  );

export const extractProjects = (data) => {
  const items = [data?.projects, data?.data, data?.items, data].find(
    Array.isArray,
  );
  if (!items) throw new Error("Unexpected projects response");
  return items.filter(
    (item) => item && typeof item === "object" && !Array.isArray(item),
  );
};

const imageSource = (image) =>
  typeof image === "string"
    ? firstText(image)
    : firstText(image?.secure_url, image?.url);

export const getProjectImages = (project) => {
  const images = Array.isArray(project.images)
    ? project.images.map(imageSource).filter(Boolean)
    : [];
  if (images.length) return images;
  const image = [project.image, project.imageUrl, project.coverImage]
    .map(imageSource)
    .find(Boolean);
  return image ? [image] : [];
};

export const fileUrl = (source) => {
  const value = imageSource(source);
  if (!value) return "";
  if (value.startsWith("/assets/")) return value;
  try {
    const url = new URL(value, `${API_BASE_URL}/`);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      url.protocol !== "https:"
    ) {
      return "";
    }
    return url.href;
  } catch {
    return "";
  }
};

export const getProjectImage = (project) =>
  fileUrl(getProjectImages(project)[0]) || FALLBACK_IMAGE;

// Fail before sending a mixed-content request; deployment must configure an HTTPS API.
export const assertProjectApiUrl = () => {
  let url;
  try {
    url = new URL(API_BASE_URL);
  } catch {
    throw new Error("Set NEXT_PUBLIC_API_URL to the backend origin.");
  }
  if (!["http:", "https:"].includes(url.protocol) || url.search || url.hash) {
    throw new Error(
      "Set NEXT_PUBLIC_API_URL to a valid HTTP or HTTPS backend origin.",
    );
  }
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "Set NEXT_PUBLIC_API_URL to your HTTPS backend origin and rebuild the frontend.",
    );
  }
};

const projectRequest = (config) => {
  assertProjectApiUrl();
  // Reuse authentication interceptors without changing API behavior for other modules.
  return api.request({ ...config, baseURL: `${API_BASE_URL}/api` });
};

export const listProjects = async () => {
  const { data } = await projectRequest({ method: "get", url: "/projects" });
  return extractProjects(data);
};

export const saveProject = (id, data) =>
  projectRequest({
    method: id ? "put" : "post",
    url: id ? `/projects/${encodeURIComponent(id)}` : "/projects",
    data,
  });

export const deleteProject = (id) =>
  projectRequest({
    method: "delete",
    url: `/projects/${encodeURIComponent(id)}`,
  });

export const uploadProjectImages = async (files) => {
  const data = new FormData();
  files.forEach((file) => data.append("images", file));
  const response = await projectRequest({
    method: "post",
    url: "/upload/multiple",
    data,
    headers: { "Content-Type": "multipart/form-data" },
  });
  const urls = response.data?.imageUrls;
  if (
    !Array.isArray(urls) ||
    urls.length !== files.length ||
    urls.some((url) => !firstText(url))
  ) {
    throw new Error("Image upload did not complete. Please try again.");
  }
  return urls;
};
