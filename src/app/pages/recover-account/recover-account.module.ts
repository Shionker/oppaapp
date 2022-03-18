import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoverAccountPageRoutingModule } from './recover-account-routing.module';

import { RecoverAccountPage } from './recover-account.page';
import { GlobalModule } from 'src/app/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoverAccountPageRoutingModule,
    ReactiveFormsModule,
    GlobalModule
  ],
  declarations: [RecoverAccountPage]
})
export class RecoverAccountPageModule {}
