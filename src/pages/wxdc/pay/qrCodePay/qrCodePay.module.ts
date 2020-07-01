import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCodePayPage } from './qrCodePay';
import { SharesModule } from '../../../../share/shares.module';
import { FormsModule }   from '@angular/forms';


@NgModule({
    declarations: [
        QrCodePayPage
    ],
    imports: [
        FormsModule,
        SharesModule,
        IonicPageModule.forChild(QrCodePayPage)
    ]
})

export class QrCodePayModule{}