import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicalRecordPage } from './clinical-record.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicalRecordPage
  },
  {
    path: 'new-record',
    loadChildren: () => import('./new-record/new-record.module').then( m => m.NewRecordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicalRecordPageRoutingModule {}
