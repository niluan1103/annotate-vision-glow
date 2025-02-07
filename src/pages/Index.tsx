
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { parseYOLOFile } from "@/utils/yoloParser";
import { toast } from "sonner";
import type { YOLOAnnotation } from "@/utils/yoloParser";

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [annotations, setAnnotations] = useState<YOLOAnnotation[]>([]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    toast.success("Image uploaded successfully");
  };

  const handleLabelUpload = async (file: File) => {
    try {
      const content = await file.text();
      const parsedAnnotations = parseYOLOFile(content);
      
      if (parsedAnnotations.length === 0) {
        toast.error("No valid annotations found in the file");
        return;
      }

      setAnnotations(parsedAnnotations);
      toast.success(`Loaded ${parsedAnnotations.length} annotations`);
    } catch (error) {
      toast.error("Failed to parse the label file");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            YOLO Annotation Viewer
          </h1>
          <p className="text-gray-600">
            Upload an image and its YOLO format annotation file to visualize the bounding boxes
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Image File
              </label>
              <FileUpload
                type="image"
                accept="image/*"
                onImageUpload={handleImageUpload}
                onLabelUpload={handleLabelUpload}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Label File (YOLO format)
              </label>
              <FileUpload
                type="label"
                accept=".txt"
                onImageUpload={handleImageUpload}
                onLabelUpload={handleLabelUpload}
              />
            </div>
          </div>

          {imageUrl && (
            <div className="mt-8 space-y-2">
              <h2 className="text-lg font-medium text-gray-900">Preview</h2>
              <ImagePreview imageUrl={imageUrl} annotations={annotations} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
