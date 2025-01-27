import type { VisualizationType } from './Visualization';

export type DataStructureId = 
    | 'array'
    | 'linkedlist'
    | 'stack'
    | 'queue'
    | 'binary-tree'
    | 'bst'
    | 'heap'
    | 'graph'
    | 'hash-table';

export interface DataStructure {
    id: DataStructureId;
    name: string;
    description: string;
    operations: {
        name: string;
        description: string;
        complexity: {
            time: string;
            space: string;
        };
    }[];
    visualizationType: VisualizationType;
    isPremium: boolean;
} 