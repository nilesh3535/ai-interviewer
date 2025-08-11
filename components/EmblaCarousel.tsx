"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
  href: string;
};

interface Props {
  slides: Slide[];
  handleRedirect: () => void;
}

export default function EmblaCarousel({ slides, handleRedirect }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative bg-white px-4 md:px-8">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="embla__slide p-2 md:p-4 flex-[0_0_100%] md:flex-[0_0_33.3333%] lg:flex-[0_0_20%]"
            >
              <div className="block h-full group">
                <div
                  className="flex flex-col justify-between h-full rounded-md shadow transition-colors duration-300 bg-[rgba(156,178,220,0.2)] hover:bg-[rgb(45,92,141)]"
                  style={{ padding: "24px" }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={549}
                    height={778}
                    layout="responsive"
                    className="w-full h-auto object-cover"
                  />
                  <div className="text-center mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={handleRedirect}
                      className="text-white text-sm px-4 py-2 rounded bg-[#2dc08d] transition"
                    >
                      Start With This Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left arrow */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        aria-label="Scroll Left"
        className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 hover:bg-black/70 disabled:opacity-50"
      >
        <ChevronLeft />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        aria-label="Scroll Right"
        className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 hover:bg-black/70 disabled:opacity-50"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
              index === selectedIndex
                ? "bg-[#8c7cdb]"
                : "bg-[rgba(140,124,219,0.4)]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
