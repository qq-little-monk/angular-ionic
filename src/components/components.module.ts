import { NgModule } from '@angular/core';
import { SelectCommodityComponent } from './select-commodity/select-commodity';
import { IonicModule } from 'ionic-angular';
import { WoCartTabComponent } from './wo-cart-tab/wo-cart-tab';
import { WoOrderBtnComponent } from './wo-order-btn/wo-order-btn';
import { WoCartModalComponent } from './wo-cart-modal/wo-cart-modal';
import { OrderBtnComponent } from './order-btn/order-btn';
import { SelectPaymentComponent } from './selectpayment/selectpayment';
import { AdditionBtnComponent } from './addition-btn/addition-btn';
import { CarBtnComponent } from './car-btn/car-btn';
import { NumberKeyboardComponent } from './number-keyboard/number-keyboard';
import { ComboBtnComponent } from './combo-btn/combo-btn';
import { DirectivesModule } from '../directives/directives.module';
import { MenuPage } from '../pages/menu/menu';
import { CustomPopupComponent } from './custom-popup/custom-popup';
// import { TemporaryDishComponent } from './temporary-dish/temporary-dish';



@NgModule({
	declarations: [SelectCommodityComponent,
		OrderBtnComponent,
		AdditionBtnComponent,
		NumberKeyboardComponent,
		CustomPopupComponent,
		// TemporaryDishComponent,
		CarBtnComponent,
		WoCartTabComponent,
		WoOrderBtnComponent,
		WoCartModalComponent,
		SelectPaymentComponent,
		ComboBtnComponent,
		MenuPage,
		

	],
	imports: [IonicModule, DirectivesModule,],
	exports: [SelectCommodityComponent,
		OrderBtnComponent,
		AdditionBtnComponent,
		NumberKeyboardComponent,
		CustomPopupComponent,
		// TemporaryDishComponent,
		CarBtnComponent,
		WoCartTabComponent,
		WoOrderBtnComponent,
		WoCartModalComponent,
		SelectPaymentComponent,
		ComboBtnComponent,
		MenuPage,
		
	]
})
export class ComponentsModule { }
