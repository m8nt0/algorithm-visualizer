import type { VisualizationStep } from '$lib/types/Visualization';

export function generateQuickSortSteps(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];

    steps.push({
        description: "Initial array",
        data: [...arr],
        highlights: []
    });

    function quickSort(low: number, high: number) {
        if (low < high) {
            steps.push({
                description: `Selecting pivot element ${arr[high]}`,
                data: [...arr],
                highlights: [high]
            });

            let pivot = arr[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                steps.push({
                    description: `Comparing ${arr[j]} with pivot ${pivot}`,
                    data: [...arr],
                    highlights: [j, high]
                });

                if (arr[j] <= pivot) {
                    i++;
                    if (i !== j) {
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                        steps.push({
                            description: `Swapping ${arr[i]} and ${arr[j]}`,
                            data: [...arr],
                            highlights: [i, j]
                        });
                    }
                }
            }

            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            steps.push({
                description: `Placing pivot ${pivot} in its correct position`,
                data: [...arr],
                highlights: [i + 1]
            });

            const pivotIndex = i + 1;
            quickSort(low, pivotIndex - 1);
            quickSort(pivotIndex + 1, high);
        }
    }

    quickSort(0, arr.length - 1);

    steps.push({
        description: "Array is sorted!",
        data: [...arr],
        highlights: []
    });

    return steps;
} 