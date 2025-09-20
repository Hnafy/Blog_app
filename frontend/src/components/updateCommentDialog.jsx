import { useEffect, useRef, useState } from "react";

export default function UpdateDialog({ open, initialValue, onClose, onUpdate }) {
  const [value, setValue] = useState(initialValue || "");
  const inputRef = useRef(null);

  // Sync prop -> state whenever dialog opens or initialValue changes
  useEffect(() => {
    if (open) {
      setValue(initialValue || "");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, initialValue]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onUpdate?.(value.trim());
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 animate-scaleIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold tracking-wide">Update Comment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-white transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Edit your comment..."
          />

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 cursor-pointer py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 cursor-pointer py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition-colors shadow-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
