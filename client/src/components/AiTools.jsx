import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleNavigate = (path) => {
    if (!user) {
      alert("Please sign in to access this tool.");
      return;
    }
    navigate(path);
  };

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      {/* Section header */}
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Powerful AI Tools
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto mt-4">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </div>

      {/* Tools grid */}
      <div className="flex flex-wrap mt-10 justify-center gap-6">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="p-6 sm:p-8 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-start"
            onClick={() => handleNavigate(tool.path)}
          >
            {/* Tool icon with gradient background */}
            <div
              className="w-12 h-12 p-3 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            >
              <tool.Icon className="w-6 h-6 text-white" />
            </div>

            {/* Tool title */}
            <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>

            {/* Tool description */}
            <p className="text-gray-400 text-sm">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
