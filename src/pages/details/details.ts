import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as _ from 'lodash';
import { Chart } from 'chart.js';
import { Storage } from '@ionic/storage';

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
  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  favorites: any[] = [];
  isAdded: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public DataFactory: ServiceProvider, public loadingCtrl: LoadingController, public storage: Storage, public alertCtrl: AlertController) {
    this.item = this.navParams.get('crypto');
    storage.get('favorites').then((val) => {
      if (!_.isEmpty(val)) {
        this.favorites = val;
        let res = _.find(this.favorites, { id: this.item.id });
        if (res) {
          this.isAdded = true;
        }
      }
    });
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

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              label: "My First dataset",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [65, 59, 80, 81, 56, 55, 40],
              spanGaps: false,
            }
          ]
        }

      });
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 600);
  }

  addToFav(item) {
    console.log('addToFav: ', item);
    let res = _.find(this.favorites, { id: item.id });
    if (res) {
      this.favorites = _.reject(this.favorites, { id: item.id });
      this.storage.set('favorites', this.favorites);
      this.isAdded = false;
      let alert = this.alertCtrl.create({
        title: 'Favorites',
        subTitle: 'Cryptocurrency remove on favorites!',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.favorites.push({
      id: item.id
    });
    this.storage.set('favorites', this.favorites);
    this.isAdded = true;
    let alert = this.alertCtrl.create({
      title: 'Favorites',
      subTitle: 'Cryptocurrency added as favorites!',
      buttons: ['OK']
    });
    alert.present();
  }

}
