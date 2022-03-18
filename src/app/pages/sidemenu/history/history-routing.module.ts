import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryPage } from './history.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPage
  },
  {
    path: 'update-modal',
    loadChildren: () => import('./update-modal/update-modal.module').then( m => m.UpdateModalPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingsPageRoutingModule {}
