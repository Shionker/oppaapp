import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/sidemenu/sidemenu.module').then( m => m.SidemenuPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./pages/create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: '',
    redirectTo: '/sidemenu',
    pathMatch: 'full'
  },
  {
    path: 'new-card',
    loadChildren: () => import('./pages/new-card/new-card.module').then( m => m.NewCardPageModule)
  },  {
    path: 'recover-account',
    loadChildren: () => import('./pages/recover-account/recover-account.module').then( m => m.RecoverAccountPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'new-address',
    loadChildren: () => import('./pages/new-address/new-address.module').then( m => m.NewAddressPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
