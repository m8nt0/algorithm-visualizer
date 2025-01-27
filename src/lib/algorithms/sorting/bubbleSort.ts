import type { VisualizationStep as BaseVisualizationStep } from '$lib/types/Visualization';

// Extend the base type if needed
interface SortingVisualizationStep extends BaseVisualizationStep {
    swapping?: [number, number];
    type?: 'comparison' | 'swap' | 'info';
    codeHighlights?: number[];
}

export function generateBubbleSortSteps(
    array: number[], 
    variant: 'standard' | 'optimized' | 'recursive' | 'bidirectional' | 'oddeven' = 'standard'
): BaseVisualizationStep[] {
    const steps: BaseVisualizationStep[] = [];
    const arr = [...array];

    switch (variant) {
        case 'standard':
            return generateStandardBubbleSortSteps(arr);
        case 'optimized':
            return generateOptimizedBubbleSortSteps(arr);
        case 'recursive':
            return generateRecursiveBubbleSortSteps(arr);
        case 'bidirectional':
            return generateBidirectionalBubbleSortSteps(arr);
        case 'oddeven':
            return generateOddEvenBubbleSortSteps(arr);
        default:
            return generateStandardBubbleSortSteps(arr);
    }
}

function generateStandardBubbleSortSteps(arr: number[]): BaseVisualizationStep[] {
    const steps: BaseVisualizationStep[] = [];
    const n = arr.length;

    steps.push({
        description: "Starting with the initial array",
        data: [...arr],
        highlights: []
    });

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
                description: `Comparing elements at positions ${j} and ${j + 1}`,
                data: [...arr],
                highlights: [j, j + 1],
                type: 'comparison',
                codeHighlights: [6, 7]
            });

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                steps.push({
                    description: `Swapped ${arr[j]} and ${arr[j + 1]}`,
                    data: [...arr],
                    highlights: [j, j + 1],
                    swapping: [j, j + 1],
                    type: 'swap',
                    codeHighlights: [8, 9]
                });
            }
        }
        
        steps.push({
            description: `Pass ${i + 1} complete. Element ${arr[n - i - 1]} is in its final position`,
            data: [...arr],
            highlights: [n - i - 1]
        });
    }

    return steps;
}

function generateOptimizedBubbleSortSteps(arr: number[]): BaseVisualizationStep[] {
    const steps: BaseVisualizationStep[] = [];
    const n = arr.length;
    let swapped: boolean;

    steps.push({
        description: "Starting with the initial array",
        data: [...arr],
        highlights: []
    });

    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        steps.push({
            description: `Starting pass ${i + 1}. Last ${i} elements are already sorted.`,
            data: [...arr],
            highlights: Array.from({ length: i }, (_, idx) => n - 1 - idx)
        });

        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
                description: `Comparing elements at positions ${j} and ${j + 1}`,
                data: [...arr],
                highlights: [j, j + 1]
            });

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                steps.push({
                    description: `Swapped ${arr[j]} and ${arr[j + 1]}`,
                    data: [...arr],
                    highlights: [j, j + 1],
                    swapping: [j, j + 1]
                });
            }
        }

        if (!swapped) {
            steps.push({
                description: "No swaps needed - array is sorted!",
                data: [...arr],
                highlights: []
            });
            break;
        }
    }

    return steps;
}

function generateRecursiveBubbleSortSteps(arr: number[]): BaseVisualizationStep[] {
    const steps: BaseVisualizationStep[] = [];
    
    function recursiveBubbleSort(n: number) {
        if (n === 1) {
            steps.push({
                description: "Base case reached - single element is sorted",
                data: [...arr],
                highlights: [0]
            });
            return;
        }

        steps.push({
            description: `Starting pass for ${n} elements`,
            data: [...arr],
            highlights: Array.from({ length: n }, (_, i) => i)
        });

        for (let i = 0; i < n - 1; i++) {
            steps.push({
                description: `Comparing elements at positions ${i} and ${i + 1}`,
                data: [...arr],
                highlights: [i, i + 1]
            });

            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                steps.push({
                    description: `Swapped ${arr[i]} and ${arr[i + 1]}`,
                    data: [...arr],
                    highlights: [i, i + 1],
                    swapping: [i, i + 1]
                });
            }
        }

        recursiveBubbleSort(n - 1);
    }

    recursiveBubbleSort(arr.length);
    return steps;
}

function generateBidirectionalBubbleSortSteps(arr: number[]): BaseVisualizationStep[] {
    const steps: BaseVisualizationStep[] = [];
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;

    steps.push({
        description: "Starting bidirectional bubble sort",
        data: [...arr],
        highlights: []
    });

    while (swapped) {
        swapped = false;

        // Forward pass
        steps.push({
            description: "Starting forward pass",
            data: [...arr],
            highlights: Array.from({ length: end - start + 1 }, (_, i) => start + i)
        });

        for (let i = start; i < end; i++) {
            steps.push({
                description: `Comparing elements at positions ${i} and ${i + 1}`,
                data: [...arr],
                highlights: [i, i + 1]
            });

            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                steps.push({
                    description: `Swapped ${arr[i]} and ${arr[i + 1]}`,
                    data: [...arr],
                    highlights: [i, i + 1],
                    swapping: [i, i + 1]
                });
            }
        }

        if (!swapped) break;
        swapped = false;
        end--;

        // Backward pass
        steps.push({
            description: "Starting backward pass",
            data: [...arr],
            highlights: Array.from({ length: end - start + 1 }, (_, i) => start + i)
        });

        for (let i = end - 1; i >= start; i--) {
            steps.push({
                description: `Comparing elements at positions ${i} and ${i + 1}`,
                data: [...arr],
                highlights: [i, i + 1]
            });

            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                steps.push({
                    description: `Swapped ${arr[i]} and ${arr[i + 1]}`,
                    data: [...arr],
                    highlights: [i, i + 1],
                    swapping: [i, i + 1]
                });
            }
        }
        start++;
    }

    return steps;
}

function generateOddEvenBubbleSortSteps(arr: number[]): BaseVisualizationStep[] {
    const steps: BaseVisualizationStep[] = [];
    const n = arr.length;
    let sorted = false;

    steps.push({
        description: "Starting with odd-even sort",
        data: [...arr],
        highlights: [],
        type: 'info',
        codeHighlights: [1, 2]
    });

    while (!sorted) {
        sorted = true;

        // Odd indices
        steps.push({
            description: "Starting odd-indexed comparisons (positions 1,3,5,...)",
            data: [...arr],
            highlights: Array.from({ length: Math.floor(n/2) }, (_: unknown, i: number) => 2 * i + 1),
            type: 'info',
            codeHighlights: [8, 9]
        });

        for (let i = 1; i < n - 1; i += 2) {
            steps.push({
                description: `Comparing odd-indexed elements at positions ${i} and ${i + 1}`,
                data: [...arr],
                highlights: [i, i + 1],
                type: 'comparison',
                codeHighlights: [9, 10]
            });

            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                sorted = false;
                steps.push({
                    description: `Swapped ${arr[i]} and ${arr[i + 1]} at odd indices`,
                    data: [...arr],
                    highlights: [i, i + 1],
                    swapping: [i, i + 1],
                    type: 'swap',
                    codeHighlights: [10, 11, 12]
                });
            }
        }

        // Even indices
        steps.push({
            description: "Starting even-indexed comparisons (positions 0,2,4,...)",
            data: [...arr],
            highlights: Array.from({ length: Math.floor((n-1)/2) }, (_: unknown, i: number) => 2 * i),
            type: 'info',
            codeHighlights: [16, 17]
        });

        for (let i = 0; i < n - 1; i += 2) {
            steps.push({
                description: `Comparing even-indexed elements at positions ${i} and ${i + 1}`,
                data: [...arr],
                highlights: [i, i + 1],
                type: 'comparison',
                codeHighlights: [17, 18]
            });

            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                sorted = false;
                steps.push({
                    description: `Swapped ${arr[i]} and ${arr[i + 1]} at even indices`,
                    data: [...arr],
                    highlights: [i, i + 1],
                    swapping: [i, i + 1],
                    type: 'swap',
                    codeHighlights: [18, 19, 20]
                });
            }
        }

        if (sorted) {
            steps.push({
                description: "Array is sorted! No more swaps needed.",
                data: [...arr],
                highlights: Array.from({ length: n }, (_, i) => i),
                type: 'info',
                codeHighlights: [24, 25]
            });
        }
    }

    return steps;
}

// ... continue with odd-even sort implementation 