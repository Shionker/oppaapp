import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElderAccountPage } from './elder-account.page';

const routes: Routes = [
  {
    path: '',
    component: ElderAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElderAccountPageRoutingModule {}
