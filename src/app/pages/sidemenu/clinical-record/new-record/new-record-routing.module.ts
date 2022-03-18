import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewRecordPage } from './new-record.page';

const routes: Routes = [
  {
    path: '',
    component: NewRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewRecordPageRoutingModule {}
