import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController  } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { SalesCampaign } from '../../../../domain/sales-campaign';
import { UtilProvider } from '../../../../providers/util/util';
import { AppShopping } from '../../../../app/app.shopping';
import { SalesDetail } from '../../../../domain/salesDetail';
import { HttpProvider } from '../../../../providers/http';
import { WebSocketService } from '../../../../service/webSocketService';
/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-setSalesDetailNumber',
  templateUrl: 'setSalesDetailNumber.html',
})
export class SetSalesDetailNumberPage {
  str: string = '';
  item: any = { number: '0', isClear: false };
  salesDetail: any = {};
  /**是否退菜 */
  isRetreatFood: boolean = false;
  returnReasonList:Array<any>;//获取退菜原因
  returnReason:any;//退菜原因
  testRadioOpen:boolean;
  testRadioResult:any;
  // isAll:boolean;//是否为全部退菜

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public webSocketService: WebSocketService,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public alertCtrl: AlertController,
    public navParams: NavParams) {
  }

  ngOnInit(){
    //获取退菜原因
    this.webSocketService.getReturnReason({}).subscribe(res=>{
      console.log(res);
      this.returnReasonList = res.data.data;
    })
  }
  ionViewWillEnter() {
    this.salesDetail = this.navParams.get('salesDetail');
    this.item = this.navParams.get('item');
  }


  ionViewDidEnter() {

    // this.getOffsetTops();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad KeyboardPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  confirm() {
    if(!this.returnReason || this.returnReason == ""){
      this.http.showToast('请填写退菜原因！');
      return;
    }
    this.viewCtrl.dismiss({ data: this.item.number, flag: true,reason:this.returnReason });
  }

  //退菜原因双向绑定
  reasonClick(){
    let alert = this.alertCtrl.create();
    alert.setTitle('请选择退菜原因');
    for(let i = 0; i < this.returnReasonList.length;i++){
      alert.addInput({
        type: 'radio',
        label: this.returnReasonList[i].bizReason,
        value: this.returnReasonList[i].bizReason,
      });
    }
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        this.returnReason = data;
      }
    });
    alert.present();
  }

}
