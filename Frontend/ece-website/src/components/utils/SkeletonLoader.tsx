import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen pt-40 px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-blue-900 text-center animate-pulse">
          Loading Projects...
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-300 rounded-xl h-[350px] p-4 flex flex-col animate-pulse"
            >
              <div className="bg-gray-400 h-40 w-full rounded-lg mb-4" />
              <div className="h-6 bg-gray-400 rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-400 rounded w-full" />
              <div className="h-4 bg-gray-400 rounded w-5/6 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
