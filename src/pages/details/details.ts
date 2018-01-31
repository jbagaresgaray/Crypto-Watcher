import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import * as _ from 'lodash';

import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  item: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public DataFactory: ServiceProvider, public loadingCtrl: LoadingController) {
    this.item = this.navParams.get('crypto');
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.DataFactory.getTickerById(this.item.id).then((data: any) => {
      console.log('ticker: ', data);
      if (!_.isEmpty(data) && data.length > 0) {
        data = data[0];
        data.daily_volume_usd = data['24h_volume_usd'];
        data.img = './assets/icon/' + data.symbol + '.png'
        this.item = data;
      }
    }, (error) => {
      loading.dismiss();
    }).then(() => {
      loading.dismiss();
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 600);
  }

}
