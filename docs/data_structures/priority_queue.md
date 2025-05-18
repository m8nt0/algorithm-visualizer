# Priority Queue

A priority queue is an abstract data type similar to a regular queue, but where each element has a "priority" associated with it. Elements with higher priorities are served before elements with lower priorities.

## Overview

Priority queues are commonly implemented using a binary heap, which provides efficient operations for insertion and removal of the highest-priority element.

## Operations

| Operation | Description | Time Complexity |
|-----------|-------------|----------------|
| insert    | Adds an element with a priority | O(log n) |
| extract_min | Removes and returns the highest priority element | O(log n) |
| peek      | Returns the highest priority element without removing it | O(1) |
| is_empty  | Checks if the queue is empty | O(1) |
| size      | Returns the number of elements | O(1) |

## Implementation

Priority queues are typically implemented using:

1. **Binary Heap**: Most common implementation, provides O(log n) for insert and extract_min
2. **Fibonacci Heap**: More complex but offers O(1) amortized time for insert and decrease_key
3. **Binary Search Tree**: Another option with O(log n) operations

## Binary Heap Implementation

A binary heap is a complete binary tree where each node's value is greater than or equal to (in a max heap) or less than or equal to (in a min heap) the values of its children.

```typescript
class PriorityQueue {
  private heap: Array<{value: any, priority: number}> = [];
  
  insert(value: any, priority: number): void {
    const node = { value, priority };
    this.heap.push(node);
    this.siftUp(this.heap.length - 1);
  }
  
  extractMin(): any {
    if (this.heap.length === 0) return null;
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    
    return min.value;
  }
  
  peek(): any {
    return this.heap.length > 0 ? this.heap[0].value : null;
  }
  
  private siftUp(index: number): void {
    const node = this.heap[index];
    
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      
      if (parent.priority <= node.priority) break;
      
      this.heap[parentIndex] = node;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }
  
  private siftDown(index: number): void {
    const length = this.heap.length;
    const node = this.heap[index];
    
    while (true) {
      const leftChildIdx = 2 * index + 1;
      const rightChildIdx = 2 * index + 2;
      let smallestChildIdx = index;
      
      if (leftChildIdx < length && 
          this.heap[leftChildIdx].priority < this.heap[smallestChildIdx].priority) {
        smallestChildIdx = leftChildIdx;
      }
      
      if (rightChildIdx < length && 
          this.heap[rightChildIdx].priority < this.heap[smallestChildIdx].priority) {
        smallestChildIdx = rightChildIdx;
      }
      
      if (smallestChildIdx === index) break;
      
      this.heap[index] = this.heap[smallestChildIdx];
      this.heap[smallestChildIdx] = node;
      index = smallestChildIdx;
    }
  }
}
```

## Applications

- Dijkstra's shortest path algorithm
- Prim's algorithm for minimum spanning tree
- Huffman coding (compression algorithm)
- Best-first search algorithms in AI
- Task scheduling in operating systems
- Event-driven simulation

## Advantages

- Efficient retrieval of the highest-priority element
- Maintains elements in a partially sorted state
- Relatively simple implementation with binary heap

## Disadvantages

- Standard implementation doesn't support efficient arbitrary element removal
- Decrease-key operation is not efficient in binary heap implementation 