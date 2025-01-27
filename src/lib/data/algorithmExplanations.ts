import type { AlgorithmExplanations } from '$lib/types/Visualization';

export const algorithmExplanations: AlgorithmExplanations = {
    'bubble-sort': {
        title: "How Bubble Sort Works",
        steps: [
            "1. Start with an unsorted array",
            "2. Compare adjacent elements, swap if they're in wrong order",
            "3. After each pass, the largest element 'bubbles up' to the end",
            "4. Repeat until no swaps are needed"
        ],
        complexity: {
            time: "O(n²)",
            space: "O(1)",
            best: "O(n)"
        },
        useCases: [
            "Small datasets",
            "Educational purposes",
            "When simplicity is preferred over efficiency"
        ],
        activities: [
            {
                id: "bubble-basic",
                title: "Basic Bubble Sort",
                description: "Learn how bubble sort works with a simple visualization",
                type: "visualization",
                steps: [
                    {
                        description: "Watch how elements bubble up to their correct positions",
                        visualization: { type: "array", data: [5, 3, 8, 4, 2, 1, 7, 6] }
                    }
                ]
            },
            {
                id: "bubble-interactive",
                title: "Interactive Sorting",
                description: "Try sorting the array yourself using bubble sort",
                type: "practice",
                steps: [
                    {
                        description: "Click on adjacent elements to swap them",
                        visualization: { type: "array", data: [4, 2, 7, 1, 3] }
                    }
                ]
            },
            {
                id: "bubble-challenge",
                title: "Optimization Challenge",
                description: "Optimize bubble sort by adding early exit condition",
                type: "challenge",
                steps: [
                    {
                        description: "Modify the code to break when no swaps are needed",
                        code: "function bubbleSort(arr) {\n  // Add your code here\n}"
                    }
                ]
            }
        ],
        keyConcepts: [
            {
                title: "Adjacent Comparison",
                description: "Elements are compared and swapped with their immediate neighbors"
            },
            {
                title: "Bubble Up",
                description: "Largest unsorted element 'bubbles up' to its correct position in each pass"
            },
            {
                title: "Multiple Passes",
                description: "Algorithm makes multiple passes until array is sorted"
            }
        ],
        applications: [
            {
                title: "Educational Tool",
                description: "Used to teach basic sorting concepts",
                example: "Teaching sorting algorithms in computer science courses"
            },
            {
                title: "Small Datasets",
                description: "Efficient for very small arrays or nearly sorted data",
                example: "Sorting a hand of playing cards"
            }
        ]
    },
    'quick-sort': {
        title: "How Quick Sort Works",
        steps: [
            "1. Choose a 'pivot' element from the array",
            "2. Partition: move smaller elements before pivot, larger after",
            "3. Recursively apply to sub-arrays",
            "4. Combine the sorted parts"
        ],
        complexity: {
            time: "O(n log n)",
            space: "O(log n)",
            best: "O(n log n)"
        },
        useCases: [
            "Large datasets",
            "When average-case performance is important",
            "In-place sorting with good cache performance"
        ]
    },
    'merge-sort': {
        title: "How Merge Sort Works",
        steps: [
            "1. Divide array into two halves",
            "2. Recursively sort the two halves",
            "3. Merge the sorted halves",
            "4. Continue until entire array is sorted"
        ],
        complexity: {
            time: "O(n log n)",
            space: "O(n)",
            best: "O(n log n)"
        },
        useCases: [
            "Stable sorting required",
            "External sorting",
            "Linked list sorting"
        ]
    },
    'insertion-sort': {
        title: "How Insertion Sort Works",
        steps: [
            "1. Start from second element",
            "2. Compare with previous elements",
            "3. Insert into correct position by shifting elements",
            "4. Repeat for all elements"
        ],
        complexity: {
            time: "O(n²)",
            space: "O(1)",
            best: "O(n)"
        },
        useCases: [
            "Small datasets",
            "Nearly sorted arrays",
            "Online sorting (sorting as data arrives)"
        ]
    },
    'selection-sort': {
        title: "How Selection Sort Works",
        steps: [
            "1. Find minimum element in unsorted portion",
            "2. Swap it with first unsorted element",
            "3. Move boundary of unsorted portion",
            "4. Repeat until array is sorted"
        ],
        complexity: {
            time: "O(n²)",
            space: "O(1)",
            best: "O(n²)"
        },
        useCases: [
            "Small datasets",
            "When memory writes are expensive",
            "When simplicity is needed"
        ]
    },
    'heap-sort': {
        title: "How Heap Sort Works",
        steps: [
            "1. Build a max heap from the array",
            "2. Swap root (maximum) with last element",
            "3. Reduce heap size and heapify root",
            "4. Repeat until array is sorted"
        ],
        complexity: {
            time: "O(n log n)",
            space: "O(1)",
            best: "O(n log n)"
        },
        useCases: [
            "When stable sort isn't needed",
            "When consistent performance is required",
            "When memory usage is a concern"
        ]
    },
    'shell-sort': {
        title: "How Shell Sort Works",
        steps: [
            "1. Choose a gap sequence",
            "2. Compare elements with the gap",
            "3. Reduce gap and repeat",
            "4. End with gap=1 (insertion sort)"
        ],
        complexity: {
            time: "O(n log n)",
            space: "O(1)",
            best: "O(n log n)"
        },
        useCases: [
            "Medium-sized datasets",
            "When quick sort performs poorly",
            "Hardware sorting implementations"
        ]
    },
    'counting-sort': {
        title: "How Counting Sort Works",
        steps: [
            "1. Count occurrences of each element",
            "2. Calculate cumulative counts",
            "3. Place elements in correct positions",
            "4. Copy back to original array"
        ],
        complexity: {
            time: "O(n + k)",
            space: "O(k)",
            best: "O(n + k)"
        },
        useCases: [
            "Integer sorting with known range",
            "When auxiliary space is available",
            "As part of radix sort"
        ]
    },
    'radix-sort': {
        title: "How Radix Sort Works",
        steps: [
            "1. Find the maximum number to know number of digits",
            "2. Do counting sort for each digit position",
            "3. Start from least significant digit",
            "4. Move to most significant digit"
        ],
        complexity: {
            time: "O(d * (n + k))",
            space: "O(n + k)",
            best: "O(d * (n + k))"
        },
        useCases: [
            "Integer or string sorting",
            "When elements have fixed number of digits",
            "When linear time sorting is needed"
        ]
    }
}; 