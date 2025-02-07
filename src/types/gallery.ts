
import type { YOLOAnnotation } from "@/utils/yoloParser";

export interface ImageData {
  id: string;
  imageUrl: string;
  originalFileName: string;  // Added this field
  annotations: YOLOAnnotation[];
  showAnnotations: boolean;
}
