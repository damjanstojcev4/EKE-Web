import type { FC } from "react";

interface SkeletonLoaderProps {
  count?: number; // how many skeleton items to render
  type?: "card" | "detail"; // shape of skeleton
}

const SkeletonLoader: FC<SkeletonLoaderProps> = ({ count = 3, type = "card" }) => {
  const shimmer =
    "relative overflow-hidden bg-gray-300 rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Image */}
            <div className={`h-48 ${shimmer}`} />

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className={`h-5 w-3/4 ${shimmer}`} />
              <div className={`h-4 w-full ${shimmer}`} />
              <div className={`h-4 w-2/3 ${shimmer}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className="animate-pulse max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
        {/* Image */}
        <div className={`h-64 w-full rounded-xl ${shimmer}`} />

        {/* Title */}
        <div className={`h-7 w-1/2 ${shimmer}`} />

        {/* Paragraph */}
        <div className="space-y-3">
          <div className={`h-4 w-full ${shimmer}`} />
          <div className={`h-4 w-5/6 ${shimmer}`} />
          <div className={`h-4 w-2/3 ${shimmer}`} />
        </div>

        {/* Button Placeholder */}
        <div className={`h-10 w-32 rounded-lg ${shimmer}`} />
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
