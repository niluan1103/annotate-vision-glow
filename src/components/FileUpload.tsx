
import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onImageUpload: (files: File[]) => void;
  onLabelUpload: (file: File) => void;
  accept: string;
  type: "image" | "label";
}

export const FileUpload = ({ onImageUpload, onLabelUpload, accept, type }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (type === "image") {
        const files = Array.from(e.dataTransfer.files);
        onImageUpload(files);
      } else {
        const file = e.dataTransfer.files?.[0];
        if (file) onLabelUpload(file);
      }
    },
    [onImageUpload, onLabelUpload, type]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "image") {
        const files = e.target.files ? Array.from(e.target.files) : [];
        onImageUpload(files);
      } else {
        const file = e.target.files?.[0];
        if (file) onLabelUpload(file);
      }
    },
    [onImageUpload, onLabelUpload, type]
  );

  return (
    <div
      className={cn(
        "relative w-full h-28 border-2 border-dashed rounded-lg transition-colors duration-200",
        isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400 bg-gray-50"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        multiple={type === "image"}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center justify-center h-full gap-2">
        {type === "image" ? (
          <ImageIcon className="w-6 h-6 text-gray-400" />
        ) : (
          <FileText className="w-6 h-6 text-gray-400" />
        )}
        <p className="text-xs text-gray-600">
          Drop your {type} {type === "image" ? "files" : "file"} here or click to browse
        </p>
      </div>
    </div>
  );
};
