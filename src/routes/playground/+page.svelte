<script lang="ts">
    import { dataStructureCategories } from '$lib/data/dataStructureCategories';
    import { algorithmCategories } from '$lib/data/algorithmCategories';
    
    let selectedDataStructure = dataStructureCategories[0].structures[0];
    let selectedAlgorithm = algorithmCategories[0].algorithms[0];
</script>

<div class="page">
    <h1>Algorithm Playground</h1>
    <p>Experiment with combining data structures and algorithms to build complex systems.</p>

    <div class="playground-container">
        <div class="sidebar">
            <div class="section">
                <h3>Data Structures</h3>
                {#each dataStructureCategories as category}
                    <div class="category">
                        <h4>{category.name}</h4>
                        {#each category.structures as structure}
                            <button 
                                class:selected={selectedDataStructure === structure}
                                on:click={() => selectedDataStructure = structure}
                            >
                                {structure.name}
                            </button>
                        {/each}
                    </div>
                {/each}
            </div>

            <div class="section">
                <h3>Algorithms</h3>
                {#each algorithmCategories as category}
                    <div class="category">
                        <h4>{category.name}</h4>
                        {#each category.algorithms as algorithm}
                            <button 
                                class:selected={selectedAlgorithm === algorithm}
                                on:click={() => selectedAlgorithm = algorithm}
                            >
                                {algorithm.name}
                            </button>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>

        <div class="workspace">
            <!-- Add playground visualization here -->
            <div class="placeholder">
                Select a data structure and algorithm to begin experimenting
            </div>
        </div>
    </div>
</div>

<style>
    .playground-container {
        display: flex;
        gap: 2rem;
        height: calc(100vh - 200px);
    }

    .sidebar {
        width: 250px;
        background: #2d2d2d;
        border-radius: 8px;
        padding: 1rem;
        overflow-y: auto;
    }

    .section {
        margin-bottom: 2rem;
    }

    .category {
        margin-bottom: 1rem;
    }

    .workspace {
        flex: 1;
        background: #2d2d2d;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button {
        display: block;
        width: 100%;
        padding: 0.5rem;
        margin: 0.25rem 0;
        background: transparent;
        border: 1px solid #444;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        text-align: left;
    }

    button:hover {
        background: #3d3d3d;
    }

    button.selected {
        background: #4ec9b0;
        color: #1e1e1e;
    }

    .placeholder {
        color: #666;
        text-align: center;
    }
</style>