import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FcfsComponent} from './fcfs/fcfs.component';
import {SjfComponent} from './sjf/sjf.component';
import {LjfComponent} from './ljf/ljf.component';
import {LcfsComponent} from './lcfs/lcfs.component';
import {RrComponent} from './rr/rr.component';

const routes: Routes = [
  {path: 'fcfs', component: FcfsComponent},
  {path: 'ljf', component: LjfComponent},
  {path: 'sjf', component: SjfComponent},
  {path: 'lcfs', component: LcfsComponent},
  {path: 'rr', component: RrComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
