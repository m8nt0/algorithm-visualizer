<script lang="ts">
  import { onMount } from 'svelte';
  import TopBar from '../components/TopBar.svelte';
  import CodeEditor from '../components/CodeEditor.svelte';
  import DSVisualizer from '../components/DSVisualizer.svelte';
  import LearnPanel from '../components/LearnPanel.svelte';
  import { 
    selectedAlgorithm, 
    selectedDataStructure, 
    algorithmCode, 
    dataStructureCode, 
    algorithmTabActive, 
    dataStructureTabActive,
    layoutState,
    visualizationStep,
    totalSteps,
    visualElements,
    currentStepExplanation,
    highlightedAlgorithmLines,
    highlightedDSLines,
    isPlaying
  } from '$lib/stores';
  import { runVisualization, nextStep, previousStep, playVisualization, pauseVisualization } from '$lib/loader';
  
  // Set document title
  onMount(() => {
    document.title = 'Data Structure & Algorithm Visualizer';
    
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    // Set up resize handler to adjust layout
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);
    
    return () => {
      document.body.style.overflow = '';
      resizeObserver.disconnect();
    };
  });
  
  function handleResize() {
    // Adjust layout based on window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Update visualizer height on small screens
    if (windowHeight < 800) {
      $layoutState.visualizerPaneSize = 35;
    } else {
      $layoutState.visualizerPaneSize = 40;
    }
    
    // Adjust algorithm/data structure pane split on narrow screens
    if (windowWidth < 900) {
      $layoutState.algorithmPaneSize = 100;
    } else {
      $layoutState.algorithmPaneSize = 50;
    }
  }
  
  // Run visualization
  function handleRunClick() {
    if (!$selectedAlgorithm || !$selectedDataStructure) return;
    
    runVisualization($selectedAlgorithm.id, $selectedDataStructure.id);
  }
  
  // Handle play/pause
  function togglePlayPause() {
    if ($isPlaying) {
      pauseVisualization();
      $isPlaying = false;
    } else {
      playVisualization();
      $isPlaying = true;
    }
  }
  
  // Handle next/previous step
  function handleNextStep() {
    nextStep();
  }
  
  function handlePrevStep() {
    previousStep();
  }
  
  // Compute dynamic heights based on layout state
  $: algorithmWindowHeight = `${100 - $layoutState.visualizerPaneSize}vh`;
  $: visualizerHeight = `${$layoutState.visualizerPaneSize}vh`;
  $: algorithmPaneWidth = `${$layoutState.algorithmPaneSize}%`;
  $: dataStructurePaneWidth = `${100 - $layoutState.algorithmPaneSize}%`;
  
  // Initialize default dimensions
  let visualizerWidth = 800;
  let visualizerHeight2 = 400;
  
  onMount(() => {
    // Now we can safely access window in the browser
    visualizerWidth = window.innerWidth - 40;
    visualizerHeight2 = window.innerHeight * ($layoutState.visualizerPaneSize / 100) - 80;
    
    // Update on resize
    window.addEventListener('resize', () => {
      visualizerWidth = window.innerWidth - 40;
      visualizerHeight2 = window.innerHeight * ($layoutState.visualizerPaneSize / 100) - 80;
    });
    
    return () => {
      window.removeEventListener('resize', () => {
        visualizerWidth = window.innerWidth - 40;
        visualizerHeight2 = window.innerHeight * ($layoutState.visualizerPaneSize / 100) - 80;
      });
    };
  });
</script>

<!-- Top bar for selection -->
<div class="main-layout">
  <TopBar />
  
  <!-- Main content area -->
  <div class="content-area">
    <!-- Algorithm and Data Structure Windows -->
    <div class="windows-container" style:height={algorithmWindowHeight}>
      <!-- Algorithm Window -->
      <div class="window algorithm-window" style:width={algorithmPaneWidth}>
        <div class="window-header">
          <h2 class="window-title">{$selectedAlgorithm?.name || 'Algorithm'}</h2>
          <div class="tab-buttons">
            <button 
              class="tab-button {$algorithmTabActive === 'learn' ? 'active' : ''}" 
              on:click={() => $algorithmTabActive = 'learn'}
            >
              Learn
            </button>
            <button 
              class="tab-button {$algorithmTabActive === 'code' ? 'active' : ''}" 
              on:click={() => $algorithmTabActive = 'code'}
            >
              Code Editor
            </button>
          </div>
        </div>
        
        <div class="window-content">
          {#if $algorithmTabActive === 'learn' && $selectedAlgorithm}
            <LearnPanel 
              content={$selectedAlgorithm} 
              type="algorithm" 
              height="100%" 
            />
          {:else if $selectedAlgorithm}
            <CodeEditor 
              code={$algorithmCode} 
              language={'typescript'} 
              highlightedLines={$highlightedAlgorithmLines}
              on:change={e => $algorithmCode = e.detail} 
            />
          {:else}
            <div class="empty-state">
              <p>Select an algorithm to start</p>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Data Structure Window -->
      <div class="window ds-window" style:width={dataStructurePaneWidth}>
        <div class="window-header">
          <h2 class="window-title">{$selectedDataStructure?.name || 'Data Structure'}</h2>
          <div class="tab-buttons">
            <button 
              class="tab-button {$dataStructureTabActive === 'learn' ? 'active' : ''}" 
              on:click={() => $dataStructureTabActive = 'learn'}
            >
              Learn
            </button>
            <button 
              class="tab-button {$dataStructureTabActive === 'code' ? 'active' : ''}" 
              on:click={() => $dataStructureTabActive = 'code'}
            >
              Code Editor
            </button>
          </div>
        </div>
        
        <div class="window-content">
          {#if $dataStructureTabActive === 'learn' && $selectedDataStructure}
            <LearnPanel 
              content={$selectedDataStructure} 
              type="dataStructure" 
              height="100%" 
            />
          {:else if $selectedDataStructure}
            <CodeEditor 
              code={$dataStructureCode} 
              language={'typescript'} 
              highlightedLines={$highlightedDSLines}
              on:change={e => $dataStructureCode = e.detail} 
            />
          {:else}
            <div class="empty-state">
              <p>Select a data structure to start</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Visualizer Panel -->
    <div class="visualizer-panel" style:height={visualizerHeight}>
      <div class="visualizer-header">
        <h2 class="visualizer-title">Visualization</h2>
        
        <div class="visualizer-actions">
          <button 
            class="action-button run-button" 
            on:click={handleRunClick}
            disabled={!$selectedAlgorithm || !$selectedDataStructure}
          >
            Run Visualization
          </button>
          
          {#if $totalSteps > 0}
            <div class="playback-controls">
              <button 
                class="control-button"
                disabled={$visualizationStep === 0}
                on:click={handlePrevStep}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <button 
                class="control-button play-button"
                on:click={togglePlayPause}
              >
                {#if $isPlaying}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                {/if}
              </button>
              
              <button 
                class="control-button"
                disabled={$visualizationStep === $totalSteps - 1}
                on:click={handleNextStep}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          {/if}
        </div>
      </div>
      
      <div class="visualizer-content">
        <DSVisualizer 
          visualElements={$visualElements}
          width={visualizerWidth}
          height={visualizerHeight2}
          currentStep={$visualizationStep}
          totalSteps={$totalSteps}
          stepDescription={$currentStepExplanation}
          interactiveMode={true}
          on:nextStep={handleNextStep}
          on:prevStep={handlePrevStep}
        />
      </div>
      
      {#if $currentStepExplanation}
        <div class="step-description">
          <p>{$currentStepExplanation}</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body, html) {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .main-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #f8fafc;
  }
  
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .windows-container {
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  
  .window {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .algorithm-window {
    border-right: 1px solid #e2e8f0;
  }
  
  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
  }
  
  .window-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .tab-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .tab-button {
    padding: 0.25rem 0.75rem;
    background-color: transparent;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tab-button:hover {
    background-color: #f1f5f9;
  }
  
  .tab-button.active {
    background-color: #e2e8f0;
    font-weight: 500;
  }
  
  .window-content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  
  .visualizer-panel {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-top: 1px solid #e2e8f0;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .visualizer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
  }
  
  .visualizer-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .visualizer-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .action-button {
    padding: 0.375rem 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-button:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  .action-button:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
  
  .playback-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .control-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: #f1f5f9;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .control-button:hover:not(:disabled) {
    background-color: #e2e8f0;
  }
  
  .control-button:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
  }
  
  .play-button {
    background-color: #3b82f6;
    color: white;
  }
  
  .play-button:hover {
    background-color: #2563eb;
  }
  
  .visualizer-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow: hidden;
  }
  
  .step-description {
    padding: 0.5rem 1rem;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
    font-size: 0.875rem;
    color: #1e293b;
  }
  
  .step-description p {
    margin: 0;
  }
  
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #64748b;
  }
  
  /* Responsive styles */
  @media (max-width: 900px) {
    .windows-container {
      flex-direction: column;
    }
    
    .window {
      width: 100% !important;
    }
    
    .algorithm-window {
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
      height: 50%;
    }
    
    .ds-window {
      height: 50%;
    }
  }
</style>
