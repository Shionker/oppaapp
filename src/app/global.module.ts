import { NgModule } from '@angular/core';
import { LoadingPipe } from 'src/app/pipes/loading/loading.pipe';
import { RutParsePipe } from 'src/app/pipes/rut-parser/rut-parser.pipe';
import { ErrorComponent } from './components/error/error.component';
import { OrderByPipe } from './pipes/orderBy/order-by.pipe';

@NgModule({
  declarations: [
    LoadingPipe,
    ErrorComponent,
    RutParsePipe,
    OrderByPipe
  ],
  exports: [
    LoadingPipe,
    ErrorComponent,
    RutParsePipe,
    OrderByPipe
  ]
})
export class GlobalModule {}
