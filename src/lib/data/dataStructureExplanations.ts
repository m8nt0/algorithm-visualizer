import type { DataStructureExplanation } from '$lib/types/Visualization';

export const dataStructureExplanations: Record<string, DataStructureExplanation> = {
    'linkedlist': {
        title: "Linked List",
        description: "A linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.",
        operations: [
            {
                name: "Insert",
                complexity: "O(1) at head, O(n) at tail",
                description: "Adds a new node to the list"
            },
            {
                name: "Delete",
                complexity: "O(1) at head, O(n) at specific position",
                description: "Removes a node from the list"
            },
            {
                name: "Search",
                complexity: "O(n)",
                description: "Finds a node with a specific value"
            }
        ],
        useCases: [
            "Dynamic memory allocation",
            "Implementation of stacks and queues",
            "Undo/Redo operations in software",
            "Music playlist management"
        ],
        advantages: [
            "Dynamic size",
            "Easy insertion and deletion",
            "Efficient memory utilization",
            "No pre-allocation needed"
        ],
        disadvantages: [
            "No random access",
            "Extra memory for pointers",
            "Not cache friendly",
            "Sequential access only"
        ]
    }
    // Add more data structure explanations here
}; 