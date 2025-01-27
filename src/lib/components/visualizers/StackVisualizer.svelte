<script lang="ts">
    export let data: any[];
    export let highlights: number[] = [];

    $: stackItems = [...data].reverse(); // Display top of stack at the top
</script>

<div class="stack-container">
    {#if stackItems.length === 0}
        <div class="empty-stack">Stack is empty</div>
    {:else}
        {#each stackItems as item, index}
            <div 
                class="stack-item"
                class:highlighted={highlights.includes(stackItems.length - 1 - index)}
            >
                {item}
            </div>
        {/each}
    {/if}
</div>

<style>
    .stack-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 2rem;
        min-height: 200px;
    }

    .stack-item {
        width: 120px;
        height: 40px;
        background: #4a4a4a;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .stack-item.highlighted {
        background: #2196f3;
        transform: scale(1.1);
    }

    .empty-stack {
        color: #666;
        font-style: italic;
    }
</style> 