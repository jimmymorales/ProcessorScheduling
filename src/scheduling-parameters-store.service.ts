import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchedulingParametersStore {

  private DEFAULT_LAMBDA = 4;
  private DEFAULT_D1 = 1;
  private DEFAULT_D2 = 0.6666;

  lambda = this.DEFAULT_LAMBDA;
  d1 = this.DEFAULT_D1;
  d2 = this.DEFAULT_D2;

  BASE_TIME = 10000;

  private listeners: Array<(lambda: number, d1: number, d2: number) => void> = [];

  setParameters(lambda: number, d1: number, d2: number): void {
    this.lambda = lambda;
    this.d1 = d1;
    this.d2 = d2;
    this.listeners.forEach(listener => listener(this.lambda, this.d1, this.d2));
  }

  resetParameters(): void {
    this.setParameters(this.DEFAULT_LAMBDA, this.DEFAULT_D1, this.DEFAULT_D2);
  }

  addListener(listener: (lambda: number, d1: number, d2: number) => void): void {
    this.listeners = this.listeners.concat(listener);
  }

  removeListener(listener: (lambda: number, d1: number, d2: number) => void): void {
    this.listeners.splice(this.listeners.findIndex(l => l === listener), 1);
  }
}
