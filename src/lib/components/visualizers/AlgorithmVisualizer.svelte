<script lang="ts">
    import { onMount } from 'svelte';
    import type { Algorithm, Activity, VisualizationStep, VisualizationType } from '$lib/types/Visualization';
    import ArrayVisualizer from './ArrayVisualizer.svelte';
    import LinkedListVisualizer from './LinkedListVisualizer.svelte';
    import StackVisualizer from './StackVisualizer.svelte';
    import QueueVisualizer from './QueueVisualizer.svelte';
    import { generateSortingSteps } from '$lib/algorithms/sorting';

    export let algorithm: Algorithm;
    export let currentStep = 0;
    export let highlightedLines: number[] = [];
    export let currentActivity: Activity | null = null;

    let steps: VisualizationStep[] = [];
    let isPlaying = false;
    let playbackSpeed = 500;
    let playbackInterval: ReturnType<typeof setInterval>;

    let selectedStructure: VisualizationType = 'array';
    let initialData = [5, 3, 8, 4, 2, 1, 7, 6];
    
    $: supportedStructures = currentActivity?.supportedStructures || [algorithm.visualizationType];
    $: currentData = currentActivity?.data?.[selectedStructure] || initialData;
    $: code = currentActivity?.code || '';
    $: highlightSteps = currentActivity?.highlightSteps || [];

    $: {
        if (currentActivity) {
            steps = generateStepsForActivity(currentActivity);
            currentStep = 0;
        } else {
            steps = generateSortingSteps(initialData, algorithm.id);
        }
    }

    function generateStepsForActivity(activity: Activity): VisualizationStep[] {
        if (!activity.data) return [];
        
        const data = activity.data[selectedStructure as keyof typeof activity.data];
        if (!Array.isArray(data)) return [];

        switch (activity.type) {
            case 'visualization':
            case 'step-by-step':
                return generateSortingSteps(data, algorithm.id);
            case 'interactive':
            case 'practice':
            case 'challenge':
                return generateSortingSteps(data, algorithm.id);
            default:
                return [];
        }
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
        } else {
            pause();
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
        }
    }

    function play() {
        if (currentStep >= steps.length - 1) {
            currentStep = 0;
        }
        isPlaying = true;
        playbackInterval = setInterval(nextStep, playbackSpeed);
    }

    function pause() {
        isPlaying = false;
        clearInterval(playbackInterval);
    }

    onMount(() => {
        return () => {
            clearInterval(playbackInterval);
        };
    });

    $: {
        if (currentActivity?.highlightSteps) {
            const highlightStep = currentActivity.highlightSteps[currentStep];
            if (highlightStep) {
                highlightedLines = highlightStep.lines;
            }
        }
    }

    let autoPlayEnabled = false;
    let showExplanation = false;
    let showStepDetails = true;
    let speedPresets = [
        { label: '0.25x', value: 2000 },
        { label: '0.5x', value: 1000 },
        { label: '1x', value: 500 },
        { label: '2x', value: 250 },
        { label: '4x', value: 125 }
    ];

    let arraySize = 8;
    let minValue = 1;
    let maxValue = 100;
    let showPerformanceMetrics = true;
    let comparisons = 0;
    let swaps = 0;
    let executionTime = 0;
    let startTime: number;

    function randomizeData() {
        const newData = Array.from({ length: arraySize }, () => 
            Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        );

        if (currentActivity) {
            currentActivity.data = supportedStructures.reduce((acc, structure) => ({
                ...acc,
                [structure]: [...newData]
            }), {});
        } else {
            initialData = newData;
        }
        resetVisualization();
    }

    function updateDataSize() {
        const newData = Array.from({ length: arraySize }, (_, i) => {
            if (currentData && i < currentData.length) {
                return currentData[i];
            }
            return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        });

        if (currentActivity) {
            currentActivity.data = supportedStructures.reduce((acc, structure) => ({
                ...acc,
                [structure]: [...newData]
            }), {});
        } else {
            initialData = newData;
        }
        resetVisualization();
    }

    $: canModifyData = !isPlaying && (currentActivity?.type === 'visualization' || !currentActivity);

    function resetVisualization() {
        currentStep = 0;
        comparisons = 0;
        swaps = 0;
        executionTime = 0;
        if (currentActivity) {
            steps = generateStepsForActivity(currentActivity);
        } else {
            steps = generateSortingSteps(initialData, algorithm.id);
        }
        startTime = performance.now();
    }

    $: {
        if (steps[currentStep]?.type === 'comparison') {
            comparisons++;
        } else if (steps[currentStep]?.type === 'swap') {
            swaps++;
        }
        if (currentStep === steps.length - 1) {
            executionTime = performance.now() - startTime;
        }
    }
</script>

<div class="visualizer">
    {#if canModifyData}
        <div class="data-controls">
            <div class="select-group">
                <label for="structure-select">View as:</label>
                <select 
                    id="structure-select"
                    bind:value={selectedStructure}
                >
                    {#each supportedStructures as structure}
                        <option value={structure}>
                            {structure.charAt(0).toUpperCase() + structure.slice(1)}
                        </option>
                    {/each}
                </select>
            </div>
            <div class="size-control">
                <label for="array-size">Size:</label>
                <input 
                    id="array-size"
                    type="number" 
                    min="4" 
                    max="50" 
                    bind:value={arraySize}
                    on:change={updateDataSize}
                    disabled={!canModifyData}
                />
                <span class="value">{arraySize}</span>
            </div>
            <div class="value-range">
                <!-- <div class="range-control">
                    <label for="min-value">Min:</label>
                    <input 
                        id="min-value"
                        type="number" 
                        bind:value={minValue}
                        min="0"
                        max={maxValue - 1}
                        on:change={randomizeData}
                        disabled={!canModifyData}
                    />
                </div>
                <div class="range-control">
                    <label for="max-value">Max:</label>
                    <input 
                        id="max-value"
                        type="number" 
                        bind:value={maxValue}
                        min={minValue + 1}
                        max="999"
                        on:change={randomizeData}
                        disabled={!canModifyData}
                    />
                </div> -->
            </div>
            <button 
                class="randomize-btn" 
                on:click={randomizeData}
                disabled={!canModifyData}
            >
                🎲 Randomize
            </button>
        </div>
    {/if}

    <div class="visualization-area">
        {#if selectedStructure === 'array'}
            <ArrayVisualizer 
                data={steps[currentStep]?.data || currentData} 
                highlights={steps[currentStep]?.highlights || []}
            />
        {:else if selectedStructure === 'linkedlist'}
            <LinkedListVisualizer 
                data={steps[currentStep]?.data || currentData}
                highlights={steps[currentStep]?.highlights || []}
            />
        {:else if selectedStructure === 'stack'}
            <StackVisualizer 
                data={steps[currentStep]?.data || currentData}
                highlights={steps[currentStep]?.highlights || []}
            />
        {:else if selectedStructure === 'queue'}
            <QueueVisualizer 
                data={steps[currentStep]?.data || currentData}
                highlights={steps[currentStep]?.highlights || []}
            />
        {/if}
        
        {#if showPerformanceMetrics}
            <div class="metrics">
                <div class="metric">
                    <span class="label">Comparisons:</span>
                    <span class="value">{comparisons}</span>
                </div>
                <div class="metric">
                    <span class="label">Swaps:</span>
                    <span class="value">{swaps}</span>
                </div>
                <div class="metric">
                    <span class="label">Time:</span>
                    <span class="value">{executionTime.toFixed(2)}ms</span>
                </div>
            </div>
        {/if}

        <div class="step-explanation" class:expanded={showExplanation}>
            <button class="toggle-explanation" on:click={() => showExplanation = !showExplanation}>
                {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            
            {#if showExplanation}
                <div class="explanation-content">
                    <div class="current-step">
                        <h4>Current Operation</h4>
                        <p>{steps[currentStep]?.description}</p>
                    </div>
                    
                    <div class="step-type">
                        <span class="label">Type:</span>
                        <span class="value {steps[currentStep]?.type || 'info'}">
                            {steps[currentStep]?.type || 'info'}
                        </span>
                    </div>

                    {#if steps[currentStep]?.type === 'comparison'}
                        <div class="comparison-info">
                            <span>Comparing elements:</span>
                            <div class="elements">
                                {#each steps[currentStep]?.highlights || [] as index}
                                    <span class="element">{steps[currentStep]?.data[index]}</span>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    {#if showPerformanceMetrics}
                        <div class="metrics">
                            <div class="metric">
                                <span>Comparisons:</span>
                                <span class="value">{comparisons}</span>
                            </div>
                            <div class="metric">
                                <span>Swaps:</span>
                                <span class="value">{swaps}</span>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    <div class="controls">
        <div class="step-details" class:expanded={showStepDetails}>
            <div class="step-header">
                <h3>Step {currentStep + 1} of {steps.length}</h3>
                <button class="toggle-details" on:click={() => showStepDetails = !showStepDetails}>
                    {showStepDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </div>
            
            {#if showStepDetails}
                <div class="step-description">
                    {steps[currentStep]?.description}
                </div>
                <div class="step-progress">
                    <div class="progress-bar" style="width: {(currentStep + 1) / steps.length * 100}%"></div>
                </div>
            {/if}
        </div>

        <div class="playback-controls">
            <button on:click={() => currentStep = 0} disabled={currentStep === 0}>
                ⏮️ Reset
            </button>
            <button on:click={prevStep} disabled={currentStep === 0}>
                ⏪ Previous
            </button>
            <button on:click={isPlaying ? pause : play} class:playing={isPlaying}>
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button on:click={nextStep} disabled={currentStep === steps.length - 1}>
                ⏩ Next
            </button>
            <button on:click={() => currentStep = steps.length - 1} disabled={currentStep === steps.length - 1}>
                ⏭️ End
            </button>
        </div>

        <div class="speed-control">
            <label for="speed-select">Speed:</label>
            <select id="speed-select" bind:value={playbackSpeed}>
                {#each speedPresets as preset}
                    <option value={preset.value}>{preset.label}</option>
                {/each}
            </select>
            <label class="auto-play">
                <input type="checkbox" bind:checked={autoPlayEnabled}>
                Auto-play
            </label>
        </div>
    </div>
</div>

<style>
    .visualizer {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #1e1e1e;
    }

    .visualization-area {
        flex: 1;
        min-height: 0;
        background: #252525;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .controls {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        background: #2d2d2d;
        border-radius: px;
    }

    .step-info {
        text-align: center;
        color: #4ec9b0;
    }

    .buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        background: #333;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover:not(:disabled) {
        background: #444;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .speed-control {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        color: #888;
    }

    input[type="range"] {
        width: 200px;
    }

    .structure-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: #2d2d2d;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .structure-selector label {
        color: #888;
        font-size: 0.9rem;
    }

    .structure-selector select {
        padding: 0.4rem;
        background: #333;
        color: white;
        border: 1px solid #444;
        border-radius: 4px;
        cursor: pointer;
    }

    .step-details {
        background: #2d2d2d;
        transition: all 0.3s ease;
    }

    .step-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .step-description {
        color: #4ec9b0;
        font-size: 1.1rem;
        margin: 0.5rem 0;
    }

    .step-progress {
        height: 4px;
        background: #333;
        border-radius: 2px;
    }

    .progress-bar {
        height: 100%;
        background: #4ec9b0;
        border-radius: 2px;
        transition: width 0.3s ease;
    }

    .playback-controls {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
    }

    .playback-controls button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: #333;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .playback-controls button:hover:not(:disabled) {
        background: #444;
    }

    .playback-controls button.playing {
        background: #4ec9b0;
        color: #1e1e1e;
    }

    .speed-control {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .auto-play {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #888;
    }

    .data-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        background: #2d2d2d;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .size-control {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
    }

    .size-control label {
        color: #888;
        font-size: 0.9rem;
        min-width: 80px;
    }

    .size-control input[type="range"] {
        flex: 1;
        max-width: 200px;
    }

    .randomize-btn {
        padding: 0.5rem 1rem;
        background: #4ec9b0;
        color: #1e1e1e;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .randomize-btn:hover {
        background: #3da892;
    }

    .metrics {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(45, 45, 45, 0.9);
        padding: 0.75rem;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .metric {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .metric .label {
        color: #888;
        font-size: 0.9rem;
    }

    .metric .value {
        color: #4ec9b0;
        font-weight: 500;
        font-family: monospace;
    }



    .step-explanation.expanded {
        transform: translateY(0);
    }

    .toggle-explanation {
        position: absolute;
        top: -2rem;
        right: 1rem;
        background: #4ec9b0;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px 4px 0 0;
        cursor: pointer;
    }

    .explanation-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .step-type .value {
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    .step-type .value.comparison { background: #253e36; }
    .step-type .value.swap { background: #3d2c2c; }
    .step-type .value.info { background: #2d2d2d; }

    .comparison-info .elements {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }

    .comparison-info .element {
        background: #253e36;
        padding: 0.5rem;
        border-radius: 4px;
        min-width: 2rem;
        text-align: center;
    }

    .value-range {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .range-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .range-control input[type="number"] {
        width: 60px;
        padding: 0.3rem;
        background: #333;
        border: 1px solid #444;
        border-radius: 4px;
        color: white;
    }

    .range-control label {
        color: #888;
        font-size: 0.9rem;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .randomize-btn:disabled {
        background: #666;
    }
</style> 