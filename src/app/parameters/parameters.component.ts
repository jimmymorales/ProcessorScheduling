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

  constructor(private schedulingCalculatorService: SchedulingParametersStore) {
  }

  ngOnInit(): void {
    this.lambda = this.schedulingCalculatorService.lambda;
    this.d1 = this.schedulingCalculatorService.d1;
    this.d2 = this.schedulingCalculatorService.d2;
  }

  save(): void {
    console.log('Guardar!');
    this.schedulingCalculatorService.setParameters(this.lambda, this.d1, this.d2);
  }

  resetAll(): void {
    this.schedulingCalculatorService.resetParameters();
  }
}
