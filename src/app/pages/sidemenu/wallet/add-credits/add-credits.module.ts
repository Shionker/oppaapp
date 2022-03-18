import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCreditsPageRoutingModule } from './add-credits-routing.module';

import { AddCreditsPage } from './add-credits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCreditsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddCreditsPage]
})
export class AddCreditsPageModule {}
