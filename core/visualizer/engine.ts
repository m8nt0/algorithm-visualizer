import type { VisualElement } from '../shared/types';
import { DataStructures } from '../data_structures';

export interface VisualizationMetadata {
  description?: string;
  highlightedAlgorithmLines?: number[];
  highlightedDSLines?: number[];
  [key: string]: any; // Allow any other metadata properties
}

export interface VisualizationFrame {
  dsId: string;
  state: any;
  metadata?: VisualizationMetadata;
  timestamp: number;
}

export class VisualizerEngine {
  private frames: VisualizationFrame[] = [];
  private currentStep: number = 0;
  private playing: boolean = false;
  private playbackSpeed: number = 1000; // ms between steps

  constructor() {
    this.clear();
  }

  record(dsId: string, state: any, metadata?: string | VisualizationMetadata): void {
    // Support both old string description and new metadata object
    let metadataObj: VisualizationMetadata | undefined;
    
    if (typeof metadata === 'string') {
      metadataObj = { description: metadata };
    } else {
      metadataObj = metadata;
    }
    
    this.frames.push({ 
      dsId, 
      state, 
      metadata: metadataObj,
      timestamp: Date.now() 
    });
  }

  getFrames(): VisualizationFrame[] {
    return this.frames;
  }

  getCurrentFrame(): VisualizationFrame | null {
    if (this.frames.length === 0 || this.currentStep < 0 || this.currentStep >= this.frames.length) {
      return null;
    }
    return this.frames[this.currentStep];
  }

  getCurrentVisualElements(): VisualElement[] {
    const currentFrame = this.getCurrentFrame();
    if (!currentFrame) return [];

    const dataStructure = DataStructures[currentFrame.dsId];
    if (!dataStructure) return [];

    return dataStructure.visualizer(currentFrame.state);
  }

  clear(): void {
    this.frames = [];
    this.currentStep = 0;
    this.playing = false;
  }

  nextStep(): VisualizationFrame | null {
    if (this.currentStep < this.frames.length - 1) {
      this.currentStep++;
      return this.getCurrentFrame();
    }
    return null;
  }

  previousStep(): VisualizationFrame | null {
    if (this.currentStep > 0) {
      this.currentStep--;
      return this.getCurrentFrame();
    }
    return null;
  }

  goToStep(step: number): VisualizationFrame | null {
    if (step >= 0 && step < this.frames.length) {
      this.currentStep = step;
      return this.getCurrentFrame();
    }
    return null;
  }

  play(): void {
    if (this.playing) return;
    
    this.playing = true;
    this.playSteps();
  }

  pause(): void {
    this.playing = false;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  setPlaybackSpeed(speedMs: number): void {
    this.playbackSpeed = speedMs;
  }

  private playSteps(): void {
    if (!this.playing) return;
    
    const nextFrame = this.nextStep();
    if (!nextFrame) {
      this.playing = false;
      return;
    }
    
    setTimeout(() => this.playSteps(), this.playbackSpeed);
  }

  getTotalSteps(): number {
    return this.frames.length;
  }

  getCurrentStepNumber(): number {
    return this.currentStep;
  }
} 