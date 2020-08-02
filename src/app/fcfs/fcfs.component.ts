import {Component, OnInit} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {Observable} from 'rxjs';

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
        marginTop: '-100px',
      })),
      state('waiting', style({
        left: '50%',
        marginLeft: '-150px',
        top: '50%',
        marginTop: '-100px',
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
  video1 = new Observable(subscriber => {
    subscriber.next('getting');
    setTimeout(() => {
      subscriber.next('waiting');
      setTimeout(() => {
        subscriber.next('viewing');
        setTimeout(() => {
          subscriber.next('getting');
          subscriber.complete();
        }, 5000);
      }, 5000);
    }, 5000);
  });

  video2 = new Observable(subscriber => {
    subscriber.next('getting');
    setTimeout(() => {
      subscriber.next('waiting');
      setTimeout(() => {
        subscriber.next('viewing');
        setTimeout(() => {
          subscriber.next('getting');
          subscriber.complete();
        }, 5000);
      }, 5000);
    }, 5000);
  });

  constructor() {
  }

  ngOnInit(): void {

  }

  runVideo1Cycle(): void {

  }

}
