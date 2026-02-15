import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import defaultHeroBg from "../assets/o-bg.jpg"; // Using the team image as default fallback

interface NewsItem {
    id: number;
    shortDescription: string;
    instagramUrl: string;
    imageUrl: string;
    isFallback?: boolean;
}

const NewsCarousel: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("/api/news");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setNews(data);
                    } else {
                        setNews([getDefaultSlide()]);
                    }
                } else {
                    setNews([getDefaultSlide()]);
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
                setNews([getDefaultSlide()]);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const getDefaultSlide = (): NewsItem => ({
        id: -1,
        shortDescription: "Making a Difference Together: We are a non-governmental organization dedicated to creating positive change in our communities through collaborative efforts, sustainable projects, and unwavering commitment to our mission.",
        instagramUrl: "",
        imageUrl: defaultHeroBg,
        isFallback: true,
    });

    useEffect(() => {
        if (news.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [news]);

    if (loading) return (
        <div className="h-screen w-full bg-teal-700 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const currentNews = news[currentIndex];

    const handleSlideClick = () => {
        if (!currentNews.isFallback && currentNews.instagramUrl) {
            window.open(currentNews.instagramUrl, "_blank");
        }
    };

    return (
        <section id="hero" className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentNews.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-110"
                        style={{
                            backgroundImage: `url(${currentNews.imageUrl})`,
                            transform: `scale(${currentIndex % 2 === 0 ? 1.1 : 1})`
                        }}
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent md:from-black/60 md:via-black/30 md:to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-start justify-center pt-20 pb-20 px-6 md:px-24 lg:px-32 max-w-5xl">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full"
                        >
                            {currentNews.isFallback ? (
                                <>
                                    <h1 className="text-3xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl mb-4 md:mb-6">
                                        Making a Difference Together
                                    </h1>
                                    <p className="text-base md:text-xl text-gray-100 max-w-2xl leading-relaxed mb-8 md:mb-10 line-clamp-4 md:line-clamp-none">
                                        We are a non-governmental organization dedicated to creating
                                        positive change in our communities through collaborative efforts,
                                        sustainable projects, and unwavering commitment to our mission.
                                    </p>
                                    <button
                                        onClick={() => {
                                            const section = document.getElementById("about-projects");
                                            if (section) {
                                                section.scrollIntoView({ behavior: "smooth" });
                                            }
                                        }}
                                        className="px-6 py-3 md:px-8 md:py-4 bg-teal-600 text-white font-bold rounded-lg shadow-2xl hover:bg-teal-700 hover:scale-105 transition transform active:scale-95 text-sm md:text-base"
                                    >
                                        Discover Our Work
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="inline-block px-3 py-1 bg-teal-500 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest rounded mb-3 md:mb-4">
                                        Latest News
                                    </span>
                                    <h2 className="text-xl md:text-5xl font-bold text-white leading-tight drop-shadow-xl mb-6 md:mb-8 max-w-3xl line-clamp-6 md:line-clamp-6">
                                        {currentNews.shortDescription}
                                    </h2>
                                    <div className="flex flex-wrap gap-3 md:gap-4">
                                        <button
                                            onClick={handleSlideClick}
                                            className="px-6 py-3 md:px-8 md:py-4 bg-white text-black font-bold rounded-lg shadow-2xl hover:bg-gray-200 transition transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm md:text-base"
                                        >
                                            Read on Instagram
                                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const section = document.getElementById("about-projects");
                                                if (section) {
                                                    section.scrollIntoView({ behavior: "smooth" });
                                                }
                                            }}
                                            className="px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition transform hover:scale-105 active:scale-95 text-sm md:text-base"
                                        >
                                            Our Projects
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {news.length > 1 && (
                <>
                    {/* Arrows */}
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length)}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm hidden md:block"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % news.length)}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm hidden md:block"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 md:gap-3 z-20">
                        {news.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 ${currentIndex === index
                                    ? "bg-teal-500 w-8 md:w-10 h-2 md:h-2.5 shadow-[0_0_10px_rgba(20,184,166,0.8)]"
                                    : "bg-white/40 w-2 md:w-2.5 h-2 md:h-2.5 hover:bg-white/60"
                                    } rounded-full`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-[10px] md:text-xs gap-1 md:gap-2 hidden sm:flex"
            >
                <span>Scroll Down</span>
                <div className="w-px h-6 md:h-8 bg-gradient-to-b from-white/50 to-transparent" />
            </motion.div>
        </section>
    );
};

export default NewsCarousel;
