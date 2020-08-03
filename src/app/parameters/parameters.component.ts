import {Component, OnInit} from '@angular/core';
import {SchedulingParametersStore} from '../../scheduling-parameters-store.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {

  lambda = 0;
  d1 = 0;
  d2 = 0;
  quantum = 0;

  showQuantum = false;

  constructor(private schedulingCalculatorService: SchedulingParametersStore) {
  }

  ngOnInit(): void {
    this.lambda = this.schedulingCalculatorService.lambda;
    this.d1 = this.schedulingCalculatorService.d1;
    this.d2 = this.schedulingCalculatorService.d2;
    this.quantum = this.schedulingCalculatorService.quantum;

    this.schedulingCalculatorService.addListener((lambda, d1, d2, quantum) => this.onParametersChanged(lambda, d1, d2, quantum));

    this.schedulingCalculatorService.addShowQuantumListener((showQuantum1 => this.showQuantum = showQuantum1));
  }

  save(): void {
    console.log('Guardar!');
    this.schedulingCalculatorService.setParameters(this.lambda, this.d1, this.d2, this.quantum);
  }

  resetAll(): void {
    this.schedulingCalculatorService.resetParameters();
  }

  onParametersChanged(lambda: number, d1: number, d2: number, quantum: number): void {
    this.lambda = lambda;
    this.d1 = d1;
    this.d2 = d2;
    this.quantum = quantum;
  }
}
