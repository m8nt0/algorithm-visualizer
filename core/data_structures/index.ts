import type { VisualElement } from '../shared/types';

export interface DataStructure {
  id: string;
  name: string;
  description: string;
  visualizer: (state: any) => VisualElement[]; // Pluggable visual logic
  operations: {
    [operation: string]: {
      description: string;
      complexity: {
        time: string;
        space: string;
      };
      languages: {
        [language: string]: string; // Code samples
      };
    };
  };
}

export const DataStructures: Record<string, DataStructure> = {
  priority_queue: {
    id: "priority_queue",
    name: "Priority Queue",
    description: "A queue that pops highest-priority items first, often implemented as a binary heap.",
    visualizer: (state) => {
      // Return visual representation steps for rendering
      return state.heap.map((node: any, i: number) => ({
        type: "circle",
        text: node.value.toString(),
        position: { 
          x: Math.pow(2, Math.floor(Math.log2(i + 1))) * 50 - 25 + (i - Math.pow(2, Math.floor(Math.log2(i + 1))) + 1) * 100, 
          y: Math.floor(Math.log2(i + 1)) * 80 + 50 
        },
        color: node.highlight ? "#ff5722" : "#2196f3"
      }));
    },
    operations: {
      insert: {
        description: "Inserts an element with a priority into the queue",
        complexity: {
          time: "O(log n)",
          space: "O(1)"
        },
        languages: {
          typescript: `insert(value: number, priority: number): void {
  const node = { value, priority };
  this.heap.push(node);
  this.siftUp(this.heap.length - 1);
}`,
          python: `def insert(self, value, priority):
    node = {'value': value, 'priority': priority}
    self.heap.append(node)
    self._sift_up(len(self.heap) - 1)`
        }
      },
      extract_min: {
        description: "Removes and returns the highest priority element",
        complexity: {
          time: "O(log n)",
          space: "O(1)"
        },
        languages: {
          typescript: `extractMin(): any {
  if (this.heap.length === 0) return null;
  
  const min = this.heap[0];
  const last = this.heap.pop();
  
  if (this.heap.length > 0) {
    this.heap[0] = last;
    this.siftDown(0);
  }
  
  return min;
}`,
          python: `def extract_min(self):
    if not self.heap:
        return None
        
    min_item = self.heap[0]
    last_item = self.heap.pop()
    
    if self.heap:
        self.heap[0] = last_item
        self._sift_down(0)
        
    return min_item`
        }
      }
    }
  },
  
  graph: {
    id: "graph",
    name: "Graph",
    description: "A collection of nodes (vertices) and edges connecting these nodes.",
    visualizer: (state) => {
      const nodes: VisualElement[] = [];
      const edges: VisualElement[] = [];
      
      // Calculate positions in a circle
      const radius = 150;
      const centerX = 200;
      const centerY = 200;
      
      // Create nodes
      Object.keys(state.adjacencyList).forEach((nodeId, index) => {
        const angle = (index / Object.keys(state.adjacencyList).length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        nodes.push({
          type: "circle",
          text: nodeId,
          position: { x, y },
          color: state.highlighted?.includes(nodeId) ? "#ff5722" : "#2196f3"
        });
        
        // Create edges
        state.adjacencyList[nodeId].forEach((neighbor: any) => {
          const neighborIndex = Object.keys(state.adjacencyList).indexOf(neighbor.node);
          const neighborAngle = (neighborIndex / Object.keys(state.adjacencyList).length) * 2 * Math.PI;
          const neighborX = centerX + radius * Math.cos(neighborAngle);
          const neighborY = centerY + radius * Math.sin(neighborAngle);
          
          edges.push({
            type: "line",
            position: { x, y },
            endPosition: { x: neighborX, y: neighborY },
            text: neighbor.weight?.toString(),
            color: state.highlightedEdges?.some((e: any) => 
              e.from === nodeId && e.to === neighbor.node
            ) ? "#ff5722" : "#757575"
          });
        });
      });
      
      return [...nodes, ...edges];
    },
    operations: {
      add_vertex: {
        description: "Adds a vertex to the graph",
        complexity: {
          time: "O(1)",
          space: "O(1)"
        },
        languages: {
          typescript: `addVertex(vertex: string): void {
  if (!this.adjacencyList[vertex]) {
    this.adjacencyList[vertex] = [];
  }
}`,
          python: `def add_vertex(self, vertex):
    if vertex not in self.adjacency_list:
        self.adjacency_list[vertex] = []`
        }
      },
      add_edge: {
        description: "Adds an edge between two vertices",
        complexity: {
          time: "O(1)",
          space: "O(1)"
        },
        languages: {
          typescript: `addEdge(vertex1: string, vertex2: string, weight: number = 1): void {
  this.adjacencyList[vertex1].push({ node: vertex2, weight });
  // For undirected graph
  this.adjacencyList[vertex2].push({ node: vertex1, weight });
}`,
          python: `def add_edge(self, vertex1, vertex2, weight=1):
    self.adjacency_list[vertex1].append({'node': vertex2, 'weight': weight})
    # For undirected graph
    self.adjacency_list[vertex2].append({'node': vertex1, 'weight': weight})`
        }
      }
    }
  }
}; 