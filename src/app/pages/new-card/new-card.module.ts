import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCardPageRoutingModule } from './new-card-routing.module';

import { NewCardPage } from './new-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewCardPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewCardPage]
})
export class NewCardPageModule {}
