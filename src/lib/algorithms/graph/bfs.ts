import type { VisualizationStep } from '$lib/types/Visualization';
import type { Graph, GraphElement } from '../types';
import { createStep, createInitialStep, createFinalStep } from '../utils';

export function bfs(graph: Graph, startId: string | number, steps: VisualizationStep[]): VisualizationStep[] {
    const queue: (string | number)[] = [startId];
    const visited = new Set<string | number>();

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        const current = graph.vertices.get(currentId)!;

        if (!visited.has(currentId)) {
            visited.add(currentId);
            current.isVisited = true;

            steps.push({
                description: `Visiting vertex ${current.value}`,
                data: structuredClone(graph),
                highlights: [typeof currentId === 'string' ? parseInt(currentId) : currentId]
            });

            // Find all adjacent vertices
            const adjacentEdges = graph.edges.filter(e => e.from === currentId);
            for (const edge of adjacentEdges) {
                if (!visited.has(edge.to)) {
                    queue.push(edge.to);
                    edge.isHighlighted = true;
                    const nextVertex = graph.vertices.get(edge.to)!;
                    nextVertex.isProcessing = true;

                    steps.push({
                        description: `Adding ${nextVertex.value} to queue`,
                        data: structuredClone(graph),
                        highlights: [typeof edge.to === 'string' ? parseInt(edge.to as string) : edge.to]
                    });
                }
            }
        }
    }

    return steps;
} 