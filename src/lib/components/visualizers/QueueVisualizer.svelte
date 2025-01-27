<script lang="ts">
    export let data: number[] = [];
    export let highlights: number[] = [];

    $: elements = data.map((value, index) => ({
        value,
        isHighlighted: highlights.includes(index),
        position: index
    }));
</script>

<div class="queue-container">
    <div class="queue-labels">
        <div class="front-label">Front</div>
        <div class="rear-label">Rear</div>
    </div>
    <div class="queue-elements">
        {#each elements as element}
            <div 
                class="element"
                class:highlighted={element.isHighlighted}
                style="--position: {element.position}"
            >
                {element.value}
            </div>
        {/each}
    </div>
</div>

<style>
    .queue-container {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 120px;
    }

    .queue-labels {
        display: flex;
        justify-content: space-between;
        color: #666;
        padding: 0 1rem;
    }

    .queue-elements {
        background: #2d2d2d;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        position: relative;
        min-height: 60px;
    }

    .element {
        width: 40px;
        height: 40px;
        background: #4a4a4a;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        transition: all 0.3s ease;
        position: relative;
    }

    .element.highlighted {
        background: #4ec9b0;
        transform: scale(1.1);
    }
</style> 