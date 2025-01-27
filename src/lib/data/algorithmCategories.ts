import type { AlgorithmCategory } from '$lib/types/Algorithm';

export const algorithmCategories: AlgorithmCategory[] = [
    {
        name: "Sorting",
        description: "Algorithms that arrange elements in a specific order",
        algorithms: [
            {
                id: "bubble-sort",
                name: "Bubble Sort",
                description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
                complexity: {
                    time: "O(n²)",
                    space: "O(1)"
                },
                visualizationType: "array",
                isPremium: false
            },
            {
                id: "quick-sort",
                name: "Quick Sort",
                description: "An efficient, in-place sorting algorithm that uses divide-and-conquer strategy to sort elements.",
                complexity: {
                    time: "O(n log n)",
                    space: "O(log n)"
                },
                visualizationType: "array",
                isPremium: false
            },
            // Add more sorting algorithms...
        ]
    },
    {
        name: "Searching",
        description: "Algorithms that find elements in a data structure",
        algorithms: [
            {
                id: "binary-search",
                name: "Binary Search",
                description: "An efficient search algorithm that finds the position of a target value within a sorted array.",
                complexity: {
                    time: "O(log n)",
                    space: "O(1)"
                },
                visualizationType: "array",
                isPremium: false
            },
            // Add more searching algorithms...
        ]
    },
    {
        name: "Graph",
        description: "Algorithms that operate on graph data structures",
        algorithms: [
            {
                id: "bfs",
                name: "Breadth First Search",
                description: "Traverses a graph level by level, visiting all neighbors of a vertex before moving to the next level.",
                complexity: {
                    time: "O(V + E)",
                    space: "O(V)"
                },
                visualizationType: "graph",
                isPremium: false
            },
            // Add more graph algorithms...
        ]
    },
    // Add more categories...
]; 