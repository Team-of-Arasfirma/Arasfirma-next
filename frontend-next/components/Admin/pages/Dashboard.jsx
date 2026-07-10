"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    products: 0,
    projects: 0,
    careers: 0,
    applications: 0,
    inquiries: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/dashboard");
        setStats(data.stats || {});
        setRecentActivities(data.recentActivities || []);
        setRecentApplications(data.recentApplications || []);
        setRecentInquiries(data.recentInquiries || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Blogs",
      count: stats.blogs,
      link: "/admin/blogs",
      color: "bg-indigo-500",
    },
    {
      title: "Total Products",
      count: stats.products,
      link: "/admin/products",
      color: "bg-emerald-500",
    },
    {
      title: "Total Projects",
      count: stats.projects,
      link: "/admin/projects",
      color: "bg-blue-500",
    },
    {
      title: "Total Careers",
      count: stats.careers,
      link: "/admin/careers",
      color: "bg-purple-500",
    },
    {
      title: "Applications",
      count: stats.applications,
      link: "/admin/applications",
      color: "bg-amber-500",
    },
    {
      title: "Inquiries",
      count: stats.inquiries,
      link: "/admin/inquiries",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6 flex flex-col items-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {card.title}
              </p>
              <p className="mt-2 text-4xl font-extrabold text-gray-900">
                {loading ? "..." : card.count || 0}
              </p>
            </div>
            <div className={`${card.color} px-6 py-3`}>
              <Link
                href={card.link}
                className="text-sm font-medium text-white hover:text-gray-100 flex justify-center items-center"
              >
                View Details
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/blogs"
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
          >
            Write New Blog
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
          >
            Add Product
          </Link>
          <Link
            href="/admin/careers"
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
          >
            Add Career
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity.</p>
            ) : (
              recentActivities.map((item, index) => (
                <div
                  key={`${item.type}-${index}`}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.type} -{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Recent Applications
          </h3>
          <div className="space-y-3">
            {recentApplications.length === 0 ? (
              <p className="text-sm text-gray-500">No applications yet.</p>
            ) : (
              recentApplications.map((item) => (
                <div
                  key={item._id}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {item.name || item.fullName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.jobTitle} - {item.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Recent Inquiries
          </h3>
          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-gray-500">No inquiries yet.</p>
            ) : (
              recentInquiries.map((item) => (
                <div
                  key={item._id}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.subject} - {item.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
