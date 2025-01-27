export type VisualizationType = 
    | 'array'
    | 'graph'
    | 'tree'
    | 'matrix'
    | 'string'
    | 'linkedlist'
    | 'stack'
    | 'queue'
    | 'heap';

export type DataStructureType = VisualizationType;

export interface VisualizationStep {
    description: string;
    data: number[] | (number | null)[] | any;
    highlights: number[];
    swapping?: [number, number];
    type?: 'comparison' | 'swap' | 'info';
    codeHighlights?: number[];
}

export interface AlgorithmStep {
    lines: number[];
    description: string;
}

export interface AlgorithmImplementation {
    code: string;
    steps: AlgorithmStep[];
}

export interface LanguageImplementations {
    [key: string]: AlgorithmImplementation;
}

export interface AlgorithmImplementations {
    [key: string]: LanguageImplementations;
}

export interface VisualizationState {
    steps: VisualizationStep[];
    currentStep: number;
    isPlaying: boolean;
    speed: number;
}

export interface Activity {
    id?: string;
    type: 'visualization' | 'interactive' | 'step-by-step' | 'practice' | 'challenge';
    title: string;
    description: string;
    supportedStructures: VisualizationType[];
    data: {
        [key in VisualizationType]?: number[];
    };
    code: string;
    highlightSteps: {
        lines: number[];
        description: string;
    }[];
}

export interface Concept {
    title: string;
    description: string;
}

export interface Application {
    title: string;
    description: string;
    example?: string;
}

export interface AlgorithmExplanation {
    title: string;
    steps: string[];
    complexity: {
        time: string;
        space: string;
        best: string;
    };
    useCases: string[];
    activities: Activity[];
    keyConcepts: Concept[];
    applications: Application[];
}

export interface DataStructureExplanation {
    title: string;
    description?: string;
    operations: {
        name: string;
        description: string;
        complexity: string;
    }[];
    useCases: string[];
    advantages?: string[];
    disadvantages?: string[];
}

export type AlgorithmExplanations = Record<string, AlgorithmExplanation>;
export type DataStructureExplanations = Record<string, DataStructureExplanation>;

export interface Algorithm {
    id: string;
    name: string;
    description: string;
    complexity: {
        time: string;
        space: string;
        best?: string;
    };
    visualizationType: VisualizationType;
    isPremium: boolean;
}

export interface AlgorithmVisualizerProps {
    algorithm: Algorithm;
    currentStep?: number;
    highlightedLines?: number[];
    initialData?: number[];
    currentActivity?: Activity | null;
} 