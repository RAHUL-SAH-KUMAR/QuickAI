import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error("Please enter a keyword");
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword "${input}" in the category "${selectedCategory}"`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-wrap gap-4 text-slate-700">
      {/* Left column: Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        <label className="text-sm font-semibold">Keyword</label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="w-full p-2 rounded-md border border-gray-300 text-sm outline-none"
          placeholder="The future of artificial intelligence is..."
          required
        />

        <label className="text-sm font-medium mt-2">Category</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-3 py-1 border rounded-full cursor-pointer transition-colors ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex justify-center items-center gap-2 bg-gradient-to-r from-[#c341f6] to-[#8e37eb] text-white px-4 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <Hash className="w-5 h-5" />
          )}
          Generate title
        </button>
      </form>

      {/* Right column: Generated titles */}
      <div className="w-full max-w-lg p-6 bg-white rounded-lg border border-gray-200 min-h-[24rem] flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-5 h-5 text-[#8e37eb]" />
          <h2 className="text-xl font-semibold">Generated Titles</h2>
        </div>

        {!content ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <Hash className="w-9 h-9" />
            <p>Enter a topic and click "Generate title" to get started</p>
          </div>
        ) : (
          <div className="overflow-y-auto text-sm text-slate-600">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
