import type { VisualizationStep } from '$lib/types/Visualization';
import type { GenerateStepsFunction } from '../types';
import { createStep, createInitialStep, createFinalStep } from '../utils';

export const generateMergeSortSteps: GenerateStepsFunction = (array) => {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    
    steps.push(createInitialStep([...arr]));
    mergeSortHelper(arr, 0, arr.length - 1, steps);
    steps.push(createFinalStep([...arr]));
    
    return steps;
};

function mergeSortHelper(arr: number[], left: number, right: number, steps: VisualizationStep[]) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);

        steps.push(createStep(
            `Dividing array from index ${left} to ${right}`,
            [...arr],
            Array.from({ length: right - left + 1 }, (_, i) => left + i)
        ));

        mergeSortHelper(arr, left, mid, steps);
        mergeSortHelper(arr, mid + 1, right, steps);
        merge(arr, left, mid, right, steps);
    }
}

function merge(arr: number[], left: number, mid: number, right: number, steps: VisualizationStep[]) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        steps.push(createStep(
            `Comparing ${leftArr[i]} with ${rightArr[j]}`,
            [...arr],
            [left + i, mid + 1 + j]
        ));

        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }

        steps.push(createStep(
            `Placing ${arr[k]} at position ${k}`,
            [...arr],
            [k]
        ));
        k++;
    }

    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push(createStep(
            `Placing remaining element ${leftArr[i]} from left array`,
            [...arr],
            [k]
        ));
        i++;
        k++;
    }

    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push(createStep(
            `Placing remaining element ${rightArr[j]} from right array`,
            [...arr],
            [k]
        ));
        j++;
        k++;
    }
} 