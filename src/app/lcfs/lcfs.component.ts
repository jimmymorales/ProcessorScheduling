import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SchedulingParametersStore} from '../../scheduling-parameters-store.service';
import {Row} from '../fcfs/fcfs.component';

@Component({
  selector: 'app-lcfs',
  templateUrl: './lcfs.component.html',
  styleUrls: ['./lcfs.component.css'],
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
export class LcfsComponent implements OnInit, OnDestroy {
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

  private rollback1 = false;
  private rollback2 = false;

  clear1 = false;
  clear2 = false;

  constructor(private schedulingCalculatorService: SchedulingParametersStore) {
  }

  ngOnInit(): void {
    this.schedulingCalculatorService.addListener((lambda, d1, d2) => this.onParametersChanged(lambda, d1, d2));
    // tslint:disable-next-line:max-line-length
    this.onParametersChanged(this.schedulingCalculatorService.lambda, this.schedulingCalculatorService.d1, this.schedulingCalculatorService.d2);

    this.schedulingCalculatorService.setShowQuantum(false);
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
        }, (this.schedulingCalculatorService.BASE_TIME / this.schedulingCalculatorService.lambda) + 10);
      } else { // @ts-ignore
        if (event.toState === 'waiting') {
          if (!this.rollback1) {
            if (this.video2 === 'viewing') {
              clearTimeout(this.timeout4);
              this.rollback2 = true;
              this.video2 = 'waiting';
            }
            this.video1 = 'viewing';
          } else {
            clearTimeout(this.timeout2);
            this.rollback1 = false;
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
          }, (this.schedulingCalculatorService.BASE_TIME / this.schedulingCalculatorService.lambda) - 10);
        } else { // @ts-ignore
          if (event.toState === 'waiting') {
            if (!this.rollback2) {
              if (this.video1 === 'viewing') {
                clearTimeout(this.timeout2);
                this.rollback1 = true;
                this.video1 = 'waiting';
              }
              this.video2 = 'viewing';
            } else {
              clearTimeout(this.timeout4);
              this.rollback2 = false;
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
    const pwv = (E1 * E1) / (2 * E1 * E1 + E1 * E3 + E1 * E2 + E2 * E3);
    const pvw = pwv;
    const pvg = (E1 * E2) / (2 * E1 * E1 + E1 * E3 + E1 * E2 + E2 * E3);
    const pgg = (E1 * E1) / (2 * E1 * E1 + E1 * E3 + E1 * E2 + E2 * E3);
    const pgv = (E1 * E3) / (2 * E1 * E1 + E1 * E3 + E1 * E2 + E2 * E3);

    const u1 = pvw + pvg;
    const u2 = pgv + pwv;

    this.dataSource[0].d1 = u1 / d1;
    this.dataSource[0].d2 = u2 / d2;
    this.dataSource[0].total = this.dataSource[0].d1 + this.dataSource[0].d2;

    this.dataSource[1].d1 = pvw + pvg + pwv;
    this.dataSource[1].d2 = pvw + pgv + pwv;
    this.dataSource[1].total = this.dataSource[1].d1 + this.dataSource[1].d2;

    this.dataSource[2].d1 = this.dataSource[1].d1 / this.dataSource[0].d1;
    this.dataSource[2].d2 = this.dataSource[1].d2 / this.dataSource[0].d2;
    this.dataSource[2].total = this.dataSource[1].total / this.dataSource[0].total;

    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
    clearTimeout(this.timeout3);
    clearTimeout(this.timeout4);
    this.rollback1 = false;
    this.rollback2 = false;

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
