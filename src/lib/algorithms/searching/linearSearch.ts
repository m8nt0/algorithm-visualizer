import type { VisualizationStep } from '$lib/types/Visualization';
import type { GenerateStepsFunction } from '../types';
import { createStep, createInitialStep, createFinalStep } from '../utils';

export const generateLinearSearchSteps = (array: number[], target: number): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    
    steps.push(createInitialStep([...arr]));

    for (let i = 0; i < arr.length; i++) {
        steps.push(createStep(
            `Checking if ${arr[i]} equals ${target}`,
            [...arr],
            [i]
        ));

        if (arr[i] === target) {
            steps.push(createStep(
                `Found ${target} at position ${i}!`,
                [...arr],
                [i]
            ));
            return steps;
        }
    }

    steps.push(createStep(
        `${target} not found in the array`,
        [...arr],
        []
    ));

    return steps;
}; 