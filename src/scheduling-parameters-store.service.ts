import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchedulingParametersStore {

  private DEFAULT_LAMBDA = 4;
  private DEFAULT_D1 = 1;
  private DEFAULT_D2 = 0.6666;
  private DEFAULT_QUANTUM = 1.2;

  lambda = this.DEFAULT_LAMBDA;
  d1 = this.DEFAULT_D1;
  d2 = this.DEFAULT_D2;
  quantum = this.DEFAULT_QUANTUM;

  showQuantum = false;

  BASE_TIME = 10000;

  private listeners: Array<(lambda: number, d1: number, d2: number, quantum: number) => void> = [];
  private showQuantumListners: Array<(showQuantum: boolean) => void> = [];

  setShowQuantum(showQuantum: boolean): void {
    this.showQuantum = showQuantum;
    this.showQuantumListners.forEach(listener => listener(this.showQuantum));
  }

  setParameters(lambda: number, d1: number, d2: number, quantum: number): void {
    this.lambda = lambda;
    this.d1 = d1;
    this.d2 = d2;
    this.quantum = quantum;
    this.listeners.forEach(listener => listener(this.lambda, this.d1, this.d2, this.quantum));
  }

  resetParameters(): void {
    this.setParameters(this.DEFAULT_LAMBDA, this.DEFAULT_D1, this.DEFAULT_D2, this.DEFAULT_QUANTUM);
  }

  addListener(listener: (lambda: number, d1: number, d2: number, quantum: number) => void): void {
    this.listeners = this.listeners.concat(listener);
  }

  removeListener(listener: (lambda: number, d1: number, d2: number, quantum: number) => void): void {
    this.listeners.splice(this.listeners.findIndex(l => l === listener), 1);
  }

  addShowQuantumListener(listener: (showQuantum: boolean) => void): void {
    this.showQuantumListners = this.showQuantumListners.concat(listener);
  }

  removeShowQuantumListener(listener: (showQuantum: boolean) => void): void {
    this.showQuantumListners.splice(this.showQuantumListners.findIndex(l => l === listener), 1);
  }
}
