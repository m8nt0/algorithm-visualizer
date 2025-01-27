import type { VisualizationStep } from '$lib/types/Visualization';
import type { GenerateStepsFunction } from '../types';
import { createStep, createInitialStep, createFinalStep } from '../utils';

export const generateBinarySearchSteps = (array: number[], target: number): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    
    steps.push(createInitialStep([...arr]));

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        steps.push(createStep(
            `Checking middle element ${arr[mid]} at position ${mid}`,
            [...arr],
            [mid]
        ));

        if (arr[mid] === target) {
            steps.push(createStep(
                `Found ${target} at position ${mid}!`,
                [...arr],
                [mid]
            ));
            return steps;
        }

        if (arr[mid] < target) {
            left = mid + 1;
            steps.push(createStep(
                `${target} is greater than ${arr[mid]}, searching right half`,
                [...arr],
                Array.from({ length: right - mid }, (_, i) => mid + 1 + i)
            ));
        } else {
            right = mid - 1;
            steps.push(createStep(
                `${target} is less than ${arr[mid]}, searching left half`,
                [...arr],
                Array.from({ length: mid }, (_, i) => i)
            ));
        }
    }

    steps.push(createStep(
        `${target} not found in the array`,
        [...arr],
        []
    ));

    return steps;
}; 