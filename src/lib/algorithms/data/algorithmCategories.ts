import type { AlgorithmCategory } from '$lib/types/Algorithm';

export const algorithmCategories: AlgorithmCategory[] = [
    {
        name: 'Sorting',
        description: 'Algorithms that arrange elements in a specific order',
        algorithms: [
            {
                id: 'bubble-sort',
                name: 'Bubble Sort',
                description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                complexity: {
                    time: 'O(n²)',
                    space: 'O(1)'
                },
                isPremium: false,
                visualizationType: 'array'
            },
            {
                id: 'insertion-sort',
                name: 'Insertion Sort',
                description: 'Builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.',
                complexity: {
                    time: 'O(n²)',
                    space: 'O(1)'
                },
                isPremium: false,
                visualizationType: 'array'
            },
            {
                id: 'selection-sort',
                name: 'Selection Sort',
                description: 'Divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region to add to the sorted region.',
                complexity: {
                    time: 'O(n²)',
                    space: 'O(1)'
                },
                isPremium: false,
                visualizationType: 'array'
            },
            {
                id: 'merge-sort',
                name: 'Merge Sort',
                description: 'A divide-and-conquer algorithm that recursively divides the input array into two halves, sorts them, and then merges the sorted halves.',
                complexity: {
                    time: 'O(n log n)',
                    space: 'O(n)'
                },
                isPremium: false,
                visualizationType: 'array'
            },
            {
                id: 'quick-sort',
                name: 'Quick Sort',
                description: 'A divide-and-conquer algorithm that picks an element as pivot and partitions the array around it.',
                complexity: {
                    time: 'O(n log n)',
                    space: 'O(log n)'
                },
                isPremium: false,
                visualizationType: 'array'
            },
            // More sorting algorithms will be added...
        ]
    },
    {
        name: 'Searching',
        description: 'Algorithms for finding elements in data structures',
        algorithms: [
            {
                id: 'linear-search',
                name: 'Linear Search',
                description: 'Sequentially checks each element in a list until a match is found.',
                complexity: {
                    time: 'O(n)',
                    space: 'O(1)'
                },
                isPremium: false,
                visualizationType: 'array'
            },
            {
                id: 'binary-search',
                name: 'Binary Search',
                description: 'Finds the position of a target value within a sorted array.',
                complexity: {
                    time: 'O(log n)',
                    space: 'O(1)'
                },
                isPremium: false,
                visualizationType: 'array'
            }
        ]
    },
    {
        name: 'Graph',
        description: 'Algorithms that operate on graph data structures',
        algorithms: [
            {
                id: 'bfs',
                name: 'Breadth-First Search',
                description: 'Traverses a graph level by level.',
                complexity: {
                    time: 'O(V + E)',
                    space: 'O(V)'
                },
                isPremium: false,
                visualizationType: 'graph'
            },
            {
                id: 'dfs',
                name: 'Depth-First Search',
                description: 'Explores as far as possible along each branch before backtracking.',
                complexity: {
                    time: 'O(V + E)',
                    space: 'O(V)'
                },
                isPremium: false,
                visualizationType: 'graph'
            }
        ]
    }
    // More categories will be added...
]; 