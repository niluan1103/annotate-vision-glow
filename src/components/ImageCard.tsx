
import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import { FileUpload } from "./FileUpload";
import { toast } from "sonner";
import type { ImageData } from "@/types/gallery";
import type { YOLOAnnotation } from "@/utils/yoloParser";
import { parseYOLOFile } from "@/utils/yoloParser";

interface ImageCardProps {
  imageData: ImageData;
  onUpdate: (id: string, updates: Partial<ImageData>) => void;
}

export const ImageCard = ({ imageData, onUpdate }: ImageCardProps) => {
  const [showLabelUpload, setShowLabelUpload] = useState(false);

  const handleLabelUpload = async (file: File) => {
    try {
      const content = await file.text();
      const parsedAnnotations = parseYOLOFile(content);
      
      if (parsedAnnotations.length === 0) {
        toast.error("No valid annotations found in the file");
        return;
      }

      onUpdate(imageData.id, { annotations: parsedAnnotations });
      setShowLabelUpload(false);
      toast.success(`Updated ${parsedAnnotations.length} annotations`);
    } catch (error) {
      toast.error("Failed to parse the label file");
      console.error(error);
    }
  };

  const toggleAnnotations = () => {
    onUpdate(imageData.id, { showAnnotations: !imageData.showAnnotations });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <ImagePreview 
          imageUrl={imageData.imageUrl} 
          annotations={imageData.showAnnotations ? imageData.annotations : []} 
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={toggleAnnotations}
            className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            {imageData.showAnnotations ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setShowLabelUpload(!showLabelUpload)}
            className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
      {showLabelUpload && (
        <div className="p-4 border-t">
          <FileUpload
            type="label"
            accept=".txt"
            onImageUpload={() => {}}
            onLabelUpload={handleLabelUpload}
          />
        </div>
      )}
    </div>
  );
};
