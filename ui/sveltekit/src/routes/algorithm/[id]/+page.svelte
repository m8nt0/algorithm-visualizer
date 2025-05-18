<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { loadAlgorithm, loadDataStructure, createVisualizer, getInterpreter } from '$lib/loader';
  import { selectedAlgorithm, selectedDataStructure, selectedLanguage, currentCode, activeTab } from '$lib/stores';
  import CodeEditor from '../../../components/CodeEditor.svelte';
  import DSVisualizer from '../../../components/DSVisualizer.svelte';
  import LearnPanel from '../../../components/LearnPanel.svelte';
  
  // Get the algorithm ID from the URL
  const algorithmId = $page.params.id;
  
  // Load the algorithm and its related data structure
  let algorithm = loadAlgorithm(algorithmId);
  let dataStructure = algorithm?.relatedDataStructures?.[0] 
    ? loadDataStructure(algorithm.relatedDataStructures[0]) 
    : null;
  
  // Update stores
  $selectedAlgorithm = algorithm;
  $selectedDataStructure = dataStructure;
  $selectedLanguage = Object.keys(algorithm?.languages || {})[0] || 'typescript';
  $currentCode = algorithm?.languages[$selectedLanguage] || '';
  
  // Visualization state
  let visualizer = createVisualizer();
  let interpreter = getInterpreter();
  let isPlaying = false;
  let currentStep = 0;
  let totalSteps = 0;
  let visualElements = [];
  
  function handleLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    $selectedLanguage = target.value;
    $currentCode = algorithm?.languages[$selectedLanguage] || '';
  }
  
  async function runCode() {
    visualizer.clear();
    
    // Create a sample state for the data structure
    let sampleState;
    
    if ($selectedDataStructure?.id === 'graph') {
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
    } else if ($selectedDataStructure?.id === 'priority_queue') {
      sampleState = {
        heap: [
          { value: 5, priority: 1 },
          { value: 10, priority: 2 },
          { value: 15, priority: 3 },
          { value: 20, priority: 4 }
        ]
      };
    }
    
    // Record initial state
    visualizer.record($selectedDataStructure?.id || 'unknown', sampleState, 'Initial state');
    
    // For demo purposes, simulate algorithm execution with multiple frames
    if ($selectedAlgorithm?.id === 'dijkstra') {
      // Simulate Dijkstra's algorithm steps
      const steps = [
        { highlighted: ['A'], highlightedEdges: [] },
        { highlighted: ['A', 'B'], highlightedEdges: [{ from: 'A', to: 'B' }] },
        { highlighted: ['A', 'B', 'C'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }] },
        { highlighted: ['A', 'B', 'C', 'D'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'C', to: 'D' }] },
        { highlighted: ['A', 'B', 'C', 'D', 'F'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'F' }] },
        { highlighted: ['A', 'B', 'C', 'D', 'E', 'F'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'F' }, { from: 'F', to: 'E' }] }
      ];
      
      for (let i = 0; i < steps.length; i++) {
        const newState = { ...sampleState, ...steps[i] };
        visualizer.record($selectedDataStructure?.id || 'unknown', newState, `Step ${i + 1}: Processing node ${steps[i].highlighted[steps[i].highlighted.length - 1]}`);
      }
    } else if ($selectedAlgorithm?.id === 'bfs') {
      // Simulate BFS steps
      const steps = [
        { highlighted: ['A'], highlightedEdges: [] },
        { highlighted: ['A', 'B'], highlightedEdges: [{ from: 'A', to: 'B' }] },
        { highlighted: ['A', 'B', 'C'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }] },
        { highlighted: ['A', 'B', 'C', 'E'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'E' }] },
        { highlighted: ['A', 'B', 'C', 'E', 'D'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'E' }, { from: 'C', to: 'D' }] },
        { highlighted: ['A', 'B', 'C', 'E', 'D', 'F'], highlightedEdges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'E' }, { from: 'C', to: 'D' }, { from: 'D', to: 'F' }] }
      ];
      
      for (let i = 0; i < steps.length; i++) {
        const newState = { ...sampleState, ...steps[i] };
        visualizer.record($selectedDataStructure?.id || 'unknown', newState, `Step ${i + 1}: Visiting ${steps[i].highlighted[steps[i].highlighted.length - 1]}`);
      }
    }
    
    // Try to execute code (for JavaScript/TypeScript)
    if (['javascript', 'typescript'].includes($selectedLanguage)) {
      try {
        const result = await interpreter.execute($currentCode, $selectedLanguage);
        console.log('Code execution result:', result);
      } catch (error) {
        console.error('Code execution error:', error);
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
    if (algorithm) {
      document.title = `${algorithm.name} - DSA Visualizer`;
    } else {
      document.title = 'Algorithm Not Found - DSA Visualizer';
    }
  });
</script>

{#if !algorithm}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Algorithm Not Found</h1>
    <p class="mb-4">The algorithm with ID "{algorithmId}" could not be found.</p>
    <a href="/" class="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700">
      Return to Home
    </a>
  </div>
{:else}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{algorithm.name}</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left panel: Controls -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Settings</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select 
            class="w-full border border-gray-300 rounded-md p-2" 
            on:change={handleLanguageChange}
          >
            {#each Object.keys(algorithm.languages) as lang}
              <option value={lang} selected={lang === $selectedLanguage}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            {/each}
          </select>
        </div>
        
        <button 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          on:click={runCode}
        >
          Run Algorithm
        </button>
        
        <div class="mt-6">
          <h3 class="text-lg font-medium mb-2">Algorithm Info</h3>
          <div class="bg-gray-50 p-3 rounded-md">
            <div class="mb-2">
              <span class="font-medium">Time Complexity:</span> 
              <span class="font-mono">{algorithm.complexity.time}</span>
            </div>
            <div>
              <span class="font-medium">Space Complexity:</span> 
              <span class="font-mono">{algorithm.complexity.space}</span>
            </div>
          </div>
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
        
        <div class="flex items-center justify-between">
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
              class={`py-2 px-4 ${$activeTab === 'code' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
              on:click={() => $activeTab = 'code'}
            >
              Code
            </button>
            <button 
              class={`py-2 px-4 ${$activeTab === 'learn' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
              on:click={() => $activeTab = 'learn'}
            >
              Learn
            </button>
          </div>
          
          {#if $activeTab === 'code'}
            <div class="mt-4 h-80">
              <CodeEditor 
                code={$currentCode} 
                language={$selectedLanguage}
                on:change={e => $currentCode = e.detail}
              />
            </div>
          {:else}
            <div class="mt-4">
              <LearnPanel algorithm={algorithm} dataStructure={dataStructure} />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if} 