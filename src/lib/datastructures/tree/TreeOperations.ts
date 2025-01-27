import type { VisualizationStep } from '$lib/types/Visualization';
import { BinaryTree } from './BinaryTree';
import { BinarySearchTree } from './BinarySearchTree';

export function generateInsertSteps(tree: BinaryTree<number>, value: number): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const originalArray = tree.toArray();

    // Initial state
    steps.push({
        description: "Starting state of the tree",
        data: originalArray,
        highlights: []
    });

    // Create new node
    steps.push({
        description: `Creating new node with value ${value}`,
        data: originalArray,
        highlights: []
    });

    tree.insert(value);
    const newArray = tree.toArray();
    const newNodeIndex = newArray.findIndex(v => v === value);

    // Show insertion
    steps.push({
        description: `Inserting ${value} at the first available position`,
        data: newArray,
        highlights: [newNodeIndex]
    });

    // Final state
    steps.push({
        description: "Insertion complete",
        data: newArray,
        highlights: []
    });

    return steps;
}

export function generateTraversalSteps(tree: BinaryTree<number>, type: 'inorder' | 'levelorder'): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const treeArray = tree.toArray();

    // Initial state
    steps.push({
        description: `Starting ${type} traversal`,
        data: treeArray,
        highlights: []
    });

    if (type === 'inorder') {
        const traversalOrder = tree.inorderTraversal();
        let visited: number[] = [];

        for (const value of traversalOrder) {
            const nodeIndex = treeArray.indexOf(value);
            visited.push(nodeIndex);

            steps.push({
                description: `Visiting node ${value}`,
                data: treeArray,
                highlights: visited
            });
        }
    } else {
        // Level order traversal
        for (let i = 0; i < treeArray.length; i++) {
            if (treeArray[i] !== null) {
                steps.push({
                    description: `Visiting node ${treeArray[i]}`,
                    data: treeArray,
                    highlights: Array.from({ length: i + 1 }, (_, idx) => idx)
                        .filter(idx => treeArray[idx] !== null)
                });
            }
        }
    }

    return steps;
}

export function generateBSTInsertSteps(tree: BinarySearchTree<number>, value: number): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const originalArray = tree.toArray();

    // Initial state
    steps.push({
        description: "Starting state of the BST",
        data: originalArray,
        highlights: []
    });

    let current = tree.root;
    let path: number[] = [];
    let currentIndex = 0;

    while (current) {
        path.push(currentIndex);
        steps.push({
            description: `Comparing ${value} with ${current.value}`,
            data: originalArray,
            highlights: path
        });

        if (value < current.value) {
            if (!current.left) {
                steps.push({
                    description: `${value} is less than ${current.value}, inserting as left child`,
                    data: originalArray,
                    highlights: [...path, 2 * currentIndex + 1]
                });
                break;
            }
            current = current.left;
            currentIndex = 2 * currentIndex + 1;
        } else {
            if (!current.right) {
                steps.push({
                    description: `${value} is greater than or equal to ${current.value}, inserting as right child`,
                    data: originalArray,
                    highlights: [...path, 2 * currentIndex + 2]
                });
                break;
            }
            current = current.right;
            currentIndex = 2 * currentIndex + 2;
        }
    }

    tree.insert(value);
    const newArray = tree.toArray();

    // Final state
    steps.push({
        description: "Insertion complete",
        data: newArray,
        highlights: []
    });

    return steps;
}

export function generateBSTSearchSteps(tree: BinarySearchTree<number>, value: number): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const treeArray = tree.toArray();

    // Initial state
    steps.push({
        description: `Starting search for value ${value}`,
        data: treeArray,
        highlights: []
    });

    let current = tree.root;
    let path: number[] = [];
    let currentIndex = 0;

    while (current) {
        path.push(currentIndex);
        steps.push({
            description: `Comparing ${value} with ${current.value}`,
            data: treeArray,
            highlights: path
        });

        if (value === current.value) {
            steps.push({
                description: `Found ${value}!`,
                data: treeArray,
                highlights: [currentIndex]
            });
            return steps;
        }

        if (value < current.value) {
            if (!current.left) break;
            current = current.left;
            currentIndex = 2 * currentIndex + 1;
        } else {
            if (!current.right) break;
            current = current.right;
            currentIndex = 2 * currentIndex + 2;
        }
    }

    steps.push({
        description: `Value ${value} not found in the tree`,
        data: treeArray,
        highlights: []
    });

    return steps;
} 