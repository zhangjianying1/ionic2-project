import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Platform, LoadingController } from 'ionic-angular';
import { publicUtil } from './publicutil';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class Request{
  public isConnect: boolean = true;
  constructor(
    private device: Device,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private network: Network,
    private http: Http
  ){}

  post(cmd, func, data?, callback?) {
      return new Promise((resolve, reject) => {
        let json = {
          cmd: cmd + '',
          func: func + '',
          machId:  this.device.uuid || '',
          token: publicUtil.store.getData('token') || '',
          msg: data || {a: 1}
        };


        let loading = this.loadingCtrl.create({
          spinner: 'ios',
          content: '加载中...',
          dismissOnPageChange: false
        });

        //loading.present();
        if (json.machId) {


          // watch network for a disconnect
          let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            this.isConnect = false;
          });

          // stop disconnect watch
          disconnectSubscription.unsubscribe();

          let connectSubscription = this.network.onConnect().subscribe(() => {
            this.isConnect = true;
          });

          // stop connect watch
          connectSubscription.unsubscribe();

          if (this.isConnect) {

            (<any>window).http.httpPost('http://interface.kxcp.com/interface', json, (res)  => {

              let tempRes: any = {};
              try {
                tempRes = JSON.parse(res);
              } catch (e) {

              } finally {

                if (tempRes['code'] == '0000') {
                  resolve(tempRes['result'] || {});
                } else {
                  resolve(tempRes);
                }
                loading.dismiss();
              }




            }, (reason)  => {

              reject(reason);

            })
          } else {
            // 没有网络
            resolve({"code": "8888"})
          }


        } else {


          let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
          });
          let options = new RequestOptions({
            headers: headers
          });
          let body= "msg=" + JSON.stringify(json);


            this.http.post('http://192.168.1.101:3300/h5/interface', body, options )
              .subscribe((data) => {

                data = JSON.parse(data['_body']);


                if (data['code'] == '0000') {
                  resolve(data['result'] || {});
                } else {
                  resolve(data);
                }
                loading.dismiss()

              }, (err) => {

                reject(err)
              })

        }
      })
    }

  //  serialPost(cmd, func, data, hideError){
  //
  //  var bBtn = true,
  //    deferred = $q.defer();
  //
  //  if (bBtn) {
  //    bBtn = false;
  //    this.post(cmd, func, data, hideError).then(function(re){
  //      deferred.resolve(re);
  //      bBtn = true;
  //    }, function(re){
  //
  //      deferred.reject(re);
  //      bBtn = true;
  //    });
  //    return deferred.promise;
  //  }
  //
  //
  //}
}


