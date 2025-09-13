import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(item.created_at).toLocaleDateString();

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl w-full bg-white border border-gray-200 rounded-lg cursor-pointer transition hover:shadow-md"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <h2 className="font-medium text-slate-800">{item.prompt}</h2>
          <p className="text-gray-500 text-xs mt-1">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {formattedDate}
          </p>
        </div>
        <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-3 py-1 rounded-full text-xs font-semibold">
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3">
          {item.type === "image" ? (
            <img
              src={item.content}
              alt="Generated content"
              className="w-full max-w-md rounded-md object-cover"
            />
          ) : (
            <div className="mt-2 h-full overflow-y-auto text-sm text-slate-700">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
