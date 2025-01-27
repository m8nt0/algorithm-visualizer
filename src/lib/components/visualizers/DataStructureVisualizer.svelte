<script lang="ts">
    import type { DataStructure } from '$lib/types/DataStructure';
    import type { VisualizationStep } from '$lib/types/Visualization';
    import ArrayVisualizer from './ArrayVisualizer.svelte';
    import LinkedListVisualizer from './LinkedListVisualizer.svelte';
    import TreeVisualizer from './TreeVisualizer.svelte';
    import GraphVisualizer from './GraphVisualizer.svelte';
    import QueueVisualizer from './QueueVisualizer.svelte';
    import StackVisualizer from './StackVisualizer.svelte';

    export let dataStructure: DataStructure;
    export let initialData: number[] = [];
    export let currentStep = 0;
    export let highlightedLines: number[] = [];

    let steps: VisualizationStep[] = [];
    let isPlaying = false;
    let playbackSpeed = 500;

    $: {
        // Reset visualization when data structure changes
        steps = generateInitialSteps(dataStructure, initialData);
        currentStep = 0;
        highlightedLines = [];
    }

    function generateInitialSteps(ds: DataStructure, data: number[]): VisualizationStep[] {
        return [{
            description: "Initial state",
            data,
            highlights: []
        }];
    }
</script>

<div class="visualizer">
    <div class="visualization-area">
        {#if dataStructure.visualizationType === 'array'}
            <ArrayVisualizer data={steps[currentStep]?.data ?? initialData} highlights={steps[currentStep]?.highlights ?? []} />
        {:else if dataStructure.visualizationType === 'linkedlist'}
            <LinkedListVisualizer data={steps[currentStep]?.data ?? initialData} highlights={steps[currentStep]?.highlights ?? []} />
        {:else if dataStructure.visualizationType === 'tree'}
            <TreeVisualizer data={steps[currentStep]?.data ?? initialData} highlights={steps[currentStep]?.highlights ?? []} />
        {:else if dataStructure.visualizationType === 'graph'}
            <GraphVisualizer data={steps[currentStep]?.data ?? initialData} highlights={steps[currentStep]?.highlights ?? []} />
        {:else if dataStructure.visualizationType === 'queue'}
            <QueueVisualizer data={steps[currentStep]?.data ?? initialData} highlights={steps[currentStep]?.highlights ?? []} />
        {:else if dataStructure.visualizationType === 'stack'}
            <StackVisualizer data={steps[currentStep]?.data ?? initialData} highlights={steps[currentStep]?.highlights ?? []} />
        {/if}
    </div>

    <div class="controls">
        <!-- Add controls similar to AlgorithmVisualizer -->
    </div>
</div>

<style>
    .visualizer {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .visualization-area {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #252525;
        border-radius: 8px;
        padding: 1rem;
        min-height: 300px;
    }

    .controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        background: #252525;
        border-radius: 8px;
    }
</style>