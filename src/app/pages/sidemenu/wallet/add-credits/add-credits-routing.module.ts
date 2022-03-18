import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCreditsPage } from './add-credits.page';

const routes: Routes = [
  {
    path: '',
    component: AddCreditsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCreditsPageRoutingModule {}
