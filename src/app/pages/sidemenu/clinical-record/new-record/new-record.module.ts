import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewRecordPageRoutingModule } from './new-record-routing.module';

import { NewRecordPage } from './new-record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewRecordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewRecordPage]
})
export class NewRecordPageModule {}
