import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewAddressPageRoutingModule } from './new-address-routing.module';

import { NewAddressPage } from './new-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewAddressPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewAddressPage]
})
export class NewAddressPageModule {}
