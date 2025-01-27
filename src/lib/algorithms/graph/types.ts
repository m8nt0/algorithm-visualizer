export type Vertex = {
    id: string | number;
    value: any;
    isVisited: boolean;
    isProcessing: boolean;
    x?: number;
    y?: number;
};

export type Edge = {
    from: string | number;
    to: string | number;
    weight?: number;
    isHighlighted: boolean;
};

export type Graph = {
    vertices: Map<string | number, Vertex>;
    edges: Edge[];
    isDirected: boolean;
}; 