"use client";

const AccessDeniedModal = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
          ⚠️
        </div>

        <h2 className="text-2xl font-black text-gray-900">Access Denied</h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {message || "You don't have permission to perform this action."}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedModal;