<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="app">
    <header>
        <nav>
            <div class="left-section">
                <h1>VISUALIZER</h1>
            </div>
            <div class="center-section">
                <div class="mode-selector">
                    <a href="/actions" class:active={$page.url.pathname.startsWith('/actions')}>
                        Algorithms
                    </a>
                    <a href="/stores" class:active={$page.url.pathname.startsWith('/stores')}>
                        Data Structures
                    </a>
                </div>
                <div class="mode-selector">
                    <a href="/playground" class:active={$page.url.pathname.startsWith('/playground')}>
                        Playground
                    </a>
                </div>
            </div>
            <div class="right-section">
                <button class="login-btn">Login</button>
            </div>
        </nav>
    </header>

    <main>
        <slot />
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: #1e1e1e;
        min-height: 100vh;
        overflow: hidden;
    }

    :global(*) {
        box-sizing: border-box;
    }

    .app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #1e1e1e;
        color: #fff;
    }

    header {
        background: #252525;
        height: 3.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    nav {
        max-width: 1800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 0 1rem;
    }

    .left-section h1 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #4ec9b0;
    }

    .center-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .mode-selector {
        display: flex;
        gap: 1px;
        background: #333;
        padding: 2px;
        border-radius: 6px;
    }

    a {
        color: #888;
        text-decoration: none;
        padding: 0.4rem 1rem;
        border-radius: 4px;
        transition: all 0.2s;
        font-size: 0.9rem;
    }

    a:hover {
        color: #fff;
        background: #3d3d3d;
    }

    a.active {
        background: #4ec9b0;
        color: #1e1e1e;
    }

    .login-btn {
        padding: 0.4rem 1rem;
        background: transparent;
        border: 1px solid #4ec9b0;
        color: #4ec9b0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .login-btn:hover {
        background: #4ec9b0;
        color: #1e1e1e;
    }

    main {
        flex: 1;
        overflow: hidden;
    }
</style> 