import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesPageRoutingModule } from './services-routing.module';

import { ServicesPage } from './services.page';
import { ModalPage } from './modal/modal.page';
import { GlobalModule } from 'src/app/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPageRoutingModule,
    ReactiveFormsModule,
    GlobalModule
  ],
  declarations: [ServicesPage, ModalPage]
})
export class ServicesPageModule {}
