import type { VisualizationStep } from '$lib/types/Visualization';

export class Queue<T extends number> {
    private items: T[] = [];

    enqueue(item: T): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        
        // Before enqueue
        steps.push({
            description: `Enqueuing ${item}`,
            data: [...this.items],
            highlights: []
        });

        this.items.push(item);

        // After enqueue
        steps.push({
            description: `Enqueued ${item} at the rear`,
            data: [...this.items],
            highlights: [this.items.length - 1]
        });

        return steps;
    }

    dequeue(): VisualizationStep[] {
        const steps: VisualizationStep[] = [];

        if (this.isEmpty()) {
            steps.push({
                description: "Cannot dequeue from empty queue",
                data: [],
                highlights: []
            });
            return steps;
        }

        const frontItem = this.items[0];
        
        // Before dequeue
        steps.push({
            description: `Dequeuing ${frontItem} from front`,
            data: [...this.items],
            highlights: [0]
        });

        this.items.shift();

        // After dequeue
        steps.push({
            description: `Dequeued ${frontItem}`,
            data: [...this.items],
            highlights: []
        });

        return steps;
    }

    getItems(): T[] {
        return [...this.items];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    clear(): void {
        this.items = [];
    }
} 