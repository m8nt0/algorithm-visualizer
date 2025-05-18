import { writable, derived } from 'svelte/store';
import type { Algorithm } from '@core/algorithms';
import type { DataStructure } from '@core/data_structures';
import type { VisualElement } from '@core/shared/types';

// Store for the currently selected algorithm
export const selectedAlgorithm = writable<Algorithm | null>(null);

// Store for the currently selected data structure
export const selectedDataStructure = writable<DataStructure | null>(null);

// Store for the currently selected programming language
export const selectedLanguage = writable<string>('typescript');

// Stores for the code in the editors
export const algorithmCode = writable<string>('');
export const dataStructureCode = writable<string>('');

// Store for visualization state
export const visualizationStep = writable<number>(0);
export const totalSteps = writable<number>(0);
export const isPlaying = writable<boolean>(false);
export const playbackSpeed = writable<number>(1000); // milliseconds
export const visualElements = writable<VisualElement[]>([]);

// Store for the current visual explanation
export const currentStepExplanation = writable<string>('');

// Stores for UI state
export const algorithmTabActive = writable<'learn' | 'code'>('code');
export const dataStructureTabActive = writable<'learn' | 'code'>('code');

// Derived store for algorithm-data structure compatibility
export const isCompatible = derived(
  [selectedAlgorithm, selectedDataStructure],
  ([$selectedAlgorithm, $selectedDataStructure]) => {
    if (!$selectedAlgorithm || !$selectedDataStructure) return false;
    return $selectedAlgorithm.relatedDataStructures.includes($selectedDataStructure.id);
  }
);

// Derived store for highlighted lines in code editors
export const highlightedAlgorithmLines = writable<number[]>([]);
export const highlightedDSLines = writable<number[]>([]);

// Store for global layout state
export const layoutState = writable<{
  algorithmPaneSize: number; // percentage of width (0-100)
  visualizerPaneSize: number; // percentage of height (0-100)
}>({
  algorithmPaneSize: 50, // Default is 50% split for the ALG and DS windows
  visualizerPaneSize: 40, // Default is 40% of the height for the visualizer panel
});
