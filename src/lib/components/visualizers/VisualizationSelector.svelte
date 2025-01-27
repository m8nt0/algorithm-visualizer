<script lang="ts">
    import type { VisualizationStep, VisualizationType } from '$lib/types/Visualization';
    import ArrayVisualizer from './ArrayVisualizer.svelte';

    export let type: VisualizationType;
    export let step: VisualizationStep;
</script>

<div class="visualization-container">
    {#if type === 'array'}
        <ArrayVisualizer data={step.data} highlights={step.highlights} />
    {:else}
        <div class="not-implemented">
            Visualization for {type} is not implemented yet
        </div>
    {/if}
</div>

<style>
    .visualization-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .not-implemented {
        color: #666;
        font-style: italic;
    }
</style> 