
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ImageCard } from "@/components/ImageCard";
import { parseYOLOFile } from "@/utils/yoloParser";
import { toast } from "sonner";
import type { ImageData } from "@/types/gallery";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const Index = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleImageUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages: ImageData[] = validFiles.map(file => ({
      id: crypto.randomUUID(),
      imageUrl: URL.createObjectURL(file),
      annotations: [],
      showAnnotations: true,
    }));
    
    setImages(prev => [...prev, ...newImages]);
    toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploaded successfully`);
  };

  const handleLabelUpload = async (file: File) => {
    if (images.length === 0) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      const content = await file.text();
      const parsedAnnotations = parseYOLOFile(content);
      
      if (parsedAnnotations.length === 0) {
        toast.error("No valid annotations found in the file");
        return;
      }

      setImages((prev) => {
        const lastImage = prev[prev.length - 1];
        return prev.map((img) =>
          img.id === lastImage.id
            ? { ...img, annotations: parsedAnnotations }
            : img
        );
      });
      
      toast.success(`Loaded ${parsedAnnotations.length} annotations`);
    } catch (error) {
      toast.error("Failed to parse the label file");
      console.error(error);
    }
  };

  const updateImage = (id: string, updates: Partial<ImageData>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    toast.success("Image deleted successfully");
  };

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleImages = images.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            YOLO Annotation Viewer
          </h1>
          <p className="text-gray-600">
            Upload images and their YOLO format annotation files to visualize the bounding boxes
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Image Files
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

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleImages.map((imageData) => (
                  <ImageCard
                    key={imageData.id}
                    imageData={imageData}
                    onUpdate={updateImage}
                    onDelete={deleteImage}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="flex items-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
