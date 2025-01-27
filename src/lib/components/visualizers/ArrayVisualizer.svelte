<script lang="ts">
    export let data: number[] = [];
    export let highlights: number[] = [];

    $: maxValue = Math.max(...data, 1);
    $: barWidth = 100 / data.length;
</script>

<div class="array-visualizer">
    <div class="bars-container">
        {#each data as value, i}
            <div
                class="bar"
                class:highlighted={highlights.includes(i)}
                style="
                    height: {(value / maxValue) * 100}%;
                    width: {barWidth}%;
                "
            >
                <span class="value">{value}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .array-visualizer {
        width: 100%;
        height: 100%;
        padding: 1rem;
        background: #1e1e1e;
        display: flex;
        flex-direction: column;
    }

    .bars-container {
        flex: 1;
        display: flex;
        align-items: flex-end;
        gap: 2px;
        padding: 1rem;
    }

    .bar {
        background: #4a4a4a;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 0.5rem;
    }

    .bar.highlighted {
        background: #4ec9b0;
    }

    .value {
        color: white;
        font-size: 0.8rem;
    }
</style> 