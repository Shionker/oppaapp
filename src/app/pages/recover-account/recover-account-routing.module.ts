import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoverAccountPage } from './recover-account.page';

const routes: Routes = [
  {
    path: '',
    component: RecoverAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoverAccountPageRoutingModule {}
