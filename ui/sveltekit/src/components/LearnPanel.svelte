<script lang="ts">
  import type { Algorithm } from '@core/algorithms';
  import type { DataStructure } from '@core/data_structures';
  import { onMount } from 'svelte';
  
  export let content: Algorithm | DataStructure;
  export let type: 'algorithm' | 'dataStructure';
  export let height: string = '100%';
  
  // Convert markdown to HTML (basic implementation)
  // In a real app, use a proper markdown library
  function markdownToHtml(markdown: string): string {
    if (!markdown) return '';
    
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="language-$1"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      // Lists
      .replace(/^\s*-\s(.*$)/gim, '<li>$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Paragraphs
      .replace(/^\s*(\n)?([^\n]+)/gim, '<p>$2</p>');
    
    // Wrap lists in <ul>
    html = html.replace(/<li>([\s\S]*?)<\/li>/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\s*<ul>/gim, '');
    
    return html;
  }
  
  // Get appropriate content based on the type
  $: content_html = type === 'algorithm' 
    ? generateAlgorithmContent(content as Algorithm)
    : generateDataStructureContent(content as DataStructure);
  
  function generateAlgorithmContent(algorithm: Algorithm): string {
    if (!algorithm) return '';
    
    return `
      <h1>${algorithm.name}</h1>
      <p>${algorithm.description}</p>
      
      <h2>Complexity Analysis</h2>
      <div class="complexity-box">
        <div>
          <span class="label">Time Complexity:</span>
          <span class="value">${algorithm.complexity.time}</span>
        </div>
        <div>
          <span class="label">Space Complexity:</span>
          <span class="value">${algorithm.complexity.space}</span>
        </div>
      </div>
      
      <h2>Key Concepts</h2>
      <p>This algorithm works by processing nodes or elements in a specific order to efficiently solve problems.</p>
      
      <h2>Step-by-Step Explanation</h2>
      <ol>
        <li>Initialize data structures and variables</li>
        <li>Process elements in a specific order</li>
        <li>Update state based on algorithm rules</li>
        <li>Continue until termination condition is met</li>
        <li>Return the final result</li>
      </ol>
      
      <h2>Applications</h2>
      <ul>
        <li>Pathfinding in networks and graphs</li>
        <li>Solving optimization problems</li>
        <li>Data processing and analysis</li>
      </ul>
    `;
  }
  
  function generateDataStructureContent(dataStructure: DataStructure): string {
    if (!dataStructure) return '';
    
    // Generate operations table
    let operationsHtml = '<table class="operations-table"><thead><tr><th>Operation</th><th>Time Complexity</th><th>Description</th></tr></thead><tbody>';
    
    for (const [opName, operation] of Object.entries(dataStructure.operations)) {
      operationsHtml += `
        <tr>
          <td class="operation-name">${opName}</td>
          <td class="operation-complexity">${operation.complexity.time}</td>
          <td class="operation-description">${operation.description}</td>
        </tr>
      `;
    }
    
    operationsHtml += '</tbody></table>';
    
    return `
      <h1>${dataStructure.name}</h1>
      <p>${dataStructure.description}</p>
      
      <h2>Key Operations</h2>
      ${operationsHtml}
      
      <h2>Implementation Details</h2>
      <p>This data structure can be implemented using various approaches, each with different trade-offs.</p>
      
      <h2>Common Use Cases</h2>
      <ul>
        <li>Storing and retrieving data efficiently</li>
        <li>Managing relationships between data elements</li>
        <li>Optimizing specific types of operations</li>
      </ul>
    `;
  }
</script>

<div 
  class="learn-panel"
  style:height={height}
>
  <div class="learn-content">
    {@html content_html}
  </div>
</div>

<style>
  .learn-panel {
    overflow-y: auto;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 1rem;
    background-color: white;
    width: 100%;
  }
  
  .learn-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .learn-content :global(h1) {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1e293b;
  }
  
  .learn-content :global(h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #334155;
  }
  
  .learn-content :global(h3) {
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    color: #475569;
  }
  
  .learn-content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #334155;
  }
  
  .learn-content :global(ul), .learn-content :global(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .learn-content :global(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .learn-content :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    background-color: #f1f5f9;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }
  
  .learn-content :global(pre) {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin-bottom: 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9rem;
  }
  
  .learn-content :global(.complexity-box) {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .learn-content :global(.complexity-box .label) {
    font-weight: 500;
    color: #64748b;
    margin-right: 0.5rem;
  }
  
  .learn-content :global(.complexity-box .value) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    background-color: #f1f5f9;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
  }
  
  .learn-content :global(.operations-table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  .learn-content :global(.operations-table th) {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 2px solid #e2e8f0;
    font-weight: 600;
    color: #475569;
  }
  
  .learn-content :global(.operations-table td) {
    padding: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .learn-content :global(.operation-name) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 500;
  }
  
  .learn-content :global(.operation-complexity) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    color: #6366f1;
  }
</style>
