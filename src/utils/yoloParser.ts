
export interface YOLOAnnotation {
  classId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const parseYOLOAnnotation = (line: string): YOLOAnnotation | null => {
  const parts = line.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const numbers = parts.map(Number);
  if (numbers.some(isNaN)) return null;

  const [classId, x, y, width, height] = numbers;
  return { classId, x, y, width, height };
};

export const parseYOLOFile = (content: string): YOLOAnnotation[] => {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(parseYOLOAnnotation)
    .filter((annotation): annotation is YOLOAnnotation => annotation !== null);
};
