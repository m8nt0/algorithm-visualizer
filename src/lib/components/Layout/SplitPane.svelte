<script lang="ts">
    let isResizing = false;
    let splitPosition = 50; // percentage
    let isVertical = true;
    
    function updateOrientation() {
        isVertical = window.innerWidth > 768;
    }

    function startResize(e: MouseEvent) {
        isResizing = true;
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', stopResize);
    }

    function handleResize(e: MouseEvent) {
        if (!isResizing) return;
        
        const container = e.currentTarget as Window;
        if (isVertical) {
            const containerWidth = container.innerWidth;
            const newPosition = (e.pageX / containerWidth) * 100;
            splitPosition = Math.min(Math.max(newPosition, 20), 80);
        } else {
            const containerHeight = container.innerHeight;
            const newPosition = (e.pageY / containerHeight) * 100;
            splitPosition = Math.min(Math.max(newPosition, 20), 80);
        }
    }

    function stopResize() {
        isResizing = false;
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', stopResize);
    }

    // Handle window resize
    let resizeObserver: ResizeObserver;
    
    function setupResizeObserver(node: HTMLElement) {
        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        
        resizeObserver = new ResizeObserver(() => {
            updateOrientation();
        });
        
        resizeObserver.observe(node);
        
        return {
            destroy() {
                window.removeEventListener('resize', updateOrientation);
                resizeObserver?.disconnect();
            }
        };
    }

    function handleKeyboardResize(e: KeyboardEvent) {
        const step = 5;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            splitPosition = Math.max(splitPosition - step, 20);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            splitPosition = Math.min(splitPosition + step, 80);
        }
    }
</script>

<div 
    class="split-container"
    class:vertical={isVertical}
    use:setupResizeObserver
>
    <div 
        class="left" 
        style="{isVertical ? 'width' : 'height'}: {splitPosition}%"
    >
        <slot name="left" />
    </div>
    
    <div 
        class="divider"
        role="slider"
        tabindex="0"
        aria-orientation={isVertical ? "vertical" : "horizontal"}
        aria-label="Resize panels"
        aria-valuemin="20"
        aria-valuemax="80"
        aria-valuenow={splitPosition}
        on:mousedown={startResize}
        on:keydown={handleKeyboardResize}
    ></div>
    
    <div 
        class="right"
        style="{isVertical ? 'width' : 'height'}: {100 - splitPosition}%"
    >
        <slot name="right" />
    </div>
</div>

<style>
    .split-container {
        display: flex;
        width: 100%;
        height: 100%;
        background: #1e1e1e;
    }

    .split-container.vertical {
        flex-direction: row;
    }

    .split-container:not(.vertical) {
        flex-direction: column;
        overflow-y: auto;
    }

    .left, .right {
        height: 100%;
    }

    .split-container.vertical .left,
    .split-container.vertical .right {
        overflow: hidden;
    }

    .split-container:not(.vertical) .left,
    .split-container:not(.vertical) .right {
        width: 100% !important;
        min-height: 400px;
        overflow: hidden;
    }

    .divider {
        background: #333;
        transition: background 0.2s;
        width: 4px;
        height: 100%;
        cursor: col-resize;
        border: none;
        padding: 0;
        margin: 0;
        appearance: none;
        -webkit-appearance: none;
    }

    .divider:hover {
        background: #4ec9b0;
    }

    @media (max-width: 768px) {
        .split-container {
            min-height: min-content;
            height: auto;
        }

        .divider {
            width: 100%;
            height: 4px;
            cursor: row-resize;
        }
    }
</style> 