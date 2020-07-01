import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IpInputPage } from './ip-input';
import { SharesModule } from '../../../share/shares.module';


@NgModule({
  declarations: [
    IpInputPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(IpInputPage),
  ],
})
export class IpInputPageModule { }
