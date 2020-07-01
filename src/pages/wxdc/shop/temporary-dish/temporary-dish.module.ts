import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TemporaryDishPage } from './temporary-dish';
import { SharesModule } from '../../../../share/shares.module';

@NgModule({
  declarations: [
    TemporaryDishPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(TemporaryDishPage),
  ],
})
export class TemporaryDishPageModule { }
