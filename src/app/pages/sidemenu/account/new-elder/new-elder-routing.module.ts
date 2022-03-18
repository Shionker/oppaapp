import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewElderPage } from './new-elder.page';

const routes: Routes = [
  {
    path: '',
    component: NewElderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewElderPageRoutingModule {}
