<script lang="ts">
    export let data: number[] = [];
    export let highlights: number[] = [];
    export let swapping: [number, number] | null = null;

    $: nodes = data.map((value, index) => ({
        value: value as number,
        isHighlighted: highlights.includes(index),
        isSwapping: swapping?.includes(index)
    }));
</script>

<div class="linkedlist-container">
    {#each nodes as node, index}
        <div class="node-container">
            <div class="node" 
                class:highlighted={node.isHighlighted}
                class:swapping={node.isSwapping}
            >
                <div class="value">{node.value}</div>
                <div class="index">{index}</div>
            </div>
            {#if index < nodes.length - 1}
                <div class="arrow">→</div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .linkedlist-container {
        display: flex;
        align-items: center;
        padding: 2rem;
        overflow-x: auto;
        min-height: 120px;
    }

    .node-container {
        display: flex;
        align-items: center;
    }

    .node {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2d2d2d;
        border: 2px solid #4a4a4a;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        position: relative;
    }

    .value {
        font-size: 1.1rem;
        font-weight: bold;
    }

    .index {
        font-size: 0.7rem;
        color: #666;
        position: absolute;
        bottom: -20px;
    }

    .node.highlighted {
        background: #253e36;
        border-color: #4ec9b0;
        transform: scale(1.1);
    }

    .node.swapping {
        background: #3d2c2c;
        border-color: #c94e4e;
        animation: pulse 0.5s infinite;
    }

    .arrow {
        margin: 0 1.5rem;
        color: #666;
        font-size: 1.2rem;
        transform: translateY(-10px);
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
</style> 