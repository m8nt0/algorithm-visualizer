import type { VisualizationStep } from '$lib/types/Visualization';

export function generateInsertionSortSteps(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];

    steps.push({
        description: "Initial array",
        data: [...arr],
        highlights: []
    });

    for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        let j = i - 1;

        steps.push({
            description: `Inserting ${current}`,
            data: [...arr],
            highlights: [i]
        });

        while (j >= 0 && arr[j] > current) {
            steps.push({
                description: `Comparing ${arr[j]} with ${current}`,
                data: [...arr],
                highlights: [j, i]
            });

            arr[j + 1] = arr[j];
            steps.push({
                description: `Moving ${arr[j]} one position right`,
                data: [...arr],
                highlights: [j, j + 1]
            });

            j--;
        }

        arr[j + 1] = current;
        steps.push({
            description: `Placing ${current} at position ${j + 1}`,
            data: [...arr],
            highlights: [j + 1]
        });
    }

    steps.push({
        description: "Array is sorted!",
        data: [...arr],
        highlights: []
    });

    return steps;
} 