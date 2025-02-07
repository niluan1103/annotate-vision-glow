
import { useState } from "react";
import { Eye, EyeOff, Upload, Trash2 } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import { FileUpload } from "./FileUpload";
import { toast } from "sonner";
import type { ImageData } from "@/types/gallery";
import { parseYOLOFile } from "@/utils/yoloParser";

interface ImageCardProps {
  imageData: ImageData;
  onUpdate: (id: string, updates: Partial<ImageData>) => void;
  onDelete: (id: string) => void;
}

export const ImageCard = ({ imageData, onUpdate, onDelete }: ImageCardProps) => {
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

  // Extract filename from URL
  const fileName = imageData.imageUrl.split("/").pop() || "Image";

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
            className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
            title={imageData.showAnnotations ? "Hide annotations" : "Show annotations"}
          >
            {imageData.showAnnotations ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setShowLabelUpload(!showLabelUpload)}
            className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
            title="Upload labels"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(imageData.id)}
            className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors hover:bg-red-100"
            title="Delete image"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="px-3 py-2 border-t">
        <p className="text-sm text-gray-600 truncate" title={fileName}>
          {fileName}
        </p>
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
