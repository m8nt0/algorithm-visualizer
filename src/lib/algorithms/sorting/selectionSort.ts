import type { VisualizationStep } from '$lib/types/Visualization';

export function generateSelectionSortSteps(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];

    steps.push({
        description: "Initial array",
        data: [...arr],
        highlights: []
    });

    for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        
        steps.push({
            description: `Looking for minimum element starting from position ${i}`,
            data: [...arr],
            highlights: [i]
        });

        for (let j = i + 1; j < arr.length; j++) {
            steps.push({
                description: `Comparing ${arr[j]} with current minimum ${arr[minIdx]}`,
                data: [...arr],
                highlights: [j, minIdx]
            });

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                steps.push({
                    description: `Found new minimum: ${arr[j]}`,
                    data: [...arr],
                    highlights: [j]
                });
            }
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            steps.push({
                description: `Swapping ${arr[i]} with ${arr[minIdx]}`,
                data: [...arr],
                highlights: [i, minIdx]
            });
        }

        steps.push({
            description: `Position ${i} is now sorted`,
            data: [...arr],
            highlights: [i]
        });
    }

    steps.push({
        description: "Array is sorted!",
        data: [...arr],
        highlights: []
    });

    return steps;
} 