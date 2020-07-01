import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerPage } from './customer';
import { SharesModule } from '../../../../share/shares.module';
@NgModule({
    declarations: [
        CustomerPage,
    ],
    imports: [
        SharesModule,
        IonicPageModule.forChild(CustomerPage),
    ],
})
export class CustomerPageModule {}
