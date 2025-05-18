<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import type { SupportedLanguage } from '@core/shared/types';
  
  export let code: string;
  export let language: SupportedLanguage;
  export let highlightedLines: number[] = [];
  export let readOnly: boolean = false;
  export let height: string = '100%';
  
  const dispatch = createEventDispatcher<{
    change: string;
  }>();
  
  let editor: any;
  let monaco: any;
  let editorContainer: HTMLElement;
  
  onMount(async () => {
    // Load Monaco Editor only in the browser
    if (typeof window !== 'undefined') {
      try {
        const monacoModule = await import('monaco-editor');
        setupMonacoEditor(monacoModule.default || monacoModule);
      } catch (error) {
        console.error('Failed to load Monaco editor:', error);
      }
    }
  });
  
  function setupMonacoEditor(monacoInstance: any) {
    monaco = monacoInstance;
    
    // Create editor
    editor = monaco.editor.create(editorContainer, {
      value: code,
      language: mapLanguage(language),
      theme: 'vs-dark',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      renderLineHighlight: 'all',
      readOnly,
    });
    
    // Listen for changes
    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      if (code !== newValue) {
        code = newValue;
        dispatch('change', newValue);
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      editor.layout();
    });
    
    return () => {
      editor.dispose();
    };
  }
  
  // Map language to Monaco language identifier
  function mapLanguage(lang: SupportedLanguage): string {
    const mapping: Record<SupportedLanguage, string> = {
      typescript: 'typescript',
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
    };
    return mapping[lang] || 'typescript';
  }
  
  // Update editor content when code prop changes
  $: if (editor && code !== editor.getValue()) {
    editor.setValue(code);
  }
  
  // Update language when it changes
  $: if (editor && monaco && language) {
    monaco.editor.setModelLanguage(editor.getModel(), mapLanguage(language));
  }
  
  // Update highlighted lines
  $: if (editor && monaco && highlightedLines) {
    updateHighlightedLines();
  }
  
  function updateHighlightedLines() {
    if (!editor || !monaco) return;
    
    // Clear existing decorations
    const oldDecorations = editor.getModel().getAllDecorations()
      .filter((d: any) => d.options.className === 'highlighted-line')
      .map((d: any) => d.id);
      
    // Create new decorations for highlighted lines
    const newDecorations = highlightedLines.map(lineNumber => ({
      range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      options: {
        isWholeLine: true,
        className: 'highlighted-line',
        glyphMarginClassName: 'highlighted-glyph'
      }
    }));
    
    // Apply new decorations
    editor.deltaDecorations(oldDecorations, newDecorations);
  }
</script>

<div 
  class="code-editor" 
  bind:this={editorContainer}
  style:height={height}
></div>

<style>
  .code-editor {
    width: 100%;
    min-height: 100px;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  :global(.highlighted-line) {
    background-color: rgba(255, 165, 0, 0.2) !important;
    border-left: 2px solid orange !important;
  }
  
  :global(.highlighted-glyph) {
    background-color: orange;
    border-radius: 50%;
    margin-left: 5px;
    width: 8px !important;
    height: 8px !important;
  }
</style>
