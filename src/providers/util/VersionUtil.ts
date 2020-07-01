import { Inject, Injectable } from '@angular/core';
import { AlertController, Platform } from "ionic-angular";
import { FileOpener } from "@ionic-native/file-opener";
import { HttpProvider } from "../http";
import { Transfer, TransferObject } from "@ionic-native/transfer";
import { APP_CONFIG, AppConfig } from "../../app/app.config";
import { File } from "@ionic-native/file";
import { UtilProvider } from "./util";
import { AppConstants } from '../../app/app.constants';

/*
版本管理
*/
@Injectable()
export class VersionUtil {
  private fileTransfer: TransferObject;
  constructor(@Inject(APP_CONFIG) private config: AppConfig, private file: File, private fileOpener: FileOpener, public alertCtrl: AlertController,
    private transfer: Transfer, public httpProvider: HttpProvider, public platform: Platform, private util: UtilProvider, public appConstants: AppConstants) {

  }

  // 版本更新
  public openUpdateVersion(isShowTip: boolean = false) {

    var me = this;
    var optSystem = this.platform.versions().ios ? "vorder-ios" : "vorder-apk";
    this.httpProvider.checkAgentVersion(optSystem, isShowTip).subscribe(res => {

      if (res["code"] == 0) {
        if (res["data"].versionNum != this.appConstants.VERSION) {

          if (this.platform.versions().ios) {
            let alertCtrl = me.alertCtrl.create({
              title: '新版本' + res['data'].versionNum,
              message: res['data'].verDesc,
              cssClass: 'alert-log',
              buttons: [
                {
                  text: '取消',
                  role: 'cancel',
                  handler: () => {
                    console.log('取消');
                  }
                },
                {
                  text: '前往下载',
                  handler: () => {
                    window.open(this.appConstants.APP_STORE_URL);
                  }
                }
              ]
            });
            alertCtrl.present();
          } else {
            let alertCtrl = me.alertCtrl.create({
              title: '新版本' + res['data'].versionNum,
              message: res['data'].verDesc,
              cssClass: 'alert-log',
              buttons: [
                {
                  text: '取消',
                  role: 'cancel',
                  handler: () => {
                    console.log('取消');
                  }
                },
                {
                  text: '更新',
                  handler: () => {
                    let isOut = false;
                    let path = '';
                    if (res["data"].outDownUrl && res["data"].outDownUrl != '') {
                      isOut = true;
                      path = res["data"].outDownUrl;
                    } else {
                      path = me.config.UCENTER_SERVICE + "/ucenter/VerMgr/download?sysId=" + res["data"].id;
                    }
                    me.loadAPP(path, isOut);
                  }
                }
              ]
            });
            alertCtrl.present();
          }
        } else {
          if (isShowTip) {
            this.util.showAlert("提示", "当前已是最新版本!");
          }
        }
      } else {
        if (isShowTip) {
          this.util.showAlert("提示", "当前已是最新版本!");
        }
      }
    }, error => {
      if (isShowTip) {
        this.util.showAlert("提示", "当前已是最新版本!");
      }
    })
  }

  // 版本更新
  public UpdateVersion(isShowTip: boolean = false) {

    var me = this;
    var optSystem = this.platform.versions().ios ? "vorder-ios" : "vorder-apk";
    this.httpProvider.checkAgentVersion(optSystem, false).subscribe(res => {

      if (res["code"] == 0) {
        if (res["data"].versionNum != this.appConstants.VERSION) {

          if (this.platform.versions().ios) {
            let alertCtrl = me.alertCtrl.create({
              title: '版本过低，请更新！',
              message: res['data'].verDesc,
              cssClass: 'alert-log',
              buttons: [
                {
                  text: '前往下载',
                  handler: () => {
                    window.open(this.appConstants.APP_STORE_URL);
                  }
                }
              ]
            });
            alertCtrl.present();
          } else {
            let alertCtrl = me.alertCtrl.create({
              title: '版本过低，请更新！',
              message: res['data'].verDesc,
              cssClass: 'alert-log',
              buttons: [
                {
                  text: '更新',
                  handler: () => {
                    let isOut = false;
                    let path = '';
                    if (res["data"].outDownUrl && res["data"].outDownUrl != '') {
                      isOut = true;
                      path = res["data"].outDownUrl;
                    } else {
                      path = me.config.UCENTER_SERVICE + "/ucenter/VerMgr/download?sysId=" + res["data"].id;
                    }
                    me.loadAPP(path, isOut);
                  }
                }
              ]
            });
            alertCtrl.present();
          }
        } else {
          if (isShowTip) {
            this.util.showAlert("提示", "版本过低，请等待新版本发布！");
          }
        }
      } else {
        if (isShowTip) {
          this.util.showAlert("提示", "版本过低，请等待新版本发布！");
        }
      }
    }, error => {
      if (isShowTip) {
        this.util.showAlert("提示", "版本过低，请等待新版本发布！");
      }
    })
  }

  // 下载app
  public loadAPP(path: string, isOut: boolean = false) {
    if (!this.fileTransfer) {
      this.fileTransfer = this.transfer.create();
    }
    let alertCtrl = this.alertCtrl.create({
      title: '下载进度：0%',
      enableBackdropDismiss: false
      //buttons: ['后台下载']
    });
    alertCtrl.present();
    // 进度
    this.fileTransfer.onProgress((event) => {
      if (event.lengthComputable) {
        //进度，这里使用文字显示下载百分比
        var downloadProgress = (event.loaded / event.total) * 100;
        let title = document.getElementsByClassName('alert-title')[0];
        title && (title.innerHTML = '下载进度：' + Math.floor(downloadProgress) + '%');

        if (downloadProgress > 99) {
          alertCtrl.dismiss();
        }
      } else {
        let title = document.getElementsByClassName('alert-title')[0];
        title && (title.innerHTML = '安装文件下载中，请稍后......');
      }
    });
    if (isOut) {

    } else {
      path += "&t=" + new Date().getTime();
    }

    console.log(path)

    let targetPath = this.file.externalApplicationStorageDirectory + "aibaoapp.apk";
    // 下载
    this.fileTransfer.download(path, targetPath, true).then((entry) => {
      alertCtrl.dismiss();
      this.fileOpener.open(targetPath, 'application/vnd.android.package-archive').then(() => {
        //this.platform.exitApp()
      }, (error) => {
        this.util.showAlert("提示", "打开文件失败, 文件可能不完整!");
      });
    }, (error) => {
      console.log(error);
      //alert(error.code)
      if (error.code == 1) {
        this.util.showAlert("提示", "请开启手机的储存权限[设置->应用管理->爱宝点菜宝->权限->打开储存]");
      } else if (error.code == 3) {
        this.util.showAlert("提示", "储存空间不足，更新失败!");
      } else {
        this.util.showAlert("提示", "更新失败!");
      }
      alertCtrl.dismiss();
    });

  }

  isWindows() {
    var isAndroid = this.platform.is("android");
    var isIos = this.platform.is("ios");
    if (!isAndroid && !isIos) {
      return true;
    }
    return false;
  }
}
