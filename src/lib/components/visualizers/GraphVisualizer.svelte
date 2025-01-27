<script lang="ts">
    import { onMount } from 'svelte';
    import type { Graph } from '$lib/algorithms/types';

    export let data: Graph;
    export let highlights: (string | number)[] = [];

    let container: HTMLElement;

    onMount(() => {
        // Basic visualization using the data and highlights
        if (data.vertices.size > 0) {
            // Implement visualization logic
            console.log('Visualizing graph with', data.vertices.size, 'vertices');
        }
    });
</script>

<div class="graph-container" bind:this={container}>
    <svg width="100%" height="100%">
        <!-- Add visualization elements here -->
        {#each Array.from(data.vertices.values()) as vertex}
            <circle 
                cx={vertex.x || 0} 
                cy={vertex.y || 0} 
                r="20"
                class:highlighted={highlights.includes(vertex.id)}
            />
        {/each}
    </svg>
</div>

<style>
    .graph-container {
        width: 100%;
        height: 400px;
        background: #f5f5f5;
        border-radius: 8px;
    }

    circle {
        fill: #4a4a4a;
        stroke: #333;
        stroke-width: 2;
    }

    circle.highlighted {
        fill: #2196f3;
    }
</style> 