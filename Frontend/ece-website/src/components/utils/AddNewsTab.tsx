import { useState, useEffect } from "react";
import type { FormEvent } from "react";

interface News {
    id: number;
    shortDescription: string;
    instagramUrl: string;
    imageUrl?: string;
}

interface AddNewsTabProps {
    newsToEdit?: News;
    onSaved?: () => void;
}

const AddNewsTab = ({ newsToEdit, onSaved }: AddNewsTabProps) => {
    const [formData, setFormData] = useState({
        shortDescription: "",
        instagramUrl: "",
    });

    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (newsToEdit) {
            setFormData({
                shortDescription: newsToEdit.shortDescription,
                instagramUrl: newsToEdit.instagramUrl,
            });
        }
    }, [newsToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("shortDescription", formData.shortDescription);
        data.append("instagramUrl", formData.instagramUrl);
        if (image) {
            data.append("image", image);
        } else if (!newsToEdit) {
            alert("Image is required for new news items");
            return;
        }

        try {
            const url = newsToEdit ? `/api/news/${newsToEdit.id}` : "/api/news";
            const method = newsToEdit ? "PUT" : "POST";
            const token = localStorage.getItem("jwt");

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to save news");

            alert(newsToEdit ? "News updated!" : "News added!");

            setFormData({ shortDescription: "", instagramUrl: "" });
            setImage(null);
            onSaved?.();
        } catch (err) {
            console.error(err);
            alert("Failed to save news");
        }
    };

    const inputStyle =
        "w-full p-3 rounded bg-gray-200 text-black placeholder-gray-500 focus:outline-none";

    return (
        <div className="p-6 pb-24">
            <h2 className="text-2xl font-semibold mb-6 text-stone-950">
                {newsToEdit ? "Update News" : "Add New News Item"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-gray-400 p-6 rounded-xl shadow-lg mb-12"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                        Short Description
                    </label>
                    <textarea
                        placeholder="Enter a short description (max 1200 chars)"
                        className={inputStyle}
                        rows={4}
                        maxLength={1200}
                        value={formData.shortDescription}
                        onChange={(e) =>
                            setFormData({ ...formData, shortDescription: e.target.value })
                        }
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                        Instagram URL
                    </label>
                    <input
                        type="url"
                        placeholder="https://www.instagram.com/p/..."
                        className={inputStyle}
                        value={formData.instagramUrl}
                        onChange={(e) =>
                            setFormData({ ...formData, instagramUrl: e.target.value })
                        }
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                        News Image
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-200 text-black rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-300 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p className="text-sm">
                                {image ? image.name : newsToEdit?.imageUrl ? "Change Image" : "Select Image"}
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        className="flex-grow px-6 py-4 sm:py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition text-white font-semibold text-lg sm:text-base shadow-md"
                    >
                        {newsToEdit ? "Update News" : "Add News"}
                    </button>
                    {newsToEdit && (
                        <button
                            type="button"
                            onClick={() => onSaved?.()}
                            className="px-6 py-4 sm:py-3 bg-gray-500 rounded-lg hover:bg-gray-600 transition text-white font-semibold text-lg sm:text-base shadow-md"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddNewsTab;
