interface AlgorithmStep {
    lines: number[];
    description: string;
}

interface AlgorithmImplementation {
    code: string;
    steps: AlgorithmStep[];
}

export const algorithmImplementations = {
    'bubble-sort': {
        javascript: {
            code: `function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return arr;
}`,
            steps: [
                { lines: [1, 2], description: "Initialize array length" },
                { lines: [4], description: "Outer loop starts" },
                { lines: [5], description: "Inner loop starts" },
                { lines: [6, 7, 8], description: "Compare and swap if needed" },
                { lines: [5, 6, 7, 8], description: "Continue inner loop" },
                { lines: [4], description: "Continue outer loop" },
                { lines: [13], description: "Return sorted array" }
            ]
        },
        python: {
            code: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr`,
            steps: [
                // Similar step structure for Python
            ]
        },
        cpp: {
            code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
            steps: [
                // Similar step structure for C++
            ]
        },
        java: {
            code: `void bubbleSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
            steps: [
                // Similar step structure for Java
            ]
        }
    }
}; 