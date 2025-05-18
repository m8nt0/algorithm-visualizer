export interface VisualElement {
  type: "circle" | "rect" | "line" | "text";
  text?: string;
  position: { x: number; y: number };
  endPosition?: { x: number; y: number }; // For lines
  color?: string;
  size?: number;
  highlighted?: boolean;
}

export interface CodeSample {
  code: string;
  language: string;
}

export interface ComplexityInfo {
  time: string;
  space: string;
}

export interface VisualizationState {
  step: number;
  totalSteps: number;
  description: string;
  elements: VisualElement[];
}

export type SupportedLanguage = 'typescript' | 'python' | 'javascript' | 'cpp' | 'java'; 