import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCardPage } from './new-card.page';

const routes: Routes = [
  {
    path: '',
    component: NewCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCardPageRoutingModule {}
