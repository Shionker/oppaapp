import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RatingsPageRoutingModule } from './history-routing.module';

import { HistoryPage } from './history.page';
import { GlobalModule } from 'src/app/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingsPageRoutingModule,
    GlobalModule
  ],
  declarations: [HistoryPage]
})
export class RatingsPageModule {}
