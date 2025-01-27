import type { DataStructure, DataStructureId } from '$lib/types/DataStructure';

export const dataStructureCategories = [
    {
        name: 'Linear',
        description: 'Data structures that store elements sequentially',
        structures: [
            {
                id: 'array' as DataStructureId,
                name: 'Array',
                description: 'A collection of elements stored at contiguous memory locations',
                operations: [
                    {
                        name: 'Access',
                        description: 'Get element at index',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    },
                    {
                        name: 'Insert',
                        description: 'Add element at end/index',
                        complexity: { time: 'O(n)', space: 'O(1)' }
                    },
                    {
                        name: 'Delete',
                        description: 'Remove element at index',
                        complexity: { time: 'O(n)', space: 'O(1)' }
                    }
                ],
                visualizationType: 'array',
                isPremium: false
            },
            {
                id: 'linkedlist' as DataStructureId,
                name: 'Linked List',
                description: 'Sequential elements where each element points to the next',
                operations: [
                    {
                        name: 'Insert at Head',
                        description: 'Add element at beginning',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    },
                    {
                        name: 'Delete at Head',
                        description: 'Remove first element',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    },
                    {
                        name: 'Search',
                        description: 'Find element by value',
                        complexity: { time: 'O(n)', space: 'O(1)' }
                    }
                ],
                visualizationType: 'linkedlist',
                isPremium: false
            },
            {
                id: 'stack' as DataStructureId,
                name: 'Stack',
                description: 'A Last-In-First-Out (LIFO) data structure',
                operations: [
                    {
                        name: 'Push',
                        description: 'Add element to top',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    },
                    {
                        name: 'Pop',
                        description: 'Remove element from top',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    },
                    {
                        name: 'Peek',
                        description: 'View top element',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    }
                ],
                visualizationType: 'stack',
                isPremium: false
            },
            {
                id: 'queue' as DataStructureId,
                name: 'Queue',
                description: 'A First-In-First-Out (FIFO) data structure',
                operations: [
                    {
                        name: 'Enqueue',
                        description: 'Add element to back',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    },
                    {
                        name: 'Dequeue',
                        description: 'Remove element from front',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    },
                    {
                        name: 'Peek',
                        description: 'View front element',
                        complexity: { time: 'O(1)', space: 'O(1)' }
                    }
                ],
                visualizationType: 'queue',
                isPremium: false
            }
        ] as DataStructure[]
    },
    {
        name: 'Trees',
        description: 'Hierarchical data structures with nodes and edges',
        structures: [
            {
                id: 'binary-tree' as DataStructureId,
                name: 'Binary Tree',
                description: 'A tree data structure where each node has at most two children',
                operations: [
                    {
                        name: 'Insert',
                        description: 'Add a new node to the tree',
                        complexity: { time: 'O(n)', space: 'O(1)' }
                    },
                    {
                        name: 'Inorder Traversal',
                        description: 'Visit left subtree, root, then right subtree',
                        complexity: { time: 'O(n)', space: 'O(h)' }
                    },
                    {
                        name: 'Level Order Traversal',
                        description: 'Visit nodes level by level',
                        complexity: { time: 'O(n)', space: 'O(w)' }
                    }
                ],
                visualizationType: 'tree',
                isPremium: false
            }
        ] as DataStructure[]
    }
]; 