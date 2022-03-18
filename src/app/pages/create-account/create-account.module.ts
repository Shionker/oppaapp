import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAccountPageRoutingModule } from './create-account-routing.module';

import { CreateAccountPage } from './create-account.page';
import { GlobalModule } from 'src/app/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAccountPageRoutingModule,
    ReactiveFormsModule,
    GlobalModule
  ],
  declarations: [CreateAccountPage]
})
export class CreateAccountPageModule {}
