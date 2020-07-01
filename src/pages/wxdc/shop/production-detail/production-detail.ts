import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { AppCache } from '../../../../app/app.cache';
import { WoShopDetailSpecPage } from '../wo-shop-detail-spec/wo-shop-detail-spec';


@Component({
    selector: 'page-production-detail',
    templateUrl: 'production-detail.html'
})

export class ProductionDetailPage {
    dds: boolean = true;
    bbs: boolean = false;
    myIcon: string = "home";
    productionName: string;
    productionIntroduce: string;

    configuration: {} = this.appCache.Configuration;
    noScrolling: boolean = false;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public appCache: AppCache,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController) {

    }
    ngAfterViewInit() {
        console.log('After view init');
        console.log(this.navParams);
        //初始化菜品信息
        this.productionName = this.navParams.get('itemName');
        this.productionIntroduce = this.navParams.get('retailPrice')
    }
    //点击切换
    qi(e) {
        console.log(e.target);
    }
    //选择规格 模态框
    selectSpec(comSpu) {
        // this.noScrolling = true;
        // alert(this.noScrolling)

        if (this.configuration['DP_DP']) {
            this.navCtrl.push(WoShopDetailSpecPage, { comSpu: JSON.stringify(comSpu), isShowSlab: true });
        } else {
            let modal = this.modalCtrl.create(WoShopDetailSpecPage, { comSpu: JSON.stringify(comSpu) }, {
                cssClass: 'custom-modal3'
                // enterAnimation: 'modal-scale-enter',
                // leaveAnimation: 'modal-scale-leave'
            });
            modal.onDidDismiss((data) => {
                this.noScrolling = false;
            });
            modal.present();
        }
    }

}