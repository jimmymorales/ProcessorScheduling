import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-fcfs',
  templateUrl: './fcfs.component.html',
  styleUrls: ['./fcfs.component.css'],
  animations: [
    trigger('video1', [
      state('getting', style({
        left: 0,
        marginLeft: 0,
        top: '50%',
        marginTop: '-115px',
      })),
      state('waiting', style({
        left: '50%',
        marginLeft: '-150px',
        top: '50%',
        marginTop: '-115px',
      })),
      state('viewing', style({
        left: '100%',
        marginLeft: '-250px',
        top: '50%',
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
        top: '50%',
        marginTop: '0',
      })),
      state('waiting', style({
        left: '50%',
        marginLeft: '-150px',
        top: '50%',
        marginTop: '0',
      })),
      state('viewing', style({
        left: '100%',
        marginLeft: '-250px',
        top: '50%',
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

  constructor() {
  }

  ngOnInit(): void {
  }

  newState(event: AnimationEvent): void {
    console.log(event);
    if (event.triggerName === 'video1') {
      if (event.toState === 'getting') {
        setTimeout(() => {
          this.video1 = 'waiting';
        }, 2499);
      } else if (event.toState === 'waiting') {
        if (this.video2 !== 'viewing') {
          this.video1 = 'viewing';
        }
      } else if (event.toState === 'viewing') {
        setTimeout(() => {
          this.video1 = 'getting';
          this.video2 = 'viewing';
        }, 10000);
      }
    } else if (event.triggerName === 'video2') {
      if (event.toState === 'getting') {
        setTimeout(() => {
          this.video2 = 'waiting';
        }, 2501);
      } else if (event.toState === 'waiting') {
        if (this.video1 !== 'viewing') {
          this.video2 = 'viewing';
        }
      } else if (event.toState === 'viewing') {
        setTimeout(() => {
          this.video1 = 'viewing';
          this.video2 = 'getting';
        }, 6666);
      }
    }
  }
}
