import { WoShopService } from "../../../../service/wo.shop.service";
import { HttpProvider } from "../../../../providers/http";
import { AppCache } from "../../../../app/app.cache";
import { IonicPage,NavController, NavParams, Searchbar} from "ionic-angular";
import { Component, ViewChild } from "@angular/core";
import { AppShopping } from "../../../../app/app.shopping";
import { WebSocketService } from "../../../../service/webSocketService";

@IonicPage()
@Component({
  selector: 'page-customer-search',
  templateUrl: 'customer-search.html',
})

export class CustomerSearchPage {
  searchText: string;
  showSearch: boolean = true;
  customerList: any[] = [];
  appShopping: AppShopping;
  isReCharge:boolean =  false;//是否充值
  @ViewChild('searchbar') searchbar: Searchbar;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public appCache: AppCache,
    public woShopService: WoShopService, public webSocketService: WebSocketService
  ) {
  }

  ngOnInit(){
    this.isReCharge = this.navParams.get('isReCharge');
  }
  ionViewDidLoad() {
    this.focusInput();
  }
  ionViewDidEnter(){
    setTimeout(() => {
      this.searchbar.setFocus();//输入框获取焦点
    });
  }
  ionViewWillLeave() {
  }
  focusInput() {
    var idInput = document.getElementById("input");
    idInput.onkeyup = (event) => {
      if (event.keyCode == 13) {
        //执行相应的方法
        this.search();
      }
    }

  }
  search() {
    this.customerList.length = 0;
    // console.log(this.appCache);
    // this.getData();
    // 查询会员
    this.webSocketService.sendObserveMessage("QUERYCUSTOMER", { flag: false, keyword: this.searchText }).subscribe(retData => {
      if (retData.success) {
        if (retData.data && retData.data.length <= 0) { this.http.showToast("未查询到会员!"); }
        else {
          this.customerList = retData.data;
          // console.log(this.customerList);
        }
      }
    });
    /* this.appShopping.customerList.forEach(customer => {
      if (customer.custCode.indexOf(this.searchText) > -1 || customer.custName.indexOf(this.searchText) > -1 || customer.custMobile.indexOf(this.searchText) > -1) {
        this.customerList.push(customer);
      }
    });*/
  }


  //详情界面
  goToInfo(customer) {
    if(this.isReCharge){
      console.log(customer);
      this.navCtrl.getPrevious().data.myNewKey = customer;
      this.navCtrl.pop();
      // this.navCtrl.pop({ customer: customer});
    }else{
      this.navCtrl.push('CustomerInfoPage', { customer: customer, searchNav: this.navCtrl.getActive() })
    }
    

  }

}
