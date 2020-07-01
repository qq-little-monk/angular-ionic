import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductionDetailPage} from './production-detail';
import { SharesModule } from '../../../../share/shares.module';

@NgModule({
  declarations: [
    ProductionDetailPage
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(ProductionDetailPage),

  ],
  exports: [
  ]
})
export class ProductionDetailModule { }
