# Dijkstra's Algorithm

Dijkstra's algorithm is a graph search algorithm that solves the single-source shortest path problem for a graph with non-negative edge weights, producing a shortest-path tree.

## Overview

This algorithm finds the shortest path from a source node to all other nodes in a weighted graph. It uses a priority queue to always process the node with the smallest known distance first.

## How It Works

1. Initialize distances: Set distance to source as 0, all others as infinity
2. Add source node to priority queue
3. While priority queue is not empty:
   - Extract node with minimum distance
   - For each neighbor, calculate distance through current node
   - If new distance is smaller, update distance and add to queue

## Pseudocode

```
function Dijkstra(Graph, source):
    create vertex set Q
    
    for each vertex v in Graph:
        dist[v] ← INFINITY
        prev[v] ← UNDEFINED
        add v to Q
    
    dist[source] ← 0
    
    while Q is not empty:
        u ← vertex in Q with min dist[u]
        remove u from Q
        
        for each neighbor v of u:
            alt ← dist[u] + length(u, v)
            if alt < dist[v]:
                dist[v] ← alt
                prev[v] ← u
    
    return dist[], prev[]
```

## Complexity Analysis

- **Time Complexity**: O(V + E log V) where V is the number of vertices and E is the number of edges
- **Space Complexity**: O(V) for storing distances and priority queue

## Applications

- Finding the shortest path in road networks for navigation systems
- Network routing protocols to determine the most efficient path for data
- Flight itinerary planning to find the shortest or cheapest route
- Robotics path planning to navigate through environments

## Related Data Structures

- Priority Queue (Binary Heap)
- Graph (Adjacency List/Matrix)

## Implementation Notes

- The algorithm assumes all edge weights are non-negative
- For graphs with negative weights, consider using the Bellman-Ford algorithm
- A priority queue implementation significantly improves performance 