import type { VisualizationStep } from '$lib/types/Visualization';
import { Queue } from './Queue';

export function generateEnqueueSteps(queue: Queue<number>, value: number): VisualizationStep[] {
    return queue.enqueue(value);
}

export function generateDequeueSteps(queue: Queue<number>): VisualizationStep[] {
    return queue.dequeue();
}

export function generateInitialSteps(queue: Queue<number>): VisualizationStep[] {
    return [{
        description: "Initial Queue State",
        data: queue.getItems(),
        highlights: []
    }];
} 