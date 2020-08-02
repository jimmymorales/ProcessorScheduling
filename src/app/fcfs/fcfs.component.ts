import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface Row {
  name: string;
  d1: number;
  d2: number;
  total: number;
}

@Component({
  selector: 'app-fcfs',
  templateUrl: './fcfs.component.html',
  styleUrls: ['./fcfs.component.css'],
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
      transition('waiting => viewing', [
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
      transition('waiting => viewing', [
        animate('1s')
      ]),
      transition('viewing => getting', [
        animate('1s')
      ]),
    ])
  ]
})
export class FcfsComponent implements OnInit {
  video1 = 'getting';
  video2 = 'getting';

  data: Row[] = [
    {name: 'Throughput', d1: 0.5697, d2: 0.5937, total: 1.1634},
    {name: 'Line Length', d1: 0.8575, d2: 0.8516, total: 1.7091},
    {name: 'Response Time', d1: 1.5052, d2: 1.4343, total: 1.4691},
  ];
  displayedColumns: string[] = ['name', 'd1', 'd2', 'total'];

  constructor() {
  }

  ngOnInit(): void {
  }

  newState(event: AnimationEvent): void {
    console.log(event);
    // @ts-ignore
    if (event.triggerName === 'video1') {
      // @ts-ignore
      if (event.toState === 'getting') {
        setTimeout(() => {
          this.video1 = 'waiting';
        }, 2499);
      } else { // @ts-ignore
        if (event.toState === 'waiting') {
          if (this.video2 !== 'viewing') {
            this.video1 = 'viewing';
          }
        } else { // @ts-ignore
          if (event.toState === 'viewing') {
            setTimeout(() => {
              this.video1 = 'getting';
              this.video2 = 'viewing';
            }, 10000);
          }
        }
      }
    } else { // @ts-ignore
      if (event.triggerName === 'video2') {
        // @ts-ignore
        if (event.toState === 'getting') {
          setTimeout(() => {
            this.video2 = 'waiting';
          }, 2501);
        } else { // @ts-ignore
          if (event.toState === 'waiting') {
            if (this.video1 !== 'viewing') {
              this.video2 = 'viewing';
            }
          } else { // @ts-ignore
            if (event.toState === 'viewing') {
              setTimeout(() => {
                this.video1 = 'viewing';
                this.video2 = 'getting';
              }, 6666);
            }
          }
        }
      }
    }
  }
}
