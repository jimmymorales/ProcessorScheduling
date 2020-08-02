import {Component, OnDestroy, OnInit} from '@angular/core';
import {SchedulingParametersStore} from '../../scheduling-parameters-store.service';
import {Row} from '../fcfs/fcfs.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-ljf',
  templateUrl: './ljf.component.html',
  styleUrls: ['./ljf.component.css'],
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
export class LjfComponent implements OnInit, OnDestroy {
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

  constructor(private schedulingCalculatorService: SchedulingParametersStore) {
  }

  ngOnInit(): void {
    this.schedulingCalculatorService.addListener((lambda, d1, d2) => this.onParametersChanged(lambda, d1, d2));
    // tslint:disable-next-line:max-line-length
    this.onParametersChanged(this.schedulingCalculatorService.lambda, this.schedulingCalculatorService.d1, this.schedulingCalculatorService.d2);
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
          } else if (this.schedulingCalculatorService.d1 > this.schedulingCalculatorService.d2) {
            if (this.video2 === 'viewing') {
              clearTimeout(this.timeout4);
              this.video2 = 'waiting';
            }
            this.video1 = 'viewing';
          }
        } else { // @ts-ignore
          if (event.toState === 'viewing') {
            this.timeout2 = setTimeout(() => {
              this.video1 = 'getting';
              if (this.video2 === 'waiting') {
                this.video2 = 'viewing';
              }
            }, this.schedulingCalculatorService.BASE_TIME * this.schedulingCalculatorService.d1);
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
            } else if (this.schedulingCalculatorService.d2 > this.schedulingCalculatorService.d1) {
              if (this.video1 === 'viewing') {
                clearTimeout(this.timeout2);
                this.video1 = 'waiting';
              }
              this.video2 = 'viewing';
            }
          } else { // @ts-ignore
            if (event.toState === 'viewing') {
              this.timeout4 = setTimeout(() => {
                if (this.video1 === 'waiting') {
                  this.video1 = 'viewing';
                }
                this.video2 = 'getting';
              }, this.schedulingCalculatorService.BASE_TIME * this.schedulingCalculatorService.d2);
            }
          }
        }
      }
    }
  }

  onParametersChanged(lambda: number, d1: number, d2: number): void {
    console.log('parameters changed!');

    const E1 = lambda;
    const E2 = 1 / d2;
    const E3 = 1 / d1;
    const pvg = (E1 * E2 * E3) / (2 * E1 * E1 * E1 + 3 * E1 * E1 * E3 + E1 * E1 * E2 + E1 * E3 * E3 + 2 * E1 * E2 * E3 + E3 * E3 * E2);
    const pgg = (E2 * E3) / (2 * E1 * E1 + E1 * E3 + E1 * E2 + E2 * E3);
    // tslint:disable-next-line:max-line-length
    const pgv = (E1 * E3 * (2 * E1 + E3)) / (2 * E1 * E1 * E1 + 3 * E1 * E1 * E3 + E1 * E1 * E2 + E1 * E3 * E3 + 2 * E1 * E2 * E3 + E3 * E3 * E2);
    // tslint:disable-next-line:max-line-length
    const pvw = (E1 * E1 * (2 * E1 + E2 + E3)) / (2 * E1 * E1 * E1 + 3 * E1 * E1 * E3 + E1 * E1 * E2 + E1 * E3 * E3 + 2 * E1 * E2 * E3 + E3 * E3 * E2);

    const u1 = pvw + pvg;
    const u2 = pgv;

    this.dataSource[0].d1 = u1 / d1;
    this.dataSource[0].d2 = u2 / d2;
    this.dataSource[0].total = this.dataSource[0].d1 + this.dataSource[0].d2;

    this.dataSource[1].d1 = pvw + pvg;
    this.dataSource[1].d2 = pvw + pgv;
    this.dataSource[1].total = this.dataSource[1].d1 + this.dataSource[1].d2;

    this.dataSource[2].d1 = this.dataSource[1].d1 / this.dataSource[0].d1;
    this.dataSource[2].d2 = this.dataSource[1].d2 / this.dataSource[0].d2;
    this.dataSource[2].total = this.dataSource[1].total / this.dataSource[0].total;

    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
    clearTimeout(this.timeout3);
    clearTimeout(this.timeout4);
    this.video1 = 'getting';
    this.video2 = 'getting';
  }
}
