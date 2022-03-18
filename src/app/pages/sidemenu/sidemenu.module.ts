import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SidemenuPageRoutingModule } from './sidemenu-routing.module';

import { SidemenuPage } from './sidemenu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SidemenuPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SidemenuPage]
})
export class SidemenuPageModule {}
