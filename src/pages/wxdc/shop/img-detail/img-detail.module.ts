import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImgDetailPage } from './img-detail';
import { SharesModule } from '../../../../share/shares.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  declarations: [
    ImgDetailPage,
  ],
  imports: [
    SharesModule,
    LazyLoadImageModule,
    IonicPageModule.forChild(ImgDetailPage),
  ],
})
export class ImgDetailPageModule {}
