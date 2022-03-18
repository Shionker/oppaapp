import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPage } from './account.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage
  },
  {
    path: 'new-elder',
    loadChildren: () => import('./new-elder/new-elder.module').then( m => m.NewElderPageModule)
  },
  {
    path: 'elder-account',
    loadChildren: () => import('./elder-account/elder-account.module').then( m => m.ElderAccountPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
