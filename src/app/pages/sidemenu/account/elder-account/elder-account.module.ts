import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElderAccountPageRoutingModule } from './elder-account-routing.module';

import { ElderAccountPage } from './elder-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElderAccountPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ElderAccountPage]
})
export class ElderAccountPageModule {}
