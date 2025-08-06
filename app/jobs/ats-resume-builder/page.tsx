"use client"

import React, { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import Lottie, { LottieComponentProps } from "lottie-react";
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const slides = [
  {
    src: "/rb/temp1.png",
    alt: "Elegant Resume Template 1",
    href: ""
  },
  {
    src: "/rb/temp2.png",
    alt: "Elegant Resume Template 2",
    href: ""
  },
  {
    src: "/rb/temp3.png",
    alt: "Elegant Resume Template 3",
    href: ""
  },
  {
    src: "/rb/temp4.png",
    alt: "Elegant Resume Template 4",
    href: ""
  },
  {
    src: "/rb/temp5.png",
    alt: "Elegant Resume Template 5",
    href: ""
  },
  {
    src: "/rb/temp6.png",
    alt: "Elegant Resume Template 6",
    href: ""
  },
  {
    src: "/rb/temp7.png",
    alt: "Elegant Resume Template 7",
    href: ""
  },

];

export default function Page() {
  const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);
  const [showImportPrompt, setShowImportPrompt] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const loadAnimation = async () => {
      const res = await fetch("/loaders/hello.json");
      const json = await res.json();
      setAnimationData(json);
    };
    loadAnimation();
  }, []);

  const handleYes = () => {
    router.push("/jobs/ats-resume-builder/upload")
  }

  const handleNo = () => {
    setShowImportPrompt(false);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="flex items-center justify-between py-5 px-4 border-b">
        {/* Left: Back Icon */}
        <button
          onClick={() => {
            if(showImportPrompt){
                 window.history.back()
              
            }else{
                 setShowImportPrompt(true)
            }
           
        }}
          aria-label="Go back"
          className="cursor-pointer text-gray-600 hover:text-black"
        >
          <ChevronLeft size={35} />
        </button>

        {/* Middle: Step Progress */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
            1
          </div>
          <div className="h-px w-10 bg-gray-300" />
          <div className={`w-8 h-8 rounded-full ${showImportPrompt ? 'bg-gray-200 text-gray-700' : 'bg-green-500 text-white'} flex items-center justify-center text-sm`}>
            2
          </div>
          <div className="h-px w-10 bg-gray-300" />
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm">
            3
          </div>
        </div>

        {/* Right: Login Button (can be added later) */}
        <div className="w-16" />
      </div>

      {/* Import Prompt */}
      {showImportPrompt ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
          <h1 className="font-mona-sans text-[32px] font-normal leading-[38px] mb-4 mt-8 text-[#2d3639]">
            Would you like to import your existing resume?
          </h1>
          <div className="flex flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={handleYes}
              className="px-6 py-2 rounded bg-green-500 text-white font-medium transition hover:bg-green-600"
            >
              Yes
            </button>
            <button
              onClick={handleNo}
              className="px-6 py-2 rounded bg-violet-500 text-white font-medium transition hover:bg-violet-600"
            >
              No
            </button>
          </div>
        </div>
      ) : (
          <div className="flex flex-col items-center justify-center mt-8">
          <h2 className="font-mona-sans text-[32px] font-normal leading-[38px] mb-4 mt-8 text-[#2d3639]">
            Please select a template for your resume. 
          </h2>

          {/* Template Grid */}
          <div className="flex flex-wrap justify-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="embla__slide p-2 md:p-4 flex-[0_0_100%] md:flex-[0_0_33.3333%] lg:flex-[0_0_20%]"
              >
                <a
                  href={slide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full group"
                >
                  <div
                    className="flex flex-col justify-between h-full rounded-md shadow transition-colors duration-300 bg-[rgba(156,178,220,0.2)] hover:bg-[rgb(45,92,141)]"
                    style={{ padding: '24px' }}
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
                      <button className="text-white text-sm px-4 py-2 rounded bg-[#2dc08d] transition">
                        Start With This Template
                      </button>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}