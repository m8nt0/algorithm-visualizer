<script lang="ts">
    import { algorithmCategories } from '$lib/data/algorithmCategories';
    import AlgorithmVisualizer from '$lib/components/visualizers/AlgorithmVisualizer.svelte';
    import CodePanel from '$lib/components/CodeEditor/CodePanel.svelte';
    import SplitPane from '$lib/components/Layout/SplitPane.svelte';
    import { algorithmLessons } from '$lib/data/alg';
    import { slide } from 'svelte/transition';
    
    let selectedCategory = algorithmCategories[0];
    let selectedAlgorithm = selectedCategory.algorithms[0];
    let currentStep = 0;
    let highlightedLines: number[] = [];
    let activeTab: 'explanation' | 'code' = 'explanation';
    let activeSection: string = 'intro';

    $: currentLesson = algorithmLessons[selectedAlgorithm.id];
    $: currentSection = currentLesson?.sections.find(s => s.id === activeSection);

    function startActivity(section: any) {
        if (section.activity.type === 'visualization' || section.activity.type === 'interactive') {
            activeTab = 'code';
        }
    }
</script>

<div class="page">
    <div class="header">
        <div class="algorithm-selector">
            <div class="selector-group">
                <label>Category:</label>
                <select bind:value={selectedCategory}>
                    {#each algorithmCategories as category}
                        <option value={category}>{category.name}</option>
                    {/each}
                </select>
            </div>

            <div class="selector-group">
                <label>Algorithm:</label>
                <select bind:value={selectedAlgorithm}>
                    {#each selectedCategory.algorithms as algorithm}
                        <option value={algorithm}>{algorithm.name}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>

    <div class="main-content">
        <SplitPane>
            <div slot="left" class="left-panel">
                <div class="tabs">
                    <button 
                        class:active={activeTab === 'explanation'}
                        on:click={() => activeTab = 'explanation'}
                    >
                        Learn
                    </button>
                    <button 
                        class:active={activeTab === 'code'}
                        on:click={() => activeTab = 'code'}
                    >
                        Code Editor
                    </button>
                </div>

                {#if activeTab === 'explanation' && currentLesson}
                    <div class="explanation-panel" transition:slide>
                        <div class="sections-sidebar">
                            {#each currentLesson.sections as section}
                                <button 
                                    class:active={activeSection === section.id}
                                    on:click={() => activeSection = section.id}
                                >
                                    <div class="section-header">
                                        <span>{section.title}</span>
                                        <span class="level-badge" class:beginner={section.level === 'Beginner'}
                                              class:intermediate={section.level === 'Intermediate'}
                                              class:hard={section.level === 'Hard'}>
                                            {section.level}
                                        </span>
                                    </div>
                                </button>
                            {/each}
                        </div>

                        {#if currentSection}
                            <div class="section-content" transition:slide>
                                <div class="content-text">
                                    {@html currentSection.content}
                                </div>

                                {#if currentSection.pseudocode}
                                    <div class="pseudocode">
                                        <h3>Pseudocode:</h3>
                                        <ul>
                                            {#each currentSection.pseudocode as step}
                                                <li>{step}</li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}

                                {#if currentSection.activity}
                                    <div class="activity-card">
                                        <div class="activity-content">
                                            <div class="activity-header">
                                                <h3>Interactive Activity</h3>
                                                <span class="activity-type">{currentSection.activity.type}</span>
                                            </div>
                                            <p>{currentSection.activity.description}</p>
                                            <button 
                                                class="try-button"
                                                on:click={() => startActivity(currentSection)}
                                            >
                                                Try it out →
                                            </button>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>
                {:else if activeTab === 'code'}
                    <div class="code-panel" transition:slide>
                        <CodePanel 
                            algorithmId={selectedAlgorithm.id}
                            {currentStep}
                            {highlightedLines}
                            currentActivity={currentSection?.activity}
                        />
                    </div>
                {/if}
            </div>

            <div slot="right" class="right-panel">
                <div class="visualizer-container">
                    <AlgorithmVisualizer 
                        algorithm={selectedAlgorithm}
                        bind:currentStep
                        bind:highlightedLines
                        currentActivity={currentSection?.activity}
                    />
                </div>
            </div>
        </SplitPane>
    </div>
</div>

<style>
    .page {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .header {
        padding: 1rem;
        background: #252525;
        border-bottom: 1px solid #333;
    }

    .algorithm-selector {
        display: flex;
        gap: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .selector-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }

    label {
        color: #888;
        font-size: 0.9rem;
    }

    select {
        flex: 1;
        padding: 0.5rem;
        background: #333;
        border: 1px solid #444;
        border-radius: 4px;
        color: white;
        font-size: 0.9rem;
    }

    .main-content {
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }

    .left-panel, .right-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .code-panel {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .right-panel {
        background: #1e1e1e;
    }

    .visualizer-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #252525;
        border-radius: 8px;
        overflow: hidden;
    }

    .tabs {
        display: flex;
        gap: 1px;
        background: #333;
        padding: 2px;
        border-radius: 6px;
        margin-bottom: 1rem;
    }

    .tabs button {
        flex: 1;
        padding: 0.5rem 1rem;
        background: transparent;
        border: none;
        color: #888;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tabs button.active {
        background: #4ec9b0;
        color: #1e1e1e;
    }

    .explanation-panel {
        display: flex;
        gap: 2rem;
        height: 100%;
        overflow: hidden;
    }

    .sections-sidebar {
        width: 250px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-right: 1rem;
        border-right: 1px solid #333;
    }

    .sections-sidebar button {
        width: 100%;
        padding: 1rem;
        background: #2d2d2d;
        border: none;
        border-radius: 6px;
        color: #fff;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
    }

    .sections-sidebar button.active {
        background: #253e36;
        border-left: 3px solid #4ec9b0;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .level-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        background: #333;
    }

    .level-badge.beginner { background: #2c4a3e; color: #4ec9b0; }
    .level-badge.intermediate { background: #4a3e2c; color: #c9b04e; }
    .level-badge.hard { background: #4a2c2c; color: #c94e4e; }

    .section-content {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }

    .content-text {
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .pseudocode {
        background: #2d2d2d;
        padding: 1.5rem;
        border-radius: 6px;
        margin: 2rem 0;
        font-family: monospace;
    }

    .activity-card {
        background: #253e36;
        border-radius: 8px;
        margin-top: 2rem;
        overflow: hidden;
    }

    .activity-content {
        padding: 1.5rem;
    }

    .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .activity-type {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
        background: #4ec9b0;
        color: #1e1e1e;
        border-radius: 4px;
        text-transform: capitalize;
    }

    .try-button {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: #4ec9b0;
        color: #1e1e1e;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
    }

    .try-button:hover {
        background: #3da892;
    }

    :global(.split-container) {
        height: 100% !important;
    }

    :global(.divider) {
        background: #333 !important;
        width: 4px !important;
    }

    :global(.divider:hover) {
        background: #4ec9b0 !important;
    }

    :global(.split-container > *) {
        padding: 1rem;
    }
</style>