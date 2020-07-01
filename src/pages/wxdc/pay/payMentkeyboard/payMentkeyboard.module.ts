import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayMentkeyboardPage } from './payMentkeyboard';
import { SharesModule } from '../../../../share/shares.module';

@NgModule({
  declarations: [
    PayMentkeyboardPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(PayMentkeyboardPage),
  ],
})
export class PayMentkeyboardPageModule { }
