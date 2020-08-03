import {Component, OnDestroy, OnInit} from '@angular/core';
import {SchedulingParametersStore} from '../../scheduling-parameters-store.service';
import {Row} from '../fcfs/fcfs.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-rr',
  templateUrl: './rr.component.html',
  styleUrls: ['./rr.component.css'],
  animations: [
    trigger('video1', [
      state('getting', style({
        left: 0,
        marginLeft: 0,
        top: '70%',
        marginTop: '-115px',
      })),
      state('waiting', style({
        left: '50%',
        marginLeft: '-150px',
        top: '70%',
        marginTop: '-115px',
      })),
      state('viewing', style({
        left: '100%',
        marginLeft: '-250px',
        top: '70%',
        marginTop: '-100px',
      })),
      transition('getting => waiting', [
        animate('1s')
      ]),
      transition('waiting <=> viewing', [
        animate('1s')
      ]),
      transition('viewing => getting', [
        animate('1s')
      ]),
    ]),
    trigger('video2', [
      state('getting', style({
        left: 0,
        marginLeft: '0',
        top: '70%',
        marginTop: '0',
      })),
      state('waiting', style({
        left: '50%',
        marginLeft: '-150px',
        top: '70%',
        marginTop: '0',
      })),
      state('viewing', style({
        left: '100%',
        marginLeft: '-250px',
        top: '70%',
        marginTop: '-100px',
      })),
      transition('getting => waiting', [
        animate('1s')
      ]),
      transition('waiting <=> viewing', [
        animate('1s')
      ]),
      transition('viewing => getting', [
        animate('1s')
      ]),
    ])
  ]
})
export class RrComponent implements OnInit, OnDestroy {
  video1 = 'getting';
  video2 = 'getting';

  dataSource: Row[] = [
    {name: 'Throughput', d1: 0, d2: 0, total: 0},
    {name: 'Line Length', d1: 0, d2: 0, total: 0},
    {name: 'Response Time', d1: 0, d2: 0, total: 0},
  ];
  displayedColumns: string[] = ['name', 'd1', 'd2', 'total'];

  private timeout1 = 0;
  private timeout2 = 0;
  private timeout3 = 0;
  private timeout4 = 0;

  clear1 = false;
  clear2 = false;

  private quantum1 = 0;
  private quantum2 = 0;

  constructor(private schedulingCalculatorService: SchedulingParametersStore) {
  }

  ngOnInit(): void {
    this.schedulingCalculatorService.addListener((lambda, d1, d2, quantum) => this.onParametersChanged(lambda, d1, d2, quantum));
    // tslint:disable-next-line:max-line-length
    this.onParametersChanged(this.schedulingCalculatorService.lambda, this.schedulingCalculatorService.d1, this.schedulingCalculatorService.d2, this.schedulingCalculatorService.quantum);

    this.schedulingCalculatorService.setShowQuantum(true);
  }

  ngOnDestroy(): void {
    this.schedulingCalculatorService.removeListener(this.onParametersChanged);
  }

  newState(event: AnimationEvent): void {
    console.log('new state', event);
    // @ts-ignore
    if (event.triggerName === 'video1') {
      // @ts-ignore
      if (event.toState === 'getting') {
        this.timeout1 = setTimeout(() => {
          this.video1 = 'waiting';
        }, (this.schedulingCalculatorService.BASE_TIME / this.schedulingCalculatorService.lambda) - 10);
      } else { // @ts-ignore
        if (event.toState === 'waiting') {
          if (this.video2 !== 'viewing') {
            this.video1 = 'viewing';
          }
        } else { // @ts-ignore
          if (event.toState === 'viewing') {
            const q = 1 / this.schedulingCalculatorService.quantum;
            let delay: number;
            if (this.quantum1 === 0) {
              if (this.schedulingCalculatorService.d1 <= q) {
                delay = this.schedulingCalculatorService.d1;
              } else {
                delay = q;
                this.quantum1 = this.schedulingCalculatorService.d1 - q;
              }
            } else {
              if (this.quantum1 <= q) {
                delay = this.quantum1;
                this.quantum1 = 0;
              } else {
                delay = q;
                this.quantum1 = this.quantum1 - q;
              }
            }
            this.timeout2 = setTimeout(() => {
              if (this.video2 === 'waiting') {
                this.video2 = 'viewing';
              }
              if (this.quantum1 === 0) {
                this.video1 = 'getting';
              } else {
                this.video1 = 'waiting';
              }
            }, this.schedulingCalculatorService.BASE_TIME * delay);
          }
        }
      }
    } else { // @ts-ignore
      if (event.triggerName === 'video2') {
        // @ts-ignore
        if (event.toState === 'getting') {
          this.timeout3 = setTimeout(() => {
            this.video2 = 'waiting';
          }, (this.schedulingCalculatorService.BASE_TIME / this.schedulingCalculatorService.lambda) + 10);
        } else { // @ts-ignore
          if (event.toState === 'waiting') {
            if (this.video1 !== 'viewing') {
              this.video2 = 'viewing';
            }
          } else { // @ts-ignore
            if (event.toState === 'viewing') {
              const q = 1 / this.schedulingCalculatorService.quantum;
              let delay: number;
              if (this.quantum2 === 0) {
                if (this.schedulingCalculatorService.d2 <= q) {
                  delay = this.schedulingCalculatorService.d2;
                } else {
                  delay = q;
                  this.quantum2 = this.schedulingCalculatorService.d2 - q;
                }
              } else {
                if (this.quantum2 <= q) {
                  delay = this.quantum2;
                  this.quantum2 = 0;
                } else {
                  delay = q;
                  this.quantum2 = this.quantum2 - q;
                }
              }
              this.timeout4 = setTimeout(() => {
                if (this.video1 === 'waiting') {
                  this.video1 = 'viewing';
                }
                if (this.quantum2 === 0) {
                  this.video2 = 'getting';
                } else {
                  this.video2 = 'waiting';
                }
              }, this.schedulingCalculatorService.BASE_TIME * delay);
            }
          }
        }
      }
    }
  }

  onParametersChanged(lambda: number, d1: number, d2: number, quantum: number): void {
    console.log('parameters changed!');

    const q = 1 / quantum;

    const E1 = quantum;
    let E2: number;
    if (d1 > q) {
      E2 = 1 / (d1 - q);
    } else {
      E2 = 1 / d1;
    }
    let E3: number;
    if (d2 > q) {
      E3 = 1 / (d2 - q);
    } else {
      E3 = 1 / d2;
    }
    const E4 = lambda;

    // tslint:disable-next-line:max-line-length
    const pw1v1 = (E2 * E1 * E4 * E4 * (E4 + E1) * (2 * E4 + E2)) / (2 * (E3 * (E2 + E1) + 2 * E2 * E1) * E4 * E4 * E4 * E4 + (E3 * E3 * (E2 + E1) + E3 * (2 * E2 * E2 + 7 * E2 * E1 + 2 * E1 * E1) + E2 * (3 * E2 + 2 * E1) * E1) * E4 * E4 * E4 + (E3 * E3 * (E2 * E2 + 3 * E2 * E1 + E1 * E1) + E3 * E2 * (5 * E2 + 4 * E1) * E1 + E2 * E2 * E1 * E1) * E4 * E4 + 2 * E3 * (E3 * (E2 * E1) + E2 * E1) * E2 * E1 * E4 + E3 * E3 * E2 * E2 * E1 * E1);
    // tslint:disable-next-line:max-line-length
    const pw2v1 = (E2 * E1 * E4 * E4 * (E4 + E2) * (2 * E4 + E3)) / (2 * (E3 * (E2 + E1) + 2 * E2 * E1) * E4 * E4 * E4 * E4 + (E3 * E3 * (E2 + E1) + E3 * (2 * E2 * E2 + 7 * E2 * E1 + 2 * E1 * E1) + E2 * (3 * E2 + 2 * E1) * E1) * E4 * E4 * E4 + (E3 * E3 * (E2 * E2 + 3 * E2 * E1 + E1 * E1) + E3 * E2 * (5 * E2 + 4 * E1) * E1 + E2 * E2 * E1 * E1) * E4 * E4 + 2 * E3 * (E3 * (E2 * E1) + E2 * E1) * E2 * E1 * E4 + E3 * E3 * E2 * E2 * E1 * E1);
    const pv1g = E3 / E4 * pw2v1;
    const pv1w1 = E3 / E1 * pw2v1;
    const pgv1 = E3 / E4 * pw1v1;
    // tslint:disable-next-line:max-line-length
    const pgg = (E2 * E1 * E3 * (E4 + E1) * ((E3 + E2) * E4 + E3 * E2)) / (2 * (E3 * (E2 + E1) + 2 * E2 * E1) * E4 * E4 * E4 * E4 + (E3 * E3 * (E2 + E1) + E3 * (2 * E2 * E2 + 7 * E2 * E1 + 2 * E1 * E1) + E2 * (3 * E2 + 2 * E1) * E1) * E4 * E4 * E4 + (E3 * E3 * (E2 * E2 + 3 * E2 * E1 + E1 * E1) + E3 * E2 * (5 * E2 + 4 * E1) * E1 + E2 * E2 * E1 * E1) * E4 * E4 + 2 * E3 * (E3 * (E2 * E1) + E2 * E1) * E2 * E1 * E4 + E3 * E3 * E2 * E2 * E1 * E1);
    // tslint:disable-next-line:max-line-length
    const pv2w1 = (E3 * E1 * E4 * E4 * (E4 + E1) * (2 * E4 + E3)) / (2 * (E3 * (E2 + E1) + 2 * E2 * E1) * E4 * E4 * E4 * E4 + (E3 * E3 * (E2 + E1) + E3 * (2 * E2 * E2 + 7 * E2 * E1 + 2 * E1 * E1) + E2 * (3 * E2 + 2 * E1) * E1) * E4 * E4 * E4 + (E3 * E3 * (E2 * E2 + 3 * E2 * E1 + E1 * E1) + E3 * E2 * (5 * E2 + 4 * E1) * E1 + E2 * E2 * E1 * E1) * E4 * E4 + 2 * E3 * (E3 * (E2 * E1) + E2 * E1) * E2 * E1 * E4 + E3 * E3 * E2 * E2 * E1 * E1);
    const pv2g = E2 / E4 * pv2w1;

    const u1 = pv1g + pv1w1 + pv2w1 + pv2g;
    const u2 = pw1v1 + pgv1 + pw2v1;

    this.dataSource[0].d1 = u1 / d1;
    this.dataSource[0].d2 = u2 / d2;
    this.dataSource[0].total = this.dataSource[0].d1 + this.dataSource[0].d2;

    this.dataSource[1].d1 = pw1v1 + pv1g + pv1w1 + pv2w1 + pv2g + pw2v1;
    this.dataSource[1].d2 = pw1v1 + pv1w1 + pgv1 + pv2w1 + pw2v1;
    this.dataSource[1].total = this.dataSource[1].d1 + this.dataSource[1].d2;

    this.dataSource[2].d1 = this.dataSource[1].d1 / this.dataSource[0].d1;
    this.dataSource[2].d2 = this.dataSource[1].d2 / this.dataSource[0].d2;
    this.dataSource[2].total = this.dataSource[1].total / this.dataSource[0].total;

    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
    clearTimeout(this.timeout3);
    clearTimeout(this.timeout4);

    this.clear1 = true;
    this.clear2 = true;

    setTimeout(() => {
      this.clear1 = false;
      this.clear2 = false;
      this.video1 = 'getting';
      this.video2 = 'getting';
    }, 500);
  }
}
