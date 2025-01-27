<script lang="ts">
    import CodeEditor from './CodeEditor.svelte';
    import { algorithmImplementations } from '$lib/data/algorithmImplementations';
    import type { AlgorithmImplementations, Activity, VisualizationStep } from '$lib/types/Visualization';
    
    export let algorithmId: string;
    export let currentStep: number;
    export let highlightedLines: number[] = [];
    export let currentActivity: Activity | null = null;
    export let steps: VisualizationStep[] = [];

    let selectedLanguage = 'JavaScript';
    const languages = ['JavaScript'];
    const languageKeys = ['javascript'];

    $: implementation = (algorithmImplementations as AlgorithmImplementations)[algorithmId]?.[languageKeys[languages.indexOf(selectedLanguage)]];
    $: code = currentActivity?.code ?? implementation?.code ?? '';

    $: {
        if (steps[currentStep]?.type === 'comparison') {
            highlightedLines = [6, 7];
        } else if (steps[currentStep]?.type === 'swap') {
            highlightedLines = [8, 9];
        } else if (currentActivity?.highlightSteps?.[currentStep]) {
            highlightedLines = currentActivity.highlightSteps[currentStep].lines;
        } else {
            highlightedLines = [];
        }
    }
</script>

<div class="code-panel">
    {#if currentActivity}
        <div class="activity-header">
            <h3>{currentActivity.title}</h3>
            <span class="activity-type">{currentActivity.type}</span>
            <p class="activity-description">{currentActivity.description}</p>
        </div>
    {/if}
    
    <div class="panel-header">
        <div class="language-selector">
            <span>Language:</span>
            <select bind:value={selectedLanguage}>
                {#each languages as lang}
                    <option value={lang}>{lang}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="editor-container">
        <CodeEditor 
            {code}
            language={languageKeys[languages.indexOf(selectedLanguage)].toLowerCase()}
            {highlightedLines}
            readOnly={true}
            theme="vs-dark"
        />
    </div>
</div>

<style>
    .code-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #1e1e1e;
    }

    .activity-header {
        padding: 1rem;
        background: #252525;
        border-bottom: 1px solid #333;
    }

    .activity-header h3 {
        margin: 0 0 0.5rem 0;
        color: #4ec9b0;
    }

    .activity-type {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        background: #333;
        border-radius: 4px;
        color: #4ec9b0;
    }

    .activity-description {
        margin: 0.5rem 0 0 0;
        color: #888;
        font-size: 0.9rem;
    }

    .panel-header {
        padding: 0.5rem;
        border-bottom: 1px solid #333;
        background: #252525;
    }

    .language-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    span {
        color: #888;
        font-size: 0.9rem;
    }

    select {
        padding: 0.4rem;
        border-radius: 4px;
        background: #2d2d2d;
        color: white;
        border: 1px solid #444;
        font-size: 0.9rem;
        cursor: pointer;
    }

    .editor-container {
        flex: 1;
        overflow: hidden;
        position: relative;
    }
</style> 