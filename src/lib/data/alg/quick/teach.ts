export const quickSortLesson = {
    sections: [
        {
            id: "intro",
            title: "Introduction to Quick Sort",
            level: "Intermediate",
            content: `Quick Sort is an efficient, in-place sorting algorithm...`,
            activity: {
                type: "visualization" as const,
                title: "Basic Quick Sort",
                description: "Watch how the pivot partitions the array",
                supportedStructures: ['array', 'linkedlist'],
                data: {
                    array: [5, 3, 8, 4, 2],
                    linkedList: [5, 3, 8, 4, 2]
                },
                code: `function quickSort(arr) {
    // Quick sort implementation
}`,
                highlightSteps: []
            }
        }
        // Add more sections...
    ]
}; 