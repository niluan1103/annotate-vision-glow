
import { useEffect, useRef } from "react";
import type { YOLOAnnotation } from "@/utils/yoloParser";

interface ImagePreviewProps {
  imageUrl: string;
  annotations: YOLOAnnotation[];
}

export const ImagePreview = ({ imageUrl, annotations }: ImagePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw image
      ctx.drawImage(image, 0, 0);

      // Draw annotations
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;

      annotations.forEach((ann) => {
        const x = ann.x * image.width;
        const y = ann.y * image.height;
        const width = ann.width * image.width;
        const height = ann.height * image.height;

        // Calculate actual coordinates (YOLO format uses center coordinates)
        const left = x - width / 2;
        const top = y - height / 2;

        ctx.strokeRect(left, top, width, height);
      });
    };
  }, [imageUrl, annotations]);

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
      />
    </div>
  );
};
