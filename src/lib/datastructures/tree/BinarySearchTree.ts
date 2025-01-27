export class BSTNode<T> {
    value: T;
    left: BSTNode<T> | null;
    right: BSTNode<T> | null;
    
    constructor(value: T) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

export class BinarySearchTree<T> {
    root: BSTNode<T> | null;
    
    constructor() {
        this.root = null;
    }

    insert(value: T): void {
        const newNode = new BSTNode(value);
        
        if (!this.root) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    break;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    break;
                }
                current = current.right;
            }
        }
    }

    search(value: T): BSTNode<T> | null {
        let current = this.root;
        
        while (current) {
            if (value === current.value) {
                return current;
            }
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        return null;
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

        while (result[result.length - 1] === null) {
            result.pop();
        }

        return result;
    }

    inorderTraversal(): T[] {
        const result: T[] = [];
        
        function traverse(node: BSTNode<T> | null) {
            if (!node) return;
            traverse(node.left);
            result.push(node.value);
            traverse(node.right);
        }
        
        traverse(this.root);
        return result;
    }
} 