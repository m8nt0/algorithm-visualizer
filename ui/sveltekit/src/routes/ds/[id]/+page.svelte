<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { loadDataStructure, createVisualizer } from '$lib/loader';
  import { selectedDataStructure, activeTab } from '$lib/stores';
  import DSVisualizer from '../../../components/DSVisualizer.svelte';
  import LearnPanel from '../../../components/LearnPanel.svelte';
  
  // Get the data structure ID from the URL
  const dsId = $page.params.id;
  
  // Load the data structure
  let dataStructure = loadDataStructure(dsId);
  
  // Update store
  $selectedDataStructure = dataStructure;
  
  // Visualization state
  let visualizer = createVisualizer();
  let isPlaying = false;
  let currentStep = 0;
  let totalSteps = 0;
  let visualElements = [];
  
  function initializeVisualization() {
    visualizer.clear();
    
    // Create a sample state for the data structure
    let sampleState;
    
    if (dataStructure?.id === 'graph') {
      sampleState = {
        adjacencyList: {
          A: [{ node: 'B', weight: 4 }, { node: 'C', weight: 2 }],
          B: [{ node: 'A', weight: 4 }, { node: 'E', weight: 3 }],
          C: [{ node: 'A', weight: 2 }, { node: 'D', weight: 2 }, { node: 'F', weight: 4 }],
          D: [{ node: 'C', weight: 2 }, { node: 'E', weight: 3 }, { node: 'F', weight: 1 }],
          E: [{ node: 'B', weight: 3 }, { node: 'D', weight: 3 }, { node: 'F', weight: 1 }],
          F: [{ node: 'C', weight: 4 }, { node: 'D', weight: 1 }, { node: 'E', weight: 1 }]
        }
      };
      
      // Record initial state
      visualizer.record(dataStructure.id, sampleState, 'Initial Graph');
      
      // Add some sample operations
      const operations = [
        { type: 'add_node', node: 'G', description: 'Add node G' },
        { type: 'add_edge', from: 'G', to: 'A', weight: 3, description: 'Connect G to A' },
        { type: 'add_edge', from: 'G', to: 'F', weight: 2, description: 'Connect G to F' },
        { type: 'remove_edge', from: 'C', to: 'F', description: 'Remove edge C-F' },
        { type: 'remove_node', node: 'D', description: 'Remove node D' }
      ];
      
      // Apply operations to create visualization steps
      let currentState = { ...sampleState };
      
      for (const op of operations) {
        if (op.type === 'add_node') {
          currentState = { 
            ...currentState,
            adjacencyList: { 
              ...currentState.adjacencyList, 
              [op.node]: [] 
            }
          };
        } else if (op.type === 'add_edge') {
          currentState = { 
            ...currentState,
            adjacencyList: { 
              ...currentState.adjacencyList,
              [op.from]: [
                ...currentState.adjacencyList[op.from],
                { node: op.to, weight: op.weight }
              ],
              [op.to]: [
                ...currentState.adjacencyList[op.to],
                { node: op.from, weight: op.weight }
              ]
            }
          };
        } else if (op.type === 'remove_edge') {
          currentState = { 
            ...currentState,
            adjacencyList: { 
              ...currentState.adjacencyList,
              [op.from]: currentState.adjacencyList[op.from].filter(e => e.node !== op.to),
              [op.to]: currentState.adjacencyList[op.to].filter(e => e.node !== op.from)
            }
          };
        } else if (op.type === 'remove_node') {
          const { [op.node]: removedNode, ...remainingNodes } = currentState.adjacencyList;
          
          // Remove any edges to the removed node
          const newAdjList = Object.entries(remainingNodes).reduce((acc, [node, edges]) => {
            acc[node] = edges.filter(e => e.node !== op.node);
            return acc;
          }, {});
          
          currentState = { 
            ...currentState,
            adjacencyList: newAdjList
          };
        }
        
        visualizer.record(dataStructure.id, currentState, op.description);
      }
    } else if (dataStructure?.id === 'priority_queue') {
      sampleState = {
        heap: [
          { value: 5, priority: 1 },
          { value: 10, priority: 2 },
          { value: 15, priority: 3 },
          { value: 20, priority: 4 }
        ]
      };
      
      // Record initial state
      visualizer.record(dataStructure.id, sampleState, 'Initial Priority Queue');
      
      // Add some sample operations
      const operations = [
        { type: 'insert', value: 2, priority: 0, description: 'Insert 2 with priority 0' },
        { type: 'extract_min', description: 'Extract minimum element' },
        { type: 'insert', value: 8, priority: 1, description: 'Insert 8 with priority 1' },
        { type: 'extract_min', description: 'Extract minimum element' }
      ];
      
      // Apply operations to create visualization steps
      let currentState = { ...sampleState };
      
      for (const op of operations) {
        if (op.type === 'insert') {
          currentState = {
            ...currentState,
            heap: [
              ...currentState.heap,
              { value: op.value, priority: op.priority }
            ].sort((a, b) => a.priority - b.priority)
          };
        } else if (op.type === 'extract_min') {
          currentState = {
            ...currentState,
            heap: currentState.heap.slice(1)
          };
        }
        
        visualizer.record(dataStructure.id, currentState, op.description);
      }
    }
    
    totalSteps = visualizer.getTotalSteps();
    currentStep = 0;
    visualElements = visualizer.getCurrentVisualElements();
  }
  
  function nextStep() {
    visualizer.nextStep();
    currentStep = visualizer.getCurrentStepNumber();
    visualElements = visualizer.getCurrentVisualElements();
  }
  
  function prevStep() {
    visualizer.previousStep();
    currentStep = visualizer.getCurrentStepNumber();
    visualElements = visualizer.getCurrentVisualElements();
  }
  
  function togglePlay() {
    if (isPlaying) {
      visualizer.pause();
    } else {
      visualizer.play();
    }
    isPlaying = !isPlaying;
  }
  
  onMount(() => {
    if (dataStructure) {
      document.title = `${dataStructure.name} - DSA Visualizer`;
      initializeVisualization();
    } else {
      document.title = 'Data Structure Not Found - DSA Visualizer';
    }
  });
</script>

{#if !dataStructure}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Data Structure Not Found</h1>
    <p class="mb-4">The data structure with ID "{dsId}" could not be found.</p>
    <a href="/" class="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700">
      Return to Home
    </a>
  </div>
{:else}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{dataStructure.name}</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left panel: Info -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Information</h2>
        
        <p class="mb-4">{dataStructure.description}</p>
        
        <h3 class="font-medium mb-2">Operations</h3>
        <div class="bg-gray-50 p-3 rounded-md mb-4">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left pb-2">Operation</th>
                <th class="text-right pb-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(dataStructure.operations) as [opName, operation]}
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-mono text-sm">{opName}</td>
                  <td class="py-2 text-right font-mono text-sm">{operation.complexity.time}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        
        <button 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
          on:click={initializeVisualization}
        >
          Reset Visualization
        </button>
        
        <div class="text-sm text-gray-600">
          <p>Try the visualization to see how this data structure works in action!</p>
        </div>
      </div>
      
      <!-- Middle panel: Visualization -->
      <div class="bg-white p-4 rounded-lg shadow lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">Visualization</h2>
        
        <div class="bg-gray-50 p-4 rounded-md mb-4 h-80 flex items-center justify-center">
          <DSVisualizer 
            visualElements={visualElements} 
            width={600} 
            height={300} 
          />
        </div>
        
        <div class="flex items-center justify-between mb-6">
          <div class="text-sm">
            Step {currentStep + 1} of {totalSteps}
          </div>
          
          <div class="flex space-x-2">
            <button 
              class="bg-gray-200 p-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={currentStep === 0}
              on:click={prevStep}
            >
              &lt; Prev
            </button>
            
            <button 
              class="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              on:click={togglePlay}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button 
              class="bg-gray-200 p-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={currentStep === totalSteps - 1}
              on:click={nextStep}
            >
              Next &gt;
            </button>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="flex border-b">
            <button 
              class={`py-2 px-4 ${$activeTab === 'learn' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
              on:click={() => $activeTab = 'learn'}
            >
              Learn More
            </button>
          </div>
          
          <div class="mt-4">
            <LearnPanel algorithm={{
              id: '',
              name: '',
              description: '',
              complexity: { time: '', space: '' },
              relatedDataStructures: [],
              languages: {}
            }} dataStructure={dataStructure} />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 