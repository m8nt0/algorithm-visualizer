<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { VisualElement } from '@core/shared/types';
  
  export let visualElements: VisualElement[] = [];
  export let width: number = 800;
  export let height: number = 400;
  export let interactiveMode: boolean = false;
  export let currentStep: number = 0;
  export let totalSteps: number = 0;
  export let stepDescription: string = '';
  
  const dispatch = createEventDispatcher<{
    elementClick: { type: string; id: string };
    nextStep: void;
    prevStep: void;
  }>();
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationFrame: number;
  let dragging = false;
  let zoomLevel = 1;
  let panOffset = { x: 0, y: 0 };
  let clickedElement: VisualElement | null = null;
  
  // Animation state
  let animationInProgress = false;
  let animationStartTime = 0;
  let animationDuration = 500; // ms
  let prevElements: VisualElement[] = [];
  
  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d')!;
      
      // Only access browser APIs after component is mounted
      if (typeof window !== 'undefined') {
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      } else {
        // Fallback for SSR
        canvas.width = width;
        canvas.height = height;
      }
      
      prevElements = [...visualElements];
      draw();
      
      if (interactiveMode) {
        setupInteractivity();
      }
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });
  
  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
  
  function setupInteractivity() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('click', handleClick);
  }
  
  function handleMouseDown(e: MouseEvent) {
    if (e.ctrlKey || e.metaKey) {
      dragging = true;
      canvas.style.cursor = 'grabbing';
    }
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (dragging) {
      panOffset.x += e.movementX;
      panOffset.y += e.movementY;
      draw();
    } else {
      // Hover effect
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoomLevel - panOffset.x;
      const y = (e.clientY - rect.top) / zoomLevel - panOffset.y;
      
      const hoveredElement = findElementAt(x, y);
      if (hoveredElement) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  }
  
  function handleMouseUp(e: MouseEvent) {
    dragging = false;
    canvas.style.cursor = 'default';
  }
  
  function handleWheel(e: WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      zoomLevel *= delta;
      zoomLevel = Math.max(0.1, Math.min(zoomLevel, 5)); // Limit zoom range
      draw();
    }
  }
  
  function handleClick(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel - panOffset.x;
    const y = (e.clientY - rect.top) / zoomLevel - panOffset.y;
    
    const element = findElementAt(x, y);
    if (element) {
      clickedElement = element;
      dispatch('elementClick', { 
        type: element.type, 
        id: element.text || '' 
      });
      draw();
    }
  }
  
  function findElementAt(x: number, y: number): VisualElement | null {
    // Check in reverse order to get top-most element
    for (let i = visualElements.length - 1; i >= 0; i--) {
      const element = visualElements[i];
      if (isPointInElement(x, y, element)) {
        return element;
      }
    }
    return null;
  }
  
  function isPointInElement(x: number, y: number, element: VisualElement): boolean {
    switch (element.type) {
      case 'circle':
        const size = element.size || 30;
        const distance = Math.sqrt(
          Math.pow(x - element.position.x, 2) + 
          Math.pow(y - element.position.y, 2)
        );
        return distance <= size;
      
      case 'rect':
        const rectSize = element.size || 40;
        return (
          x >= element.position.x - rectSize / 2 &&
          x <= element.position.x + rectSize / 2 &&
          y >= element.position.y - rectSize / 2 &&
          y <= element.position.y + rectSize / 2
        );
      
      case 'line':
        if (!element.endPosition) return false;
        // Check if point is near the line
        const lineWidth = 5;
        const dx = element.endPosition.x - element.position.x;
        const dy = element.endPosition.y - element.position.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const normalX = dx / length;
        const normalY = dy / length;
        
        // Calculate distance from point to line
        const dirX = x - element.position.x;
        const dirY = y - element.position.y;
        const dot = dirX * normalX + dirY * normalY;
        
        if (dot < 0 || dot > length) return false;
        
        const projX = element.position.x + normalX * dot;
        const projY = element.position.y + normalY * dot;
        const distToLine = Math.sqrt(
          Math.pow(x - projX, 2) + 
          Math.pow(y - projY, 2)
        );
        
        return distToLine <= lineWidth;
      
      default:
        return false;
    }
  }
  
  function draw() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Apply pan and zoom
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    
    // Draw background grid
    drawGrid();
    
    // Draw elements
    visualElements.forEach(element => {
      switch (element.type) {
        case 'circle':
          drawCircle(element);
          break;
        case 'rect':
          drawRect(element);
          break;
        case 'line':
          drawLine(element);
          break;
        case 'text':
          drawText(element);
          break;
      }
    });
    
    // Draw step information
    if (totalSteps > 0) {
      ctx.restore(); // Reset transform for UI elements
      drawStepInfo();
    } else {
      ctx.restore();
    }
  }
  
  function drawGrid() {
    const gridSize = 50;
    const offsetX = panOffset.x % gridSize;
    const offsetY = panOffset.y % gridSize;
    
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = offsetX; x < width / zoomLevel; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height / zoomLevel);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = offsetY; y < height / zoomLevel; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width / zoomLevel, y);
      ctx.stroke();
    }
  }
  
  function drawStepInfo() {
    // Draw progress bar
    const barWidth = width - 40;
    const barHeight = 10;
    const barX = 20;
    const barY = height - 30;
    
    // Background
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Progress
    const progress = currentStep / (totalSteps > 0 ? totalSteps - 1 : 1);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(barX, barY, barWidth * progress, barHeight);
    
    // Step counter
    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Step ${currentStep + 1} of ${totalSteps}`, width - 20, barY - 10);
    
    // Description
    if (stepDescription) {
      ctx.fillStyle = '#1e293b';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(stepDescription, 20, barY - 10);
    }
  }
  
  function drawCircle(element: VisualElement) {
    if (!ctx) return;
    
    const size = element.size || 30;
    
    // Draw highlight if this is the clicked element
    if (clickedElement === element) {
      ctx.beginPath();
      ctx.arc(element.position.x, element.position.y, size + 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fill();
    }
    
    // Draw node
    ctx.beginPath();
    ctx.arc(element.position.x, element.position.y, size, 0, Math.PI * 2);
    ctx.fillStyle = element.highlighted ? '#ef4444' : (element.color || '#2196f3');
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    if (element.text) {
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px sans-serif';
      ctx.fillText(element.text, element.position.x, element.position.y);
    }
  }
  
  function drawRect(element: VisualElement) {
    if (!ctx) return;
    
    const size = element.size || 40;
    
    // Draw highlight if this is the clicked element
    if (clickedElement === element) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fillRect(
        element.position.x - size / 2 - 5,
        element.position.y - size / 2 - 5,
        size + 10,
        size + 10
      );
    }
    
    // Draw rectangle
    ctx.fillStyle = element.highlighted ? '#ef4444' : (element.color || '#4caf50');
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.fillRect(
      element.position.x - size / 2,
      element.position.y - size / 2,
      size,
      size
    );
    ctx.strokeRect(
      element.position.x - size / 2,
      element.position.y - size / 2,
      size,
      size
    );
    
    // Draw text
    if (element.text) {
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px sans-serif';
      ctx.fillText(element.text, element.position.x, element.position.y);
    }
  }
  
  function drawLine(element: VisualElement) {
    if (!ctx || !element.endPosition) return;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(element.position.x, element.position.y);
    ctx.lineTo(element.endPosition.x, element.endPosition.y);
    ctx.strokeStyle = element.highlighted ? '#ef4444' : (element.color || '#757575');
    ctx.lineWidth = element === clickedElement ? 4 : 2;
    ctx.stroke();
    
    // Draw arrow
    const angle = Math.atan2(
      element.endPosition.y - element.position.y,
      element.endPosition.x - element.position.x
    );
    
    const arrowSize = 10;
    const arrowX = element.endPosition.x - arrowSize * Math.cos(angle);
    const arrowY = element.endPosition.y - arrowSize * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(element.endPosition.x, element.endPosition.y);
    ctx.lineTo(
      arrowX + arrowSize * Math.cos(angle - Math.PI / 6),
      arrowY + arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      arrowX + arrowSize * Math.cos(angle + Math.PI / 6),
      arrowY + arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = element.highlighted ? '#ef4444' : (element.color || '#757575');
    ctx.fill();
    
    // Draw weight text if available
    if (element.text) {
      const midX = (element.position.x + element.endPosition.x) / 2;
      const midY = (element.position.y + element.endPosition.y) / 2;
      
      // Draw text background
      const textMetrics = ctx.measureText(element.text);
      const padding = 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        midX - textMetrics.width / 2 - padding,
        midY - 8 - padding,
        textMetrics.width + padding * 2,
        16 + padding * 2
      );
      
      // Draw text
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(element.text, midX, midY);
    }
  }
  
  function drawText(element: VisualElement) {
    if (!ctx || !element.text) return;
    
    ctx.fillStyle = element.color || '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = element.size ? `${element.size}px sans-serif` : '14px sans-serif';
    ctx.fillText(element.text, element.position.x, element.position.y);
  }
  
  // Update visualization when elements change
  $: if (ctx && visualElements) {
    // If animation is requested and we have previous elements
    if (!animationInProgress && prevElements.length > 0) {
      animateTransition();
    } else if (!animationInProgress) {
      // Just draw the current state
      draw();
      prevElements = [...visualElements];
    }
  }
  
  // Update step description
  $: if (stepDescription) {
    draw();
  }
  
  function animateTransition() {
    animationInProgress = true;
    animationStartTime = performance.now();
    
    function animate(time: number) {
      const elapsed = time - animationStartTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Interpolate between previous and current elements
      const interpolatedElements = interpolateElements(prevElements, visualElements, progress);
      
      // Draw the interpolated state
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);
      
      drawGrid();
      
      interpolatedElements.forEach(element => {
        switch (element.type) {
          case 'circle':
            drawCircle(element);
            break;
          case 'rect':
            drawRect(element);
            break;
          case 'line':
            drawLine(element);
            break;
          case 'text':
            drawText(element);
            break;
        }
      });
      
      ctx.restore();
      
      if (totalSteps > 0) {
        drawStepInfo();
      }
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        animationInProgress = false;
        prevElements = [...visualElements];
      }
    }
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  function interpolateElements(prev: VisualElement[], current: VisualElement[], progress: number): VisualElement[] {
    // Simple interpolation for demonstration
    // In a real implementation, you would match elements by ID and interpolate their properties
    
    // For simplicity, if counts differ, just lerp visible elements
    if (prev.length !== current.length) {
      return current.map(el => ({ ...el }));
    }
    
    return prev.map((el, i) => {
      const currentEl = current[i];
      
      // Interpolate position
      const interpX = el.position.x + (currentEl.position.x - el.position.x) * progress;
      const interpY = el.position.y + (currentEl.position.y - el.position.y) * progress;
      
      let interpEndX = 0, interpEndY = 0;
      if (el.endPosition && currentEl.endPosition) {
        interpEndX = el.endPosition.x + (currentEl.endPosition.x - el.endPosition.x) * progress;
        interpEndY = el.endPosition.y + (currentEl.endPosition.y - el.endPosition.y) * progress;
      }
      
      return {
        ...currentEl,
        position: { x: interpX, y: interpY },
        endPosition: el.endPosition ? { x: interpEndX, y: interpEndY } : undefined
      };
    });
  }
</script>

<div class="visualizer-container" style="width: {width}px; height: {height}px;">
  <canvas 
    bind:this={canvas} 
    width={width} 
    height={height}
    style="width: 100%; height: 100%;"
    class="ds-visualizer"
  ></canvas>
  
  {#if totalSteps > 0}
    <div class="controls">
      <button 
        class="control-btn" 
        disabled={currentStep === 0}
        on:click={() => dispatch('prevStep')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <button 
        class="control-btn" 
        disabled={currentStep === totalSteps - 1}
        on:click={() => dispatch('nextStep')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  {/if}
</div>

<style>
  .visualizer-container {
    position: relative;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .ds-visualizer {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  .controls {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 5px;
  }
  
  .control-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 5px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .control-btn:hover {
    background-color: #2563eb;
  }
  
  .control-btn:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
</style>
