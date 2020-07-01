import { Injectable } from '@angular/core';
// import { Orders } from '../model/order';

/*
  Generated class for the WoOrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WoOrderService {

	orderList: Array<any> = [];

	orderDetail: any = {
	}
	constructor() {
		console.log('Hello WoOrderProvider Provider');
	}

}
