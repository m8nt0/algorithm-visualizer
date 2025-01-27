import type { VisualizationStep } from '$lib/types/Visualization';

export type GenerateStepsFunction = (array: number[]) => VisualizationStep[];
export type GenerateSearchStepsFunction = (array: number[], target: number) => VisualizationStep[];

export type GraphElement = {
    id: string | number;
    value: any;
    isVisited: boolean;
    isProcessing: boolean;
    x?: number;
    y?: number;
};

export type GraphEdge = {
    from: string | number;
    to: string | number;
    weight?: number;
    isHighlighted: boolean;
};

export type Graph = {
    vertices: Map<string | number, GraphElement>;
    edges: GraphEdge[];
    isDirected: boolean;
}; 