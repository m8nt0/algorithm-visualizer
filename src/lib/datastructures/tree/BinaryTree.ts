export class TreeNode<T> {
    value: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;
    
    constructor(value: T) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

export class BinaryTree<T> {
    root: TreeNode<T> | null;
    
    constructor() {
        this.root = null;
    }

    insert(value: T): void {
        const newNode = new TreeNode(value);
        
        if (!this.root) {
            this.root = newNode;
            return;
        }

        const queue = [this.root];
        while (queue.length > 0) {
            const current = queue.shift()!;
            
            if (!current.left) {
                current.left = newNode;
                return;
            }
            if (!current.right) {
                current.right = newNode;
                return;
            }

            queue.push(current.left);
            queue.push(current.right);
        }
    }

    toArray(): (T | null)[] {
        if (!this.root) return [];

        const result: (T | null)[] = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const current = queue.shift()!;
            result.push(current.value);

            if (current.left) {
                queue.push(current.left);
            } else {
                result.push(null);
            }

            if (current.right) {
                queue.push(current.right);
            } else {
                result.push(null);
            }
        }

        // Remove trailing nulls
        while (result[result.length - 1] === null) {
            result.pop();
        }

        return result;
    }

    // Add traversal methods
    inorderTraversal(): T[] {
        const result: T[] = [];
        
        function traverse(node: TreeNode<T> | null) {
            if (!node) return;
            traverse(node.left);
            result.push(node.value);
            traverse(node.right);
        }
        
        traverse(this.root);
        return result;
    }
} 