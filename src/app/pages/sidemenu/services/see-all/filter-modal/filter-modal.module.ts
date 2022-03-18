import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterModalPageRoutingModule } from './filter-modal-routing.module';

import { FilterModalPage } from './filter-modal.page';
import { GlobalModule } from 'src/app/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterModalPageRoutingModule,
    GlobalModule
  ],
  declarations: [FilterModalPage]
})
export class FilterModalPageModule {}
