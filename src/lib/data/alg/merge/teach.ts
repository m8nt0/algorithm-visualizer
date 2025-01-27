export const mergeSortLesson = {
    sections: [
        {
            id: "intro",
            title: "Introduction to Merge Sort",
            level: "Intermediate",
            content: `Merge Sort is a divide-and-conquer algorithm...`,
            activity: {
                type: "visualization" as const,
                title: "Basic Merge Sort",
                description: "See how arrays are divided and merged",
                supportedStructures: ['array', 'linkedlist'],
                data: {
                    array: [5, 3, 8, 4, 2],
                    linkedList: [5, 3, 8, 4, 2]
                },
                code: `function mergeSort(arr) {
    // Merge sort implementation
}`,
                highlightSteps: []
            }
        }
    ]
}; 