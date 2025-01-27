<script lang="ts">
    import { onMount } from 'svelte';
    import type * as MonacoType from 'monaco-editor';
    
    export let code: string;
    export let language = 'javascript';
    export let readOnly = false;
    export let theme = 'vs-dark';
    export let highlightedLines: number[] = [];

    let editor: MonacoType.editor.IStandaloneCodeEditor | undefined;
    let container: HTMLDivElement;
    let decorations: string[] = [];
    let monaco: typeof MonacoType;
    let isLoading = true;

    onMount(() => {
        let cleanup: (() => void) | undefined;
        
        import('monaco-editor').then((module) => {
            monaco = module;
            if (container) {
                editor = monaco.editor.create(container, {
                    value: code,
                    language,
                    theme,
                    readOnly,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    automaticLayout: true
                });
                isLoading = false;
                cleanup = () => editor?.dispose();
            }
        }).catch((error) => {
            console.error('Failed to load monaco editor:', error);
            isLoading = false;
        });

        return () => cleanup?.();
    });

    $: if (editor && code) {
        const currentModel = editor.getModel();
        if (currentModel) {
            if (currentModel.getValue() !== code) {
                currentModel.setValue(code);
            }
        }
    }

    $: if (editor && monaco && highlightedLines) {
        updateHighlights();
    }

    function updateHighlights() {
        if (!editor || !monaco) return;
        
        const model = editor.getModel();
        if (!model) return;

        // Remove previous decorations
        decorations = editor.deltaDecorations(decorations, []);

        // Add new decorations
        decorations = editor.deltaDecorations([], highlightedLines.map(lineNumber => ({
            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            options: {
                isWholeLine: true,
                className: 'highlighted-line',
                linesDecorationsClassName: 'highlighted-line-gutter'
            }
        })));
    }
</script>

{#if isLoading}
    <div class="loading">Loading editor...</div>
{/if}
<div class="editor-container" class:hidden={isLoading} bind:this={container}></div>

<style>
    .editor-container {
        width: 100%;
        height: 100%;
    }

    .editor-container.hidden {
        display: none;
    }

    .loading {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        font-style: italic;
    }

    :global(.highlighted-line) {
        background: #2c4a3e !important;
        border-left: 2px solid #4ec9b0 !important;
    }

    :global(.highlighted-line-gutter) {
        background: #4ec9b0 !important;
        width: 4px !important;
    }
</style> 