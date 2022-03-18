import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

import { SidemenuPage } from './sidemenu.page';

const routes: Routes = [
  {
    path: 'sidemenu',
    component: SidemenuPage,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'services',
        loadChildren: () => import('./services/services.module').then( m => m.ServicesPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
      },
      {
        path: 'history/:client_id',
        loadChildren: () => import('./history/history.module').then( m => m.RatingsPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
      },
      {
        path: 'wallet',
        loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: 'clinical-record',
        loadChildren: () => import('./clinical-record/clinical-record.module').then( m => m.ClinicalRecordPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/sidemenu/services',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidemenuPageRoutingModule { }
