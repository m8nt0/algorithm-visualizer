# Universal DSA Visualizer Playground

A modular, framework-agnostic architecture for visualizing and learning about Data Structures and Algorithms.

## Features

- 🧩 **Modular Architecture**: Clean separation between core logic and UI
- 📊 **Interactive Visualizations**: Step-by-step visualization of algorithms and data structures
- 🔄 **Multi-language Support**: View and run code samples in TypeScript, Python, C++, and more
- 📚 **Learning Content**: Detailed explanations and complexity analysis
- 🔌 **Framework-Agnostic**: Core logic can be used with any UI framework

## Project Structure

```
📦 dsa-visualizer/
├── core/                         # Framework-agnostic business logic
│   ├── algorithms/               # Algorithm metadata, logic, code samples
│   ├── data_structures/          # DS definitions, metadata, visual models
│   ├── visualizer/               # Step-by-step state engine for visualization
│   ├── interpreter/              # Cross-language execution layer
│   └── shared/                   # Utilities, types, helpers
│
├── ui/                           # UI implementations
│   ├── sveltekit/                # Initial implementation using SvelteKit
│   ├── react/                    # Future support
│   └── vanilla/                  # Optional no-framework support
│
├── public/                       # Static assets
├── docs/                         # Markdown docs for algorithms and DS
└── tests/                        # Unit tests
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dsa-visualizer.git
cd dsa-visualizer

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Visit `http://localhost:5173` in your browser
2. Browse available algorithms and data structures
3. Select an algorithm to visualize
4. Use the controls to step through the visualization
5. View and modify the code samples
6. Learn about the algorithm's complexity and use cases

## Extending

### Adding a New Algorithm

1. Add your algorithm definition to `core/algorithms/index.ts`
2. Provide code samples in multiple languages
3. Link it to related data structures
4. Add visualization steps in the playground component

### Adding a New Data Structure

1. Add your data structure definition to `core/data_structures/index.ts`
2. Implement the visualizer function to render the structure
3. Define key operations and their complexity
4. Add code samples for each operation

## Future Plans

- Add more algorithms and data structures
- Implement WASM-based execution for non-JavaScript languages
- Add React and vanilla JS UI implementations
- Support for user-defined algorithms and data structures
- Mobile-responsive design

## License

This project is licensed under the MIT License - see the LICENSE file for details.
