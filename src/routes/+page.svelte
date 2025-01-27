<script lang="ts">
    import SplitPane from '$lib/components/Layout/SplitPane.svelte';
    import CodePanel from '$lib/components/CodeEditor/CodePanel.svelte';
    import AlgorithmVisualizer from '$lib/components/visualizers/AlgorithmVisualizer.svelte';
    import DataStructureVisualizer from '$lib/components/visualizers/DataStructureVisualizer.svelte';
    import { algorithmCategories } from '$lib/data/algorithmCategories';
    import { dataStructureCategories } from '$lib/data/dataStructureCategories';
    import type { AlgorithmExplanation, DataStructureExplanation } from '$lib/types/Visualization';
    import { algorithmExplanations } from '$lib/data/algorithmExplanations';
    import { dataStructureExplanations } from '$lib/data/dataStructureExplanations';
    import { slide } from 'svelte/transition';

    type Mode = 'algorithm' | 'datastructure';
    let mode: Mode = 'algorithm';
    let selectedAlgorithm = algorithmCategories[0].algorithms[0];
    let selectedDataStructure = dataStructureCategories[0].structures[0];
    let initialData = [1, 2, 3, 4, 5];
    let code = ''; // Declare code variable first
    let showExplanation = true;
    let currentStep = 0;
    let highlightedLines: number[] = [];

    $: explanation = mode === 'algorithm' 
        ? algorithmExplanations[selectedAlgorithm.id]
        : dataStructureExplanations[selectedDataStructure.id];

    $: currentItem = mode === 'algorithm' ? selectedAlgorithm : selectedDataStructure;

    function handleCodeChange(newCode: string) {
        code = newCode;
        // Add any additional code change handling here
    }

    // Update code when selected item changes
    $: code = getCode(mode === 'algorithm' ? selectedAlgorithm.id : selectedDataStructure.id);

    function getCode(id: string): string {
        // This will be replaced with actual implementation loading
        return `// Implementation
function ${id}() {
    // Implementation details here
}`;
    }

    // Type guard functions
    function isAlgorithmExplanation(exp: AlgorithmExplanation | DataStructureExplanation): exp is AlgorithmExplanation {
        return 'steps' in exp && 'complexity' in exp;
    }

    function getSteps(explanation: AlgorithmExplanation | DataStructureExplanation | undefined) {
        if (!explanation) return [];
        return isAlgorithmExplanation(explanation) 
            ? explanation.steps 
            : explanation.operations.map((op: { description: string }) => op.description);
    }

    function getComplexityInfo(explanation: AlgorithmExplanation | DataStructureExplanation | undefined) {
        if (!explanation) return null;
        return isAlgorithmExplanation(explanation)
            ? {
                time: explanation.complexity.time,
                space: explanation.complexity.space,
                best: explanation.complexity.best
            }
            : null;
    }

    $: steps = getSteps(explanation);
    $: complexityInfo = getComplexityInfo(explanation);
</script>

<main class="app-container">
    <!-- Header -->
    <header class="app-header">
        <div class="header-content">
            <div class="left-section">
                <h1>VISUALIZER</h1>
            </div>

            <div class="center-section">
                <div class="mode-selector">
                    <button class:active={mode === 'algorithm'} on:click={() => mode = 'algorithm'}>
                        Algorithms
                    </button>
                    <button class:active={mode === 'datastructure'} on:click={() => mode = 'datastructure'}>
                        Data Structures
                    </button>
                </div>

                <div class="item-selector">
                    {#if mode === 'algorithm'}
                        <select bind:value={selectedAlgorithm}>
                            {#each algorithmCategories as category}
                                <optgroup label={category.name}>
                                    {#each category.algorithms as algorithm}
                                        <option value={algorithm}>{algorithm.name}</option>
                                    {/each}
                                </optgroup>
                            {/each}
                        </select>
                    {:else}
                        <select bind:value={selectedDataStructure}>
                            {#each dataStructureCategories as category}
                                <optgroup label={category.name}>
                                    {#each category.structures as structure}
                                        <option value={structure}>{structure.name}</option>
                                    {/each}
                                </optgroup>
                            {/each}
                        </select>
                    {/if}
                </div>
            </div>

            <div class="right-section">
                <button 
                    class="explanation-toggle"
                    on:click={() => showExplanation = !showExplanation}
                >
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="main-layout">
        <!-- Explanation Panel -->
        {#if showExplanation}
            <div class="explanation-panel" transition:slide>
                <div class="explanation-content">
                    <h2>{explanation?.title || currentItem.name}</h2>
                    <p class="description">{currentItem.description}</p>

                    {#if explanation}
                        <div class="explanation-grid">
                            <div class="section">
                                <h3>How it Works</h3>
                                <ul>
                                    {#each steps as step}
                                        <li>{step}</li>
                                    {/each}
                                </ul>
                            </div>

                            <div class="section">
                                <h3>Complexity Analysis</h3>
                                <ul>
                                    {#if complexityInfo}
                                        <li>Time: {complexityInfo.time}</li>
                                        <li>Space: {complexityInfo.space}</li>
                                        <li>Best Case: {complexityInfo.best}</li>
                                    {:else}
                                        {#each (explanation as DataStructureExplanation).operations as op}
                                            <li>
                                                <strong>{op.name}:</strong>
                                                Time: {op.complexity}
                                            </li>
                                        {/each}
                                    {/if}
                                </ul>
                            </div>

                            <div class="section">
                                <h3>Common Use Cases</h3>
                                <ul>
                                    {#each explanation.useCases as useCase}
                                        <li>{useCase}</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    {:else}
                        <p>Explanation coming soon...</p>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Split View -->
        <div class="split-view">
            <SplitPane>
                <div slot="left" class="code-panel">
                    <CodePanel 
                        algorithmId={selectedAlgorithm.id}
                        {currentStep}
                        {highlightedLines}
                    />
                </div>
                <div slot="right" class="visualizer-panel">
                    {#if mode === 'algorithm'}
                        <AlgorithmVisualizer 
                            algorithm={selectedAlgorithm}
                            {currentStep}
                            {highlightedLines}
                            {initialData}
                        />
                    {:else}
                        <DataStructureVisualizer 
                            dataStructure={selectedDataStructure} 
                            {initialData} 
                        />
                    {/if}
                </div>
            </SplitPane>
        </div>
    </div>
</main>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }

    .app-header {
        background: #1e1e1e;
        border-bottom: 1px solid #333;
        padding: 0.75rem;
        flex-shrink: 0;
        height: 60px;
    }

    .header-content {
        max-width: 1800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
    }

    .left-section h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #4ec9b0;
    }

    .center-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .mode-selector {
        display: flex;
        gap: 1px;
        background: #333;
        padding: 2px;
        border-radius: 6px;
    }

    .mode-selector button {
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        color: #888;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;
    }

    .mode-selector button.active {
        background: #4a4a4a;
        color: white;
    }

    .item-selector select {
        background: #2d2d2d;
        color: white;
        border: 1px solid #444;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        min-width: 200px;
        cursor: pointer;
    }

    .explanation-toggle {
        padding: 0.5rem 1rem;
        background: #2d2d2d;
        border: 1px solid #444;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .explanation-toggle:hover {
        background: #3d3d3d;
        border-color: #555;
    }

    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            gap: 0.75rem;
            padding: 0.5rem;
            height: auto;
        }

        .app-header {
            height: auto;
        }

        .center-section {
            flex-direction: column;
            width: 100%;
            gap: 0.75rem;
        }

        .mode-selector, .item-selector select {
            width: 100%;
        }

        .right-section {
            width: 100%;
        }

        .explanation-toggle {
            width: 100%;
        }
    }

    .main-layout {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0; /* Important for Firefox */
    }

    .explanation-panel {
        background: #1e1e1e;
        border-bottom: 1px solid #333;
        flex-shrink: 0;
        overflow-y: auto;
    }

    .split-view {
        flex: 1;
        min-height: 0; /* Important for Firefox */
    }

    .code-panel, .visualizer-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem;
        }

        select {
            width: 100%;
        }

        .split-view {
            flex-direction: column;
        }
    }

    @media (max-width: 480px) {
        .mode-selector {
            width: 100%;
        }

        .mode-selector button {
            flex: 1;
        }
    }

    /* Dark theme styles */
    :global(body) {
        background: #1e1e1e;
        color: #fff;
    }

    /* ... rest of your existing styles ... */
</style>
