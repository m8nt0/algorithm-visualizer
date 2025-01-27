import type { VisualizationType } from './Visualization';

export type AlgorithmId = 
    // Sorting
    | 'bubble-sort'
    | 'quick-sort'
    | 'merge-sort'
    | 'insertion-sort'
    | 'selection-sort'
    | 'heap-sort'
    | 'shell-sort'
    | 'counting-sort'
    | 'radix-sort'
    // Searching
    | 'linear-search'
    | 'binary-search'
    | 'jump-search'
    | 'interpolation-search'
    // Graph
    | 'bfs'
    | 'dfs'
    | 'dijkstra'
    | 'bellman-ford'
    | 'prim'
    | 'kruskal'
    // Dynamic Programming
    | 'fibonacci'
    | 'lcs'
    | 'knapsack'
    | 'edit-distance';


export interface Algorithm {
    id: AlgorithmId;
    name: string;
    description: string;
    complexity: {
        time: string;
        space: string;
        best?: string;
        average?: string;
        worst?: string;
    };
    visualizationType: VisualizationType;
    isPremium: boolean;
    tags?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AlgorithmCategory {
    name: string;
    description: string;
    algorithms: Algorithm[];
} 