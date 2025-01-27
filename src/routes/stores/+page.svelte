<script lang="ts">
    import SplitPane from '$lib/components/Layout/SplitPane.svelte';
    import CodePanel from '$lib/components/CodeEditor/CodePanel.svelte';
    import DataStructureVisualizer from '$lib/components/visualizers/DataStructureVisualizer.svelte';
    import { dataStructureCategories } from '$lib/data/dataStructureCategories';
    import { dataStructureExplanations } from '$lib/data/dataStructureExplanations';
    import { slide } from 'svelte/transition';
    
    let selectedCategory = dataStructureCategories[0];
    let selectedStructure = selectedCategory.structures[0];
    let showExplanation = true;
    let currentStep = 0;
    let highlightedLines: number[] = [];
    let initialData = [1, 2, 3, 4, 5];

    $: explanation = dataStructureExplanations[selectedStructure.id];
</script>

<div class="page">
    <div class="header">
        <div class="selectors">
            <select bind:value={selectedCategory}>
                {#each dataStructureCategories as category}
                    <option value={category}>{category.name}</option>
                {/each}
            </select>

            <select bind:value={selectedStructure}>
                {#each selectedCategory.structures as structure}
                    <option value={structure}>{structure.name}</option>
                {/each}
            </select>
        </div>

        <button 
            class="toggle-explanation" 
            on:click={() => showExplanation = !showExplanation}
        >
            {showExplanation ? 'Hide' : 'Show'} Info
        </button>
    </div>

    {#if showExplanation && explanation}
        <div class="explanation" transition:slide>
            <div class="explanation-content">
                <div class="section">
                    <h3>{explanation.title}</h3>
                    <p>{selectedStructure.description}</p>
                </div>

                <div class="section">
                    <h3>Operations</h3>
                    <div class="operations">
                        {#each selectedStructure.operations as op}
                            <div class="operation">
                                <span class="operation-name">{op.name}</span>
                                <span class="complexity">Time: {op.complexity.time}</span>
                                <span class="complexity">Space: {op.complexity.space}</span>
                            </div>
                        {/each}
                    </div>
                </div>

                {#if explanation.useCases}
                    <div class="section">
                        <h3>Use Cases</h3>
                        <ul>
                            {#each explanation.useCases as useCase}
                                <li>{useCase}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <div class="main-content">
        <SplitPane>
            <div slot="left" class="code-panel">
                <CodePanel 
                    algorithmId={selectedStructure.id}
                    {currentStep}
                    {highlightedLines}
                />
            </div>
            <div slot="right" class="visualizer-panel">
                <DataStructureVisualizer 
                    dataStructure={selectedStructure}
                    {initialData}
                    bind:currentStep
                    bind:highlightedLines
                />
            </div>
        </SplitPane>
    </div>
</div>

<style>
    .page {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background: #1e1e1e;
        color: white;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        background: #252525;
        border-radius: 8px;
    }

    .selectors {
        display: flex;
        gap: 1rem;
    }

    select {
        padding: 0.5rem;
        background: #333;
        color: white;
        border: 1px solid #444;
        border-radius: 4px;
        cursor: pointer;
    }

    .toggle-explanation {
        padding: 0.5rem 1rem;
        background: #4ec9b0;
        color: #1e1e1e;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .toggle-explanation:hover {
        background: #3da892;
    }

    .explanation {
        background: #252525;
        border-radius: 8px;
        padding: 1rem;
    }

    .explanation-content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .section {
        background: #2d2d2d;
        padding: 1rem;
        border-radius: 6px;
    }

    .section h3 {
        color: #4ec9b0;
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .operations {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .operation {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        background: #333;
        border-radius: 4px;
    }

    .operation-name {
        color: #4ec9b0;
        font-weight: bold;
    }

    .complexity {
        color: #888;
        font-size: 0.9rem;
    }

    .main-content {
        flex: 1;
        min-height: 0;
    }

    .code-panel, .visualizer-panel {
        height: 100%;
        overflow: hidden;
    }

    @media (max-width: 1200px) {
        .explanation-content {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .header {
            flex-direction: column;
        }

        .selectors {
            width: 100%;
        }

        select {
            flex: 1;
        }

        .toggle-explanation {
            width: 100%;
        }

        .explanation-content {
            grid-template-columns: 1fr;
        }
    }
</style> 