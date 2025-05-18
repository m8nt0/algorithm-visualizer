/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

declare module '@core/algorithms' {
	export interface Complexity {
		time: string;
		space: string;
	}

	export interface Algorithm {
		id: string;
		name: string;
		description: string;
		complexity: Complexity;
		relatedDataStructures: string[];
		languages: Record<string, string>;
	}

	export const Algorithms: Record<string, Algorithm>;
}

declare module '@core/data_structures' {
	import type { Complexity } from '@core/algorithms';

	export interface Operation {
		description: string;
		complexity: Complexity;
	}

	export interface DataStructure {
		id: string;
		name: string;
		description: string;
		operations: Record<string, Operation>;
	}

	export const DataStructures: Record<string, DataStructure>;
}

declare module '@core/visualizer/engine' {
	export class VisualizerEngine {
		constructor();
		clear(): void;
		record(dataStructureId: string, state: any, description: string): void;
		play(): void;
		pause(): void;
		nextStep(): void;
		previousStep(): void;
		getCurrentStepNumber(): number;
		getTotalSteps(): number;
		getCurrentVisualElements(): VisualElement[];
	}
}

declare module '@core/interpreter' {
	export function createInterpreter(): {
		execute(code: string, language: string): Promise<any>;
	};
}

declare module '@core/shared/types' {
	export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'c++';

	export interface Position {
		x: number;
		y: number;
	}

	export interface VisualElement {
		type: 'circle' | 'rect' | 'line' | 'text';
		position: Position;
		endPosition?: Position;
		text?: string;
		color?: string;
		size?: number;
	}
}

export {};
