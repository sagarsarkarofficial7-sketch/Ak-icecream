"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";

interface ProductBottleScrollProps {
  productFolder: string;
  mobileFolder?: string;
  totalFrames?: number;
  extension?: string;
  filenamePrefix?: string;
  zeroPad?: number;
  mobileFilenamePrefix?: string;
  mobileZeroPad?: number;
}

export default function ProductBottleScroll({
  productFolder,
  mobileFolder,
  totalFrames = 60,
  extension = "webp",
  filenamePrefix = "",
  zeroPad = 0,
  mobileFilenamePrefix = "",
  mobileZeroPad = 0
}: ProductBottleScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive logic to pick the correct folder
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeFolder = (isMobile && mobileFolder) ? mobileFolder : productFolder;
  const activePrefix = (isMobile && mobileFolder) ? mobileFilenamePrefix : filenamePrefix;
  const activePad = (isMobile && mobileFolder) ? mobileZeroPad : zeroPad;

  // Store images in a ref to avoid React reactivity checks during hot paths
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const PRELOAD_COUNT = 1;

  // Progressive Loading
  useEffect(() => {
    let isMounted = true;
    imagesRef.current = []; // dump previous cache on folder switch
    setImagesLoaded(false);

    const loadSequence = async () => {
      const initialLoads = [];
      for (let i = 1; i <= Math.min(PRELOAD_COUNT, totalFrames); i++) {
        initialLoads.push(loadImage(i));
      }

      await Promise.all(initialLoads);

      if (isMounted) {
        setImagesLoaded(true);
        drawFrame(1);

        const fetchRemainingFramesSequentially = async () => {
          for (let i = PRELOAD_COUNT + 1; i <= totalFrames; i++) {
            if (!isMounted) break;
            await loadImage(i);
          }
        };
        fetchRemainingFramesSequentially();
      }
    };

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const formattedIndex = activePad > 0 ? String(index).padStart(activePad, '0') : index;
        img.src = `${activeFolder}/${activePrefix}${formattedIndex}.${extension}`;

        img.onload = () => {
          if (isMounted) imagesRef.current[index] = img;
          resolve();
        };

        img.onerror = () => {
          resolve();
        }
      });
    }

    loadSequence();

    return () => { isMounted = false; };
  }, [activeFolder, totalFrames, extension, activePrefix, activePad]);

  // High-performance Draw logic
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img) return;

    const width = canvas.width;
    const height = canvas.height;

    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    });
  }, []);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndexRaw = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);
  
  const smoothedFrameIndex = useSpring(frameIndexRaw, { 
    stiffness: 80, 
    damping: 30,
    restDelta: 0.001
  });

  // Handles responsive canvas scaling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    if (imagesLoaded) {
      const rawVal = smoothedFrameIndex.get();
      const currentFrame = (isNaN(rawVal) || rawVal === undefined) ? 1 : Math.max(1, Math.min(totalFrames, Math.round(rawVal)));
      drawFrame(currentFrame);
    }
  }, [imagesLoaded, drawFrame, smoothedFrameIndex, totalFrames]);

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    return smoothedFrameIndex.onChange((latest) => {
      const targetFrame = Math.max(1, Math.min(totalFrames, Math.round(latest)));
      drawFrame(targetFrame);
    });
  }, [smoothedFrameIndex, totalFrames, drawFrame]);

  useEffect(() => {
    if (imagesLoaded) {
       let attempts = 0;
       const intervalId = setInterval(() => {
          const rawVal = smoothedFrameIndex.get();
          const currentFrame = (isNaN(rawVal) || rawVal === undefined) ? 1 : Math.max(1, Math.min(totalFrames, Math.round(rawVal)));
          
          drawFrame(currentFrame);
          drawFrame(1); 
          
          attempts++;
          if (attempts >= 20) clearInterval(intervalId);
       }, 50);
       
       return () => clearInterval(intervalId);
    }
  }, [imagesLoaded, drawFrame, smoothedFrameIndex, totalFrames]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {!imagesLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none opacity-50">
            <div className="w-12 h-12 border-2 border-chocolateBrown/20 border-t-pinkCream rounded-full animate-spin"></div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full mix-blend-multiply opacity-90 origin-center transition-opacity duration-[200ms]"
          style={{ opacity: imagesLoaded ? 1 : 0 }}
        />
      </div>
    </div>
  );
}



