<script lang="ts">
    import { onMount } from 'svelte';

    export let data: any[];
    export let highlights: number[] = [];

    interface TreeNodePosition {
        x: number;
        y: number;
        value: any;
        highlighted: boolean;
    }

    let nodes: TreeNodePosition[] = [];
    let lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    let container: HTMLElement;

    const NODE_RADIUS = 25;
    const LEVEL_HEIGHT = 80;
    const MIN_NODE_SPACING = 60;

    function calculatePositions() {
        if (!container) return;

        const width = container.clientWidth;
        nodes = [];
        lines = [];

        // Calculate positions for each level
        let level = 0;
        let levelStart = 0;
        let nodesInLevel = 1;

        while (levelStart < data.length) {
            const levelWidth = width;
            const spacing = Math.max(MIN_NODE_SPACING, levelWidth / (nodesInLevel + 1));

            for (let i = 0; i < nodesInLevel && levelStart + i < data.length; i++) {
                if (data[levelStart + i] !== null) {
                    const x = (i + 1) * spacing;
                    const y = (level + 1) * LEVEL_HEIGHT;
                    
                    nodes.push({
                        x,
                        y,
                        value: data[levelStart + i],
                        highlighted: highlights.includes(levelStart + i)
                    });

                    // Add lines to children
                    const leftChildIndex = 2 * (levelStart + i) + 1;
                    const rightChildIndex = 2 * (levelStart + i) + 2;

                    if (leftChildIndex < data.length && data[leftChildIndex] !== null) {
                        const childX = ((i * 2 + 1) + 1) * (spacing / 2);
                        const childY = (level + 2) * LEVEL_HEIGHT;
                        lines.push({ x1: x, y1: y, x2: childX, y2: childY });
                    }

                    if (rightChildIndex < data.length && data[rightChildIndex] !== null) {
                        const childX = ((i * 2 + 2) + 1) * (spacing / 2);
                        const childY = (level + 2) * LEVEL_HEIGHT;
                        lines.push({ x1: x, y1: y, x2: childX, y2: childY });
                    }
                }
            }

            levelStart += nodesInLevel;
            nodesInLevel *= 2;
            level++;
        }
    }

    onMount(() => {
        calculatePositions();
        window.addEventListener('resize', calculatePositions);
        return () => window.removeEventListener('resize', calculatePositions);
    });

    $: if (data) calculatePositions();
</script>

<div class="tree-container" bind:this={container}>
    <svg width="100%" height="100%">
        {#each lines as line}
            <line 
                x1={line.x1} 
                y1={line.y1} 
                x2={line.x2} 
                y2={line.y2} 
                class="tree-edge"
            />
        {/each}
        {#each nodes as node}
            <g transform="translate({node.x}, {node.y})">
                <circle 
                    r={NODE_RADIUS}
                    class="tree-node"
                    class:highlighted={node.highlighted}
                />
                <text 
                    class="node-text"
                    dy=".3em"
                    text-anchor="middle"
                >
                    {node.value}
                </text>
            </g>
        {/each}
    </svg>
</div>

<style>
    .tree-container {
        width: 100%;
        height: 400px;
        overflow: auto;
    }

    .tree-node {
        fill: #4a4a4a;
        stroke: #333;
        stroke-width: 2;
        transition: all 0.3s ease;
    }

    .tree-node.highlighted {
        fill: #2196f3;
        transform: scale(1.1);
    }

    .tree-edge {
        stroke: #666;
        stroke-width: 2;
    }

    .node-text {
        fill: white;
        font-size: 14px;
        user-select: none;
    }
</style> 