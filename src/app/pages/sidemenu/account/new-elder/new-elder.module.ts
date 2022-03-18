import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewElderPageRoutingModule } from './new-elder-routing.module';

import { NewElderPage } from './new-elder.page';
import { GlobalModule } from 'src/app/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewElderPageRoutingModule,
    ReactiveFormsModule,
    GlobalModule
  ],
  declarations: [NewElderPage]
})
export class NewElderPageModule {}
