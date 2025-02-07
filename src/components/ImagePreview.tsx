
import { useEffect, useRef } from "react";
import type { YOLOAnnotation } from "@/utils/yoloParser";

interface ImagePreviewProps {
  imageUrl: string;
  annotations: YOLOAnnotation[];
}

export const ImagePreview = ({ imageUrl, annotations }: ImagePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      // Set canvas size to match container width while maintaining aspect ratio
      const containerWidth = container.clientWidth;
      const scale = containerWidth / image.width;
      canvas.width = containerWidth;
      canvas.height = image.height * scale;

      // Draw image scaled to fit container
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw annotations
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;

      annotations.forEach((ann) => {
        const x = ann.x * canvas.width;
        const y = ann.y * canvas.height;
        const width = ann.width * canvas.width;
        const height = ann.height * canvas.height;

        // Calculate actual coordinates (YOLO format uses center coordinates)
        const left = x - width / 2;
        const top = y - height / 2;

        ctx.strokeRect(left, top, width, height);
      });
    };
  }, [imageUrl, annotations]);

  return (
    <div ref={containerRef} className="w-full aspect-video bg-gray-100">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
