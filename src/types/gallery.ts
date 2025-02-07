
import type { YOLOAnnotation } from "@/utils/yoloParser";

export interface ImageData {
  id: string;
  imageUrl: string;
  annotations: YOLOAnnotation[];
  showAnnotations: boolean;
}
