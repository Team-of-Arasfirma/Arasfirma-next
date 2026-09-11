"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  API_BASE_URL,
  FALLBACK_IMAGE,
  assertProjectApiUrl,
  categoryKey,
  formatTitleCase,
  firstText,
  extractProjects,
  isPublicProject,
  getProjectImage,
} from "@/lib/services/projectService";

const ProjectGallery = () => {
  const router = useRouter();
  const gridRef = useRef(null);

  const [active, setActive] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        assertProjectApiUrl();

        const response = await fetch(
          `${API_BASE_URL}/api/projects?status=published`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch projects");
        }

        const data = await response.json();

        const normalized = extractProjects(data)
          .filter(isPublicProject)
          .map((project, index) => ({
            id: project._id || project.id || `project-${index}`,
            name:
              firstText(project.title, project.name, project.projectName) ||
              "Untitled Project",
            category: firstText(project.category) || "General",
            categoryLabel: formatTitleCase(project.category || "General"),
            image: getProjectImage(project),
          }));

        if (!controller.signal.aborted) {
          setProjects(normalized);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    const cards = gridRef.current?.querySelectorAll('[data-animate="zoom"]');

    if (!cards?.length) return;

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [projects, active, loading, error]);

  const categories = [
    { key: "", label: "All" },
    ...Array.from(
      new Map(
        projects
          .filter((project) => project.category)
          .map((project) => [
            categoryKey(project.category),
            {
              key: categoryKey(project.category),
              label: project.categoryLabel,
            },
          ])
      ).values()
    ),
  ];

  const filtered =
    active === ""
      ? projects
      : projects.filter((project) => categoryKey(project.category) === active);

  const gridClassName =
    filtered.length > 0 && filtered.length < 3
      ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:justify-center"
      : "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="w-full bg-white">
      <div className="w-full bg-gray-50 px-6 pt-36 pb-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-10">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hover:text-red-500 transition-colors"
            >
              Home
            </button>

            <span>›</span>

            <span className="text-red-500 font-semibold">Project</span>
          </div>

          <h1
            data-animate="up"
            className="text-4xl font-black uppercase text-gray-900"
          >
            Project
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-24">
        <div
          data-animate="up"
          className="mx-auto mb-16 flex w-fit max-w-full flex-wrap items-center justify-center gap-3 rounded-2xl bg-gray-900 p-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActive(cat.key)}
              aria-pressed={active === cat.key}
              className="rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-200"
              style={{
                background: active === cat.key ? "#dc2626" : "transparent",
                color: active === cat.key ? "white" : "#9ca3af",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div ref={gridRef} aria-busy={loading} className={gridClassName}>
          {loading &&
            Array.from({ length: 6 }, (_, i) => (
              <div
                key={`skeleton-${i}`}
                aria-hidden="true"
                className="relative w-full overflow-hidden rounded-2xl bg-gray-200 animate-pulse sm:max-w-[430px]"
                style={{ aspectRatio: "4/3" }}
              >
                <div className="absolute bottom-5 left-5 h-4 w-1/2 rounded bg-gray-300" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
              </div>
            ))}

          {!loading &&
            !error &&
            filtered.map((proj, i) => (
              <div
                key={proj.id}
                data-animate="zoom"
                data-delay={i * 80}
                className="relative w-full overflow-hidden rounded-2xl shadow-sm group sm:max-w-[430px]"
                style={{ aspectRatio: "4/3", "--animate-delay": `${i * 80}ms` }}
              >
                <img
                  src={proj.image}
                  alt={proj.name}
                  draggable={false}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_IMAGE) {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }
                  }}
                />

                <div
                  className="absolute inset-0 opacity-100 transition-opacity duration-400"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 42%, transparent 72%)",
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 px-5 py-5 transition-transform duration-400 group-hover:-translate-y-1">
                  <p className="text-white font-black text-base uppercase tracking-wide">
                    {formatTitleCase(proj.name)}
                  </p>

                  <p className="text-red-300 text-xs font-semibold mt-1 uppercase tracking-wide">
                    {proj.categoryLabel}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 group-hover:h-1.5 transition-all duration-300" />
              </div>
            ))}
        </div>

        {loading && (
          <p role="status" className="sr-only">
            Loading projects...
          </p>
        )}

        {error && (
          <div role="alert" className="text-center py-24">
            <p className="text-gray-400 text-lg font-semibold">
              Unable to load projects. Please try again later.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div role="status" className="text-center py-24">
            <p className="text-4xl mb-4">🏗️</p>
            <p className="text-gray-400 text-lg font-semibold">
              No projects in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectGallery;