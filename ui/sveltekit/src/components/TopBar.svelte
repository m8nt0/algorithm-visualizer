<script lang="ts">
  import { loadAlgorithms, loadDataStructures, getAlgorithmCode, getDataStructureCode } from '$lib/loader';
  import { selectedAlgorithm, selectedDataStructure, algorithmCode, dataStructureCode, selectedLanguage, isCompatible } from '$lib/stores';
  import type { Algorithm } from '@core/algorithms';
  import type { DataStructure } from '@core/data_structures';
  import { onMount } from 'svelte';
  
  // Load all available algorithms and data structures
  const algorithms = loadAlgorithms();
  const dataStructures = loadDataStructures();
  
  // Initialize with the first algorithm and compatible data structure
  onMount(() => {
    if (algorithms.length > 0 && !$selectedAlgorithm) {
      const firstAlgorithm = algorithms[0];
      $selectedAlgorithm = firstAlgorithm;
      
      // Find a compatible data structure
      if (firstAlgorithm.relatedDataStructures.length > 0) {
        const dsId = firstAlgorithm.relatedDataStructures[0];
        const ds = dataStructures.find(ds => ds.id === dsId);
        if (ds) {
          $selectedDataStructure = ds;
        }
      }
    }
  });
  
  // Update code when selection changes
  $: if ($selectedAlgorithm) {
    $algorithmCode = getAlgorithmCode($selectedAlgorithm.id, $selectedLanguage);
  }
  
  $: if ($selectedDataStructure) {
    $dataStructureCode = getDataStructureCode($selectedDataStructure.id, $selectedLanguage);
  }
  
  function handleAlgorithmChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    const algorithm = algorithms.find(alg => alg.id === selectedId);
    
    if (algorithm) {
      $selectedAlgorithm = algorithm;
      
      // If current data structure is not compatible, select a compatible one
      if (!$isCompatible) {
        if (algorithm.relatedDataStructures.length > 0) {
          const dsId = algorithm.relatedDataStructures[0];
          const ds = dataStructures.find(ds => ds.id === dsId);
          if (ds) {
            $selectedDataStructure = ds;
          }
        }
      }
    }
  }
  
  function handleDataStructureChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    const dataStructure = dataStructures.find(ds => ds.id === selectedId);
    
    if (dataStructure) {
      $selectedDataStructure = dataStructure;
    }
  }
  
  function handleLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    $selectedLanguage = target.value;
  }
  
  // Filter compatible data structures based on selected algorithm
  $: compatibleDataStructures = $selectedAlgorithm 
    ? dataStructures.filter(ds => $selectedAlgorithm?.relatedDataStructures.includes(ds.id))
    : dataStructures;
</script>

<header class="h-14 bg-slate-800 text-white px-4 flex items-center justify-between shadow-md">
  <div class="flex items-center gap-4">
    <div class="font-medium text-xl">DSA Visualizer</div>
    
    <div class="flex gap-4">
      <div>
        <label for="algorithm-select" class="sr-only">Algorithm</label>
        <select 
          id="algorithm-select"
          class="bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 text-sm"
          on:change={handleAlgorithmChange}
        >
          {#each algorithms as algorithm}
            <option 
              value={algorithm.id} 
              selected={$selectedAlgorithm?.id === algorithm.id}
            >
              {algorithm.name}
            </option>
          {/each}
        </select>
      </div>
      
      <div>
        <label for="ds-select" class="sr-only">Data Structure</label>
        <select 
          id="ds-select"
          class="bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 text-sm"
          on:change={handleDataStructureChange}
        >
          {#each compatibleDataStructures as dataStructure}
            <option 
              value={dataStructure.id} 
              selected={$selectedDataStructure?.id === dataStructure.id}
            >
              {dataStructure.name}
            </option>
          {/each}
        </select>
      </div>
    </div>
  </div>
  
  <div>
    <label for="language-select" class="sr-only">Language</label>
    <select 
      id="language-select"
      class="bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 text-sm"
      on:change={handleLanguageChange}
    >
      <option value="typescript" selected={$selectedLanguage === 'typescript'}>TypeScript</option>
      <option value="javascript" selected={$selectedLanguage === 'javascript'}>JavaScript</option>
      <option value="python" selected={$selectedLanguage === 'python'}>Python</option>
      <option value="java" selected={$selectedLanguage === 'java'}>Java</option>
      <option value="cpp" selected={$selectedLanguage === 'cpp'}>C++</option>
    </select>
  </div>
</header> 