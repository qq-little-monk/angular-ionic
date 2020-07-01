import { Injectable } from '@angular/core';
import { SalesTable } from '../domain/salesTable';
import { UtilProvider } from '../providers/util/util';
import { AppCache } from '../app/app.cache';
import { AppShopping } from '../app/app.shopping';
import { WoShopService } from './wo.shop.service';
import { AlertController, App, Events } from 'ionic-angular';
// import { WO_SHOP_DETAIL_PAGE } from '../pages/pages.constants';
import { WebSocketService } from './webSocketService';
import { HttpProvider } from '../providers/http';
import { Observable } from 'rxjs';
import { AppPermission } from '../app/app.permission';

// import { WoShopDetailPage } from '../pages/wxdc/shop/wo-shop-detail/wo-shop-detail';

/*
  Generated class for the WoOrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TableService {
	alertCtrlShow: boolean = false;
	constructor(
		public utilProvider: UtilProvider,
		public appCache: AppCache,
		public appShopping: AppShopping,
		public woShopService: WoShopService,
		public webSocketService: WebSocketService,
		public http: HttpProvider,
		public alertCtrl: AlertController,
		public appPer: AppPermission,
		public events: Events,
		// public navContr:NavController,
		public app: App,

	) {
		console.log('Hello WoOrderProvider Provider');
		// this.events.subscribe('spu:refresh', (EventData) => {
		// 	this.refreshSpuDataForSoudout();
		// });
	}


	/**
 * 
 * @param area 
 * @param tab 
 * @param manNumber 
 * @param salesh 
 */
	buildStayTable(tab, manNumber, teaAmt, deposit,remaker) {
		let salesTable = new SalesTable();
		salesTable.id = this.utilProvider.getUUID();
		salesTable.originSalesId = '';
		salesTable.personNum = manNumber || '';
		salesTable.preAmt = deposit || '';
		salesTable.status = 0;
		salesTable.storeId = this.appCache.store.id ? this.appCache.store.id : '';
		salesTable.storeSysCode = this.appCache.store.storeSysCode ? this.appCache.store.storeSysCode : '';
		salesTable.tableCode = tab.tableCode || '';
		salesTable.tableId = tab.id || '';
		salesTable.tableName = tab.tableName || '';
		salesTable.teaAmt = teaAmt || '';
		salesTable.remark = remaker;
		salesTable.ttlTeaAmt = this.utilProvider.accMul(teaAmt, manNumber);
		salesTable.virtualId = '';
		salesTable.areaCode = tab.areaCode || '';
		salesTable.areaId = tab.areaId || '';
		salesTable.areaName = tab.areaName || '';
		salesTable.createdBy = this.appShopping.staff ? this.appShopping.staff.staffName : '';
		salesTable.createdTime = this.utilProvider.getNowTime();
		salesTable.handoverDate = this.appShopping.handoverh.handoverDate;
		salesTable.handoverId = this.appShopping.handoverh.id;
		if (tab.tmpSalesTableList && tab.tmpSalesTableList.length > 0) {
			debugger
			let list = tab.tmpSalesTableList;
			salesTable.virtualId = this.getVirtualId(list);
		}
		return salesTable
	}
	/**
	 * 
	 * @param area 
	 * @param tab 
	 * @param manNumber 
	 * @param salesh 
	 */
	buildSalesTable(area, tab, manNumber, salesh, teaAmt, deposit,remark) {
		let salesTable = new SalesTable();
		salesTable.id = this.utilProvider.getUUID();
		salesTable.originSalesId = '';
		salesTable.personNum = manNumber || '';
		salesTable.preAmt = deposit || '';
		salesTable.salesAmt = salesh.salesAmt || '';
		salesTable.salesId = salesh.id || '';
		salesTable.status = 0;
		salesTable.storeId = this.appCache.store.id ? this.appCache.store.id : '';
		salesTable.storeSysCode = this.appCache.store.storeSysCode ? this.appCache.store.storeSysCode : '';
		salesTable.tableCode = tab.tableCode || '';
		salesTable.tableId = tab.id || '';
		salesTable.remark = remark;
		salesTable.tableName = tab.tableName || '';
		salesTable.teaAmt = teaAmt || '';
		salesTable.ttlTeaAmt = this.utilProvider.accMul(teaAmt, manNumber);
		salesTable.virtualId = '';
		salesTable.areaCode = tab.areaCode || '';
		salesTable.areaId = tab.areaId || '';
		salesTable.areaName = tab.areaName || '';
		salesTable.createdBy = this.appShopping.staff ? this.appShopping.staff.staffName : '';
		salesTable.createdTime = this.utilProvider.getNowTime();
		salesTable.handoverDate = this.appShopping.handoverh.handoverDate;
		salesTable.handoverId = this.appShopping.handoverh.id;
		return salesTable
	}


	/**将销售table赋给table
	 * table.tmpSalesTableList = []; 销售tablelist
	 * table.tmpManNumber = 0;    本桌人数
	 * table.tmpPrice = 0;        本桌消费金额 
	 */
	selectTableOnTable() {
		this.appShopping.tableList.forEach(table => {
			table.tmpSalesTableList = [];
			table.tmpManNumber = 0;
			table.tmpPrice = 0;
			this.appShopping.salesTableList.forEach(salesTable => {
				if (salesTable.tableId == table.id) {
					table.tmpSalesTableList.push(salesTable);
					table.tmpManNumber = this.utilProvider.accAdd(table.tmpManNumber, salesTable.personNum);
					table.tmpPrice = this.utilProvider.accAdd(table.tmpPrice, salesTable.salesAmt);
				}

			});
		});
	}

	stayTab(tab, manNumber, teaAmt, deposit,remark) {
		let salesTable = this.buildStayTable(tab, manNumber, teaAmt,deposit, remark);
		this.appShopping.salesTable = salesTable;
	}
	/**
	 * 开台下单单
	 * 
	 */
	stayEntryOrders() {
		let retalTotalMoney = this.woShopService.getRetalTotalMoney();
		let salesTotalMoney = this.woShopService.getSalesTotalMoney();
		this.woShopService.beforSubmitBuildData(retalTotalMoney, salesTotalMoney, 0, 0);
		let salesTable = this.appShopping.salesTable;
		let salesh = this.appShopping.salesh;
		// salesh.teaAmt = salesTable.teaAmt;
		salesh.ttlTeaAmt = salesTable.ttlTeaAmt;
		salesh.personNum = salesTable.personNum;
		salesh['tableInfo'] = salesTable.areaName + '(' + salesTable.areaCode + ")" + salesTable.tableName + '(' + salesTable.tableCode + ")";
		let datas = {
			salesH: this.appShopping.salesh,
			salesDetail: this.appShopping.salesDetailList,
			salesCampaign: this.appShopping.salesCampaignList,
			salesTable: salesTable,
		}
		return datas
	}
	/**
	 * 选桌下单单
	 * @param area 
	 * @param tab 
	 * @param manNumber 
	 * @param salesh 
	 * @teaAmt 茶位费
	 * @deposit 押金
	 */
	entryOrders(area, tab, manNumber, salesh, teaAmt, deposit,remark?) {
		let retalTotalMoney = this.woShopService.getRetalTotalMoney();
		let salesTotalMoney = this.woShopService.getSalesTotalMoney();
		this.woShopService.beforSubmitBuildData(retalTotalMoney, salesTotalMoney, 0, 0);
		console.log(this.appShopping.salesh);

		let salesTable = this.buildSalesTable(area, tab, manNumber, salesh, teaAmt,deposit,remark);
		// salesh.teaAmt = salesTable.teaAmt;
		salesh.ttlTeaAmt = salesTable.ttlTeaAmt;
		salesh.personNum = salesTable.personNum;
		salesh.tableInfo = tab.areaName + '(' + tab.areaCode + ")" + tab.tableName + '(' + tab.tableCode + ")";
		let datas = {
			salesH: this.appShopping.salesh,
			salesDetail: this.appShopping.salesDetailList,
			salesCampaign: this.appShopping.salesCampaignList,
			salesTable: salesTable,
		}
		if (tab.tmpSalesTableList.length > 0) {
			let list = tab.tmpSalesTableList;
			datas.salesTable.virtualId = this.getVirtualId(list);
		}

		return datas
	}
	getVirtualId(list) {
		// if (list) {
		// 	list.sort(function (m, n) {
		// 		if (m.virtualId < n.virtualId) return 1
		// 		else if (m.virtualId > n.virtualId) return -1
		// 		else return 0
		// 	});
		// }
		let number = 0;
		let ishave = false;
		if (list.length > 0) {
			for (let i = 0; i < list.length; i++) {
				// let number = i
				if (i > 0 && i != list[i].virtualId) {
					ishave = true;
					return i;
				} else {
					if (i == 0) {
						number = 0;
					} else {
						number = i;
					}

				}

			}
			if (!ishave) {
				return number + 1;
			}

		} else {
			return '';
		}


	}


	/**加菜 */
	addItemForSalesTable(number, salesTable, salesh, teaAmt) {
		let retalTotalMoney = this.woShopService.getRetalTotalMoney();
		let salesTotalMoney = this.woShopService.getSalesTotalMoney();
		this.woShopService.beforSubmitBuildData(retalTotalMoney, salesTotalMoney, 0, 0, false, true);
		salesTable.personNum = number;
		salesTable.teaAmt = teaAmt;
		salesTable.ttlTeaAmt = this.utilProvider.accMul(number, teaAmt);
		// salesh.teaAmt = salesTable.teaAmt;
		salesh.ttlTeaAmt = salesTable.ttlTeaAmt;
		salesh.personNum = salesTable.personNum;
		salesh.salesTime = this.utilProvider.getNowTime();
		salesh.lastUpdateBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
		let datas = {
			salesH: salesh,
			salesDetail: this.appShopping.salesDetailList,
			salesCampaign: this.appShopping.salesCampaignList,
			salesTable: salesTable,
		}
		return datas
	}

	/**不取单加菜 */
	addItemBySalesTable(salesTable, salesh) {
		let salesTotalMoney = this.woShopService.getSalesTotalMoney();
		this.appShopping.salesh.salesAmt = salesTotalMoney;
		this.appShopping.salesh.payAmt = 0;
		this.appShopping.salesh.changeAmt = 0;
		this.appShopping.salesh.payStatus = 0;

		this.appShopping.salesDetailList.forEach(salesDetail => {
			salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);

			salesDetail.salesId = salesh.id;
			salesDetail.originSalesId = salesTable.originSalesId;
			salesDetail.salesNo = salesh.salesNo;
			salesDetail.salesDate = salesh.salesDate;
			salesDetail.status = salesh.status;
			salesDetail.itemStatus = 1;
			salesDetail.salesYear = salesh.salesYear;
			salesDetail.salesMonth = salesh.salesMonth;
			salesDetail.salesType = salesh.salesType;
			salesDetail.orderType = salesh.orderType;
			salesDetail.salesTime = salesh.salesTime;

		});
		this.appShopping.salesCampaignList.forEach(salesCampaign => {
			salesCampaign.salesId = salesh.id;
			salesCampaign.salesAmt = salesTotalMoney;
			salesCampaign.retailAmt = salesTotalMoney;
		});
		// salesTable.salesId = salesh.id;
		// console.log(this.appShopping.salesh);
		// console.log('this.appShopping.salesh');
		salesh.remark = this.appShopping.salesh.remark || '' + salesh.remark || '';
		salesh.salesTime = this.utilProvider.getNowTime();
		salesh.lastUpdateBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
		let datas = {
			salesH: salesh,
			salesDetail: this.appShopping.salesDetailList,
			salesCampaign: this.appShopping.salesCampaignList,
			salesTable: salesTable,
		}
		return datas
	}

	beforSubmitBuildData(salesTable) {

	}

	doConfirmByOrder(nav?, call?) {
		if (this.alertCtrlShow) {
			return;
		}
		this.alertCtrlShow = true;
		let alert = this.alertCtrl.create({
			title: '提示',
			message: '该订单状态发生改变',
			// enableBackdropDismiss: false,
			buttons: [
				{
					text: '确定',
				},
			]
		});
		alert.present();
		alert.onWillDismiss(data => {
			this.appShopping.clearOdear();
			this.alertCtrlShow = false;
			call && call();
			// if (this.app.getActiveNavs != this.app.getRootNav()) {
			// 	// this.app.getRootNav().setRoot(WO_SHOP_DETAIL_PAGE, {}, { animate: false, direction: 'back' });
			// 	this.app.getActiveNav().popToRoot();
			// 	// this.navContr.popToRoot();
			// }
		});
	}
	doConfirmByData(nav?) {
		if (this.alertCtrlShow) {
			return Observable.create(obs => {
				return obs.next(false);
			})
		} else {
			this.alertCtrlShow = true;
			return Observable.create(obs => {
				if (this.alertCtrlShow) {
					// return;
					obs.next(false);
				}
				this.alertCtrlShow = true;
				let alert = this.alertCtrl.create({
					title: '提示',
					message: '订单数据改变，更新数据!',
					// enableBackdropDismiss: false,
					buttons: [
						{
							text: '确定',
						},
					]
				});
				alert.present();
				alert.onWillDismiss(data => {
					obs.next(true);
					this.alertCtrlShow = false;
				});

			}, err => {
			})
		}
	}
	refreshData(dataName) {
		dataName = dataName || '*';
		let me = this;
		me.webSocketService.sendObserveMessage("LOADDATA", dataName, { content: '正在刷新数据...' }).subscribe(function (retData) {
			if (retData && retData.success) {
				me.woShopService.assignmentData(retData);
				// me.woShopService.assignmentDataAboutStore(retData);
				me.http.showToast('数据刷新成功!');
				let tabName = ['pos_store', 'pos_cashier', 'pos_staff', 'pos_handoverh', 'pos_storeparam']
				me.webSocketService.sendObserveMessage("LOADDATA", tabName, { isShowing: false }).subscribe(function (retData) {
					console.log(retData);
					if (retData.success) {
						me.woShopService.assignmentDataAboutStore(retData);
					}

				})
			}
		});
	}

	refreshSpuDataForSoudout(dataName?) {
		// console.log('qqqqqqqqqqqqq');
		dataName = ['pos_item_spu'];
		let me = this;
		me.webSocketService.sendObserveMessage("LOADDATA", dataName, { content: '正在刷新数据...', isShowing: false }).subscribe(function (retData) {
			if (retData && retData.success) {
				me.woShopService.assignmentData(retData);
			}
		});
	}
}
