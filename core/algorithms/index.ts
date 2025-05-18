export interface Complexity {
  time: string;
  space: string;
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  complexity: Complexity;
  relatedDataStructures: string[];
  languages: Record<string, string>;
}

export const Algorithms: Record<string, Algorithm> = {
  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description: "A graph search algorithm that finds the shortest path from a source node to all other nodes in a weighted graph.",
    complexity: {
      time: "O((V + E) log V)",
      space: "O(V)"
    },
    relatedDataStructures: ["graph", "priority_queue"],
    languages: {
      typescript: `function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const nodes = new PriorityQueue();
  
  // Initialize distances
  for (let vertex in graph) {
    if (vertex === start) {
      distances[vertex] = 0;
      nodes.enqueue(vertex, 0);
    } else {
      distances[vertex] = Infinity;
      nodes.enqueue(vertex, Infinity);
    }
    previous[vertex] = null;
  }
  
  while (!nodes.isEmpty()) {
    const smallest = nodes.dequeue().val;
    
    if (smallest === null) continue;
    
    // If the shortest distance to the node is infinity, we can't go any further
    if (distances[smallest] === Infinity) break;
    
    for (let neighbor in graph[smallest]) {
      // Calculate new distance
      const alt = distances[smallest] + graph[smallest][neighbor];
      
      // If new distance is less than known distance
      if (alt < distances[neighbor]) {
        // Update distance and previous
        distances[neighbor] = alt;
        previous[neighbor] = smallest;
        
        // Update priority queue
        nodes.enqueue(neighbor, alt);
      }
    }
  }
  
  return { distances, previous };
}`,
      python: `def dijkstra(graph, start):
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start] = 0
    priority_queue = [(0, start)]
    previous = {vertex: None for vertex in graph}
    
    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)
        
        # If we've already found a shorter path, skip
        if current_distance > distances[current_vertex]:
            continue
            
        # Check neighbors
        for neighbor, weight in graph[current_vertex].items():
            distance = current_distance + weight
            
            # If we found a shorter path
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_vertex
                heapq.heappush(priority_queue, (distance, neighbor))
                
    return distances, previous`
    }
  },
  bfs: {
    id: "bfs",
    name: "Breadth-First Search",
    description: "A graph traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)"
    },
    relatedDataStructures: ["graph"],
    languages: {
      typescript: `function bfs(graph, start) {
  const queue = [start];
  const visited = { [start]: true };
  const result = [];
  
  while (queue.length) {
    const current = queue.shift();
    result.push(current);
    
    for (const neighbor of graph[current]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
      python: `def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return result`
    }
  }
}; 