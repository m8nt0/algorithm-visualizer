export const bubbleSortLesson = {
    sections: [
        {
            id: "intro",
            title: "Introduction to Bubble Sort",
            level: "Beginner",
            content: `Bubble Sort is one of the fundamental sorting algorithms in computer science. It works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order.

Key Characteristics:
• Time Complexity: O(n²) in worst and average cases
• Space Complexity: O(1)
• Stable: Yes (maintains relative order of equal elements)
• In-place: Yes (modifies array directly)
• Adaptive: Yes (can be optimized for nearly sorted arrays)

Best Use Cases:
• Small datasets (< 1000 elements)
• Nearly sorted arrays
• Educational purposes
• When memory is limited
• When simplicity is preferred over efficiency

Limitations:
• Inefficient for large datasets
• Poor cache performance
• Quadratic time complexity makes it impractical for production use`,
            activity: null
        },
        {
            id: "standard",
            title: "Standard Bubble Sort",
            level: "Beginner",
            content: `The basic version of Bubble Sort compares adjacent elements and swaps them if they're in the wrong order. This process is repeated until no more swaps are needed.

Let's understand with a simple example: [5, 3, 8, 4, 2]
1. First pass: [3, 5, 4, 2, 8]
2. Second pass: [3, 4, 2, 5, 8]
3. Third pass: [3, 2, 4, 5, 8]
4. Fourth pass: [2, 3, 4, 5, 8]

Watch how larger elements "bubble up" to their correct positions at the end of the array.`,
            activity: {
                type: "visualization" as const,
                title: "Basic Bubble Sort",
                description: "Watch how elements bubble up to their correct positions",
                supportedStructures: ['array', 'linkedlist', 'stack'],
                data: {
                    array: [5, 3, 8, 4, 2],
                    linkedList: [5, 3, 8, 4, 2],
                    stack: [5, 3, 8, 4, 2]
                },
                code: `function bubbleSort(arr) {
    let n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        // Each pass will place the largest remaining element at the end
        for (let j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap them if they are in wrong order
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Example usage:
let arr = [5, 3, 8, 4, 2];
console.log(bubbleSort(arr)); // [2, 3, 4, 5, 8]`,
                highlightSteps: [
                    { lines: [1, 2], description: "Initialize array length" },
                    { lines: [4], description: "Outer loop for each pass" },
                    { lines: [6], description: "Inner loop for comparisons" },
                    { lines: [8, 9], description: "Compare and swap if needed" }
                ]
            }
        },
        {
            id: "optimized",
            title: "Optimized Bubble Sort",
            level: "Intermediate",
            content: `We can optimize Bubble Sort in two ways:
1. Early exit: If no swaps occur in a pass, the array is sorted
2. Reduced comparisons: After each pass, the last i elements are sorted

Let's see how it performs with a nearly sorted array: [1, 2, 4, 3, 5]
• First pass only needs to swap 4 and 3
• Second pass confirms array is sorted
• Algorithm exits early, saving unnecessary comparisons`,
            activity: {
                type: "visualization" as const,
                title: "Optimized Version",
                description: "See how early exit improves efficiency with nearly sorted arrays",
                supportedStructures: ['array', 'linkedlist', 'stack'],
                data: {
                    array: [1, 2, 4, 3, 5, 6, 7, 8],  // Nearly sorted array
                    linkedList: [1, 2, 4, 3, 5, 6, 7, 8],
                    stack: [1, 2, 4, 3, 5, 6, 7, 8]
                },
                code: `function bubbleSortOptimized(arr) {
    let n = arr.length;
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;  // Reset flag at start of each pass
        
        // Last i elements are already sorted
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;  // Mark that we made a swap
            }
        }
        
        // If no swaps occurred, array is sorted
        if (!swapped) {
            console.log(\`Early exit after \${i + 1} passes\`);
            break;
        }
    }
    return arr;
}

// Example with nearly sorted array
let arr = [1, 2, 4, 3, 5, 6, 7, 8];
console.log(bubbleSortOptimized(arr));`,
                highlightSteps: [
                    { lines: [3], description: "Add swapped flag" },
                    { lines: [6], description: "Reset flag at start of pass" },
                    { lines: [11], description: "Set flag when swap occurs" },
                    { lines: [16, 17, 18], description: "Early exit if no swaps needed" }
                ]
            }
        },
        {
            id: "recursive",
            title: "Recursive Bubble Sort",
            level: "Advanced",
            content: "Implements the algorithm using recursion instead of loops.",
            activity: {
                type: "visualization" as const,
                title: "Recursive Implementation",
                description: "Watch how recursion sorts the array",
                supportedStructures: ['array', 'linkedlist', 'stack', 'queue'],
                data: {
                    array: [3, 2, 1, 4, 5],
                    linkedList: [3, 2, 1, 4, 5],
                    stack: [3, 2, 1, 4, 5],
                    queue: [3, 2, 1, 4, 5]
                },
                code: `function bubbleSortRecursive(arr, n = arr.length) {
    if (n === 1) return arr; // Base case

    for (let i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
    }

    return bubbleSortRecursive(arr, n - 1); // Recursive call
}`,
                highlightSteps: [
                    { lines: [2], description: "Base case check" },
                    { lines: [4, 5, 6], description: "Single pass of bubble sort" },
                    { lines: [9], description: "Recursive call with smaller size" }
                ]
            }
        },
        {
            id: "bidirectional",
            title: "Bidirectional Bubble Sort",
            level: "Advanced",
            content: "Also known as Cocktail Shaker Sort, this variation sorts in both directions alternately.",
            activity: {
                type: "visualization" as const,
                title: "Cocktail Shaker Sort",
                description: "Observe sorting in both directions",
                supportedStructures: ['array', 'linkedlist', 'stack', 'queue'],
                data: {
                    array: [4, 3, 2, 1, 5],
                    linkedList: [4, 3, 2, 1, 5],
                    stack: [4, 3, 2, 1, 5],
                    queue: [4, 3, 2, 1, 5]
                },
                code: `function cocktailShakerSort(arr) {
    let start = 0, end = arr.length - 1;
    let swapped = true;

    while (swapped) {
        swapped = false;

        // Forward pass
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }

        if (!swapped) break;
        swapped = false;
        end--;

        // Backward pass
        for (let i = end - 1; i >= start; i--) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        start++;
    }
    return arr;
}`,
                highlightSteps: [
                    { lines: [8, 9, 10], description: "Forward pass" },
                    { lines: [19, 20, 21], description: "Backward pass" },
                    { lines: [15, 24], description: "Update boundaries" }
                ]
            }
        },
        {
            id: "odd-even",
            title: "Odd-Even Bubble Sort",
            level: "Advanced",
            content: "Sorts odd-indexed and even-indexed pairs alternately in each iteration.",
            activity: {
                type: "visualization" as const,
                title: "Odd-Even Sort",
                description: "Watch alternating odd-even comparisons",
                supportedStructures: ['array', 'linkedlist', 'stack', 'queue'],
                data: {
                    array: [9, 7, 5, 3, 1],
                    linkedList: [9, 7, 5, 3, 1],
                    stack: [9, 7, 5, 3, 1],
                    queue: [9, 7, 5, 3, 1]
                },
                code: `function oddEvenSort(arr) {
    let n = arr.length;
    let sorted = false;

    while (!sorted) {
        sorted = true;

        // Odd pass
        for (let i = 1; i < n - 1; i += 2) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                sorted = false;
            }
        }

        // Even pass
        for (let i = 0; i < n - 1; i += 2) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                sorted = false;
            }
        }
    }
    return arr;
}`,
                highlightSteps: [
                    { lines: [8, 9, 10], description: "Odd-indexed comparisons" },
                    { lines: [16, 17, 18], description: "Even-indexed comparisons" },
                    { lines: [5, 11, 19], description: "Check if sorted" }
                ]
            }
        }
    ]
};