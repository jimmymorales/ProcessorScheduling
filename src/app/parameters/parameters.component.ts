import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {

  private DEFAULT_LAMBDA = 4;
  private DEFAULT_D1 = 1;
  private DEFAULT_D2 = 0.3333;

  lambda = this.DEFAULT_LAMBDA;
  d1 = this.DEFAULT_D1;
  d2 = this.DEFAULT_D2;

  constructor() {
  }

  ngOnInit(): void {
  }

  save(): void {
    console.log('Guardar!');
  }

  resetLambda(): void {
    this.lambda = this.DEFAULT_LAMBDA;
  }

  resetD1(): void {
    this.d1 = this.DEFAULT_D1;
  }

  resetD2(): void {
    this.d2 = this.DEFAULT_D2;
  }

  resetAll(): void {
    this.resetLambda();
    this.resetD1();
    this.resetD2();
  }
}
