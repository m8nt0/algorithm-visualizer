/**
 * Loader utility for importing core algorithms and data structures
 */

import { Algorithms } from '@core/algorithms';
import { DataStructures } from '@core/data_structures';
import { VisualizerEngine } from '@core/visualizer/engine';
import { createInterpreter } from '@core/interpreter';
import type { VisualElement } from '@core/shared/types';
import { 
  algorithmCode, 
  dataStructureCode,
  visualizationStep,
  totalSteps,
  visualElements,
  currentStepExplanation,
  highlightedAlgorithmLines,
  highlightedDSLines,
  selectedLanguage
} from './stores';
import { get } from 'svelte/store';

/**
 * Loads all available algorithms
 */
export function loadAlgorithms() {
  return Object.values(Algorithms);
}

/**
 * Loads all available data structures
 */
export function loadDataStructures() {
  return Object.values(DataStructures);
}

/**
 * Loads a specific algorithm by ID
 */
export function loadAlgorithm(id: string) {
  return Algorithms[id] || null;
}

/**
 * Loads a specific data structure by ID
 */
export function loadDataStructure(id: string) {
  return DataStructures[id] || null;
}

/**
 * Gets algorithm code for a specific language
 */
export function getAlgorithmCode(algorithmId: string, language: string): string {
  const algorithm = Algorithms[algorithmId];
  if (!algorithm || !algorithm.languages[language]) return '';
  return algorithm.languages[language];
}

/**
 * Gets data structure code for a specific language
 */
export function getDataStructureCode(dsId: string, language: string, operation?: string): string {
  const dataStructure = DataStructures[dsId];
  if (!dataStructure) return '';
  
  if (operation && dataStructure.operations[operation]?.languages[language]) {
    return dataStructure.operations[operation].languages[language];
  }
  
  // If no specific operation or not found, return first available
  const firstOperation = Object.keys(dataStructure.operations)[0];
  return dataStructure.operations[firstOperation]?.languages[language] || '';
}

// Create singleton visualizer engine
const visualizerEngine = new VisualizerEngine();
// Create singleton interpreter
const interpreter = createInterpreter();

/**
 * Sync the visualization state with the stores
 */
function syncVisualizationState() {
  const currentStep = visualizerEngine.getCurrentStepNumber();
  const elements = visualizerEngine.getCurrentVisualElements();
  const frame = visualizerEngine.getCurrentFrame();
  
  visualizationStep.set(currentStep);
  visualElements.set(elements);
  
  if (frame?.metadata) {
    currentStepExplanation.set(frame.metadata.description || '');
    
    // Update code highlights if available
    if (frame.metadata.highlightedAlgorithmLines) {
      highlightedAlgorithmLines.set(frame.metadata.highlightedAlgorithmLines);
    }
    
    if (frame.metadata.highlightedDSLines) {
      highlightedDSLines.set(frame.metadata.highlightedDSLines);
    }
  } else {
    currentStepExplanation.set('');
    highlightedAlgorithmLines.set([]);
    highlightedDSLines.set([]);
  }
}

/**
 * Execute algorithm on data structure and creates visualization
 */
export async function runVisualization(algorithmId: string, dsId: string) {
  const algorithm = Algorithms[algorithmId];
  const dataStructure = DataStructures[dsId];
  
  if (!algorithm || !dataStructure) return;
  
  // Clear previous visualization
  visualizerEngine.clear();
  
  // Create sample test data for the data structure
  const sampleData = createSampleData(dsId);
  if (!sampleData) return;
  
  // Record initial state
  visualizerEngine.record(dsId, sampleData, {
    description: 'Initial state',
    highlightedAlgorithmLines: [],
    highlightedDSLines: []
  });
  
  // Get current algorithm and DS code
  const algCode = get(algorithmCode);
  const dsCode = get(dataStructureCode);
  
  try {
    // Execute the algorithm with the interpreter
    const language = get(selectedLanguage);
    const result = await interpreter.execute(algCode, language);
    
    // Handle visualization based on the algorithm results
    // In a real implementation, the algorithm would modify a data structure
    // and record steps for visualization
    
    // For now, we'll simulate some steps
    simulateAlgorithmSteps(algorithmId, dsId, sampleData);
    
    // Update store with total steps
    totalSteps.set(visualizerEngine.getTotalSteps());
    
    // Sync visualization state
    syncVisualizationState();
  } catch (error) {
    console.error('Execution error:', error);
  }
}

/**
 * Move to the next visualization step
 */
export function nextStep() {
  visualizerEngine.nextStep();
  syncVisualizationState();
}

/**
 * Move to the previous visualization step
 */
export function previousStep() {
  visualizerEngine.previousStep();
  syncVisualizationState();
}

/**
 * Play the visualization
 */
export function playVisualization() {
  visualizerEngine.play();
  // Listen for step changes and sync
  const interval = setInterval(() => {
    if (!visualizerEngine.isPlaying()) {
      clearInterval(interval);
      return;
    }
    syncVisualizationState();
  }, 100);
}

/**
 * Pause the visualization
 */
export function pauseVisualization() {
  visualizerEngine.pause();
}

/**
 * Create sample data for visualization
 */
function createSampleData(dsId: string): any {
  switch (dsId) {
    case 'graph':
      return {
        adjacencyList: {
          A: [{ node: 'B', weight: 4 }, { node: 'C', weight: 2 }],
          B: [{ node: 'A', weight: 4 }, { node: 'E', weight: 3 }],
          C: [{ node: 'A', weight: 2 }, { node: 'D', weight: 2 }, { node: 'F', weight: 4 }],
          D: [{ node: 'C', weight: 2 }, { node: 'E', weight: 3 }, { node: 'F', weight: 1 }],
          E: [{ node: 'B', weight: 3 }, { node: 'D', weight: 3 }, { node: 'F', weight: 1 }],
          F: [{ node: 'C', weight: 4 }, { node: 'D', weight: 1 }, { node: 'E', weight: 1 }]
        }
      };
    case 'priority_queue':
      return {
        heap: [
          { value: 5, priority: 1 },
          { value: 10, priority: 2 },
          { value: 15, priority: 3 },
          { value: 20, priority: 4 }
        ]
      };
    // Add more data structures as needed
    default:
      return null;
  }
}

/**
 * Simulate algorithm steps for visualization
 * This would be replaced with actual algorithm execution
 */
function simulateAlgorithmSteps(algorithmId: string, dsId: string, initialState: any) {
  if (algorithmId === 'dijkstra' && dsId === 'graph') {
    // Simulate Dijkstra's algorithm steps on a graph
    const steps = [
      { 
        state: { 
          ...initialState,
          highlighted: ['A'], 
          highlightedEdges: [] 
        },
        metadata: {
          description: 'Start at source node A',
          highlightedAlgorithmLines: [5, 6],
          highlightedDSLines: []
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B'], 
          highlightedEdges: [{ from: 'A', to: 'B' }] 
        },
        metadata: {
          description: 'Visit neighbor B from A',
          highlightedAlgorithmLines: [20, 21],
          highlightedDSLines: [15]
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B', 'C'], 
          highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }] 
        },
        metadata: {
          description: 'Visit neighbor C from A',
          highlightedAlgorithmLines: [20, 21],
          highlightedDSLines: [15]
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B', 'C', 'D'], 
          highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'C', to: 'D' }] 
        },
        metadata: {
          description: 'Visit neighbor D from C',
          highlightedAlgorithmLines: [20, 21],
          highlightedDSLines: [15]
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B', 'C', 'D', 'F'], 
          highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'F' }] 
        },
        metadata: {
          description: 'Visit neighbor F from D',
          highlightedAlgorithmLines: [20, 21],
          highlightedDSLines: [15]
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B', 'C', 'D', 'E', 'F'], 
          path: ['A', 'C', 'D', 'F', 'E'],
          highlightedEdges: [{ from: 'A', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'F' }, { from: 'F', to: 'E' }] 
        },
        metadata: {
          description: 'Final shortest path from A to E',
          highlightedAlgorithmLines: [35, 36],
          highlightedDSLines: []
        }
      }
    ];
    
    for (const step of steps) {
      visualizerEngine.record(dsId, step.state, step.metadata);
    }
  } else if (algorithmId === 'bfs' && dsId === 'graph') {
    // Simulate BFS steps on a graph
    const steps = [
      { 
        state: { 
          ...initialState,
          highlighted: ['A'], 
          queue: ['A'],
          visited: ['A'],
          highlightedEdges: [] 
        },
        metadata: {
          description: 'Start at node A, add to queue and visited set',
          highlightedAlgorithmLines: [3, 4],
          highlightedDSLines: []
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B'], 
          queue: ['C', 'B'],
          visited: ['A', 'B', 'C'],
          highlightedEdges: [{ from: 'A', to: 'B' }] 
        },
        metadata: {
          description: 'Dequeue A, visit neighbors B and C',
          highlightedAlgorithmLines: [7, 8, 9],
          highlightedDSLines: []
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B', 'C'], 
          queue: ['E', 'D'],
          visited: ['A', 'B', 'C', 'E'],
          highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }] 
        },
        metadata: {
          description: 'Dequeue B, visit neighbor E',
          highlightedAlgorithmLines: [7, 8, 9],
          highlightedDSLines: []
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B', 'C', 'E'], 
          queue: ['D', 'F'],
          visited: ['A', 'B', 'C', 'E', 'D', 'F'],
          highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'E' }] 
        },
        metadata: {
          description: 'Dequeue C, visit neighbors D and F',
          highlightedAlgorithmLines: [7, 8, 9],
          highlightedDSLines: []
        }
      },
      { 
        state: { 
          ...initialState,
          highlighted: ['A', 'B', 'C', 'E', 'D'], 
          queue: ['F'],
          visited: ['A', 'B', 'C', 'E', 'D', 'F'],
          highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'E' }, { from: 'C', to: 'D' }] 
        },
        metadata: {
          description: 'Dequeue E, no new neighbors to visit',
          highlightedAlgorithmLines: [7, 8],
          highlightedDSLines: []
        }
      }
    ];
    
    for (const step of steps) {
      visualizerEngine.record(dsId, step.state, step.metadata);
    }
  }
  // Add more algorithm simulation cases as needed
}

/**
 * Gets related data structures for an algorithm
 */
export function getRelatedDataStructures(algorithmId: string) {
  const algorithm = Algorithms[algorithmId];
  if (!algorithm) return [];
  
  return algorithm.relatedDataStructures.map((dsId: string) => DataStructures[dsId]);
} 