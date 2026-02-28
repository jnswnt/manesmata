"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectImageSliderProps {
    images: string[];
    title: string;
}

export default function ProjectImageSlider({ images, title }: ProjectImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length, nextSlide]);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 flex-col gap-4">
                <span className="text-6xl text-gray-300">🖼️</span>
                <p className="font-black uppercase text-gray-400">No Images</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full group overflow-hidden bg-white">
            {/* Slides */}
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={img}
                            alt={`${title} - ${index + 1}`}
                            className="w-full h-full object-contain p-2"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 neo-button p-4 bg-white hover:bg-[var(--color-primary)] transition-all opacity-0 group-hover:opacity-100 z-10 scale-110 active:scale-95 shadow-[4px_4px_0px_#000]"
                    >
                        <ChevronLeft size={28} strokeWidth={3} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 neo-button p-4 bg-white hover:bg-[var(--color-primary)] transition-all opacity-0 group-hover:opacity-100 z-10 scale-110 active:scale-95 shadow-[4px_4px_0px_#000]"
                    >
                        <ChevronRight size={28} strokeWidth={3} />
                    </button>

                    {/* Dots / Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.preventDefault(); setCurrentIndex(index); }}
                                className={`h-3 border-2 border-black transition-all shadow-[1px_1px_0px_#000] ${currentIndex === index ? "bg-black w-8" : "bg-white w-3"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Counter */}
            <div className="absolute top-6 right-6 neo-box px-4 py-2 bg-white text-sm font-black z-10 shadow-[4px_4px_0px_#000] border-2 border-black">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
