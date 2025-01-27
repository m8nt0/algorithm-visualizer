import type { VisualizationStep } from '$lib/types/Visualization';

export function createStep(
    description: string,
    data: any,
    highlights: number[] = []
): VisualizationStep {
    return {
        description,
        data,
        highlights
    };
}

export function createInitialStep(data: any): VisualizationStep {
    return createStep("Initial state", data);
}

export function createFinalStep(data: any): VisualizationStep {
    return createStep("Final state", data);
} 