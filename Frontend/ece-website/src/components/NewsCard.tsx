import React from "react";

export interface NewsCardProps {
    shortDescription: string;
    instagramUrl: string;
    imageUrl: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
    shortDescription,
    instagramUrl,
    imageUrl,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition flex flex-col md:flex-row border border-gray-100">
            <div className="w-full md:w-1/4 h-48 md:h-auto bg-gray-200">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="News"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No image
                    </div>
                )}
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-gray-700 line-clamp-2">{shortDescription}</p>
                    <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm mt-2 block hover:underline truncate"
                    >
                        {instagramUrl}
                    </a>
                </div>

                <div className="mt-4 flex gap-2 self-end">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="px-4 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition text-white text-sm font-medium"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="px-4 py-1.5 bg-red-600 rounded-lg hover:bg-red-500 transition text-white text-sm font-medium"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
