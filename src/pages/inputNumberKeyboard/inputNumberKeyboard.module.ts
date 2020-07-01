import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InputNumberKeyboardPage } from './inputNumberKeyboard';
import { SharesModule } from '../../share/shares.module';


@NgModule({
  declarations: [
    InputNumberKeyboardPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(InputNumberKeyboardPage),
  ],
})
export class InputNumberKeyboardPageModule { }
