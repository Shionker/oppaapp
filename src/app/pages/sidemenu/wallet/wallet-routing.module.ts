import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletPage } from './wallet.page';

const routes: Routes = [
  {
    path: '',
    component: WalletPage
  },
  {
    path: 'add-credits',
    loadChildren: () => import('./add-credits/add-credits.module').then( m => m.AddCreditsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletPageRoutingModule {}
