import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicalRecordPageRoutingModule } from './clinical-record-routing.module';

import { ClinicalRecordPage } from './clinical-record.page';
import { GlobalModule } from 'src/app/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicalRecordPageRoutingModule,
    GlobalModule
  ],
  declarations: [ClinicalRecordPage]
})
export class ClinicalRecordPageModule {}
