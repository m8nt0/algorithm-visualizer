import { generateBubbleSortSteps } from './bubbleSort';
import { generateQuickSortSteps } from './quickSort';
import { generateMergeSortSteps } from './mergeSort';
import { generateInsertionSortSteps } from './insertionSort';
import { generateSelectionSortSteps } from './selectionSort';
import type { VisualizationStep } from '$lib/types/Visualization';

export function generateSortingSteps(array: number[], algorithmId: string): VisualizationStep[] {
    switch (algorithmId) {
        case 'bubble-sort':
            return generateBubbleSortSteps([...array]);
        case 'quick-sort':
            return generateQuickSortSteps([...array]);
        case 'merge-sort':
            return generateMergeSortSteps([...array]);
        case 'insertion-sort':
            return generateInsertionSortSteps([...array]);
        case 'selection-sort':
            return generateSelectionSortSteps([...array]);
        default:
            return [{
                description: "Algorithm not implemented",
                data: array,
                highlights: []
            }];
    }
}