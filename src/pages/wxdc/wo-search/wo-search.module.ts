import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoSearchPage } from './wo-search';
import { SharesModule } from '../../../share/shares.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    WoSearchPage,
  ],
  imports: [
    SharesModule,
    LazyLoadImageModule,
    IonicPageModule.forChild(WoSearchPage),
  ],
})
export class WoSearchPageModule { }
