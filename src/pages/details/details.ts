import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  showGraph: boolean = false;
  actions: string = '/1day';

  price_data: any[] = [];
  price_labels: any[] = [];
  marketcap_data: any[] = [];
  marketcap_labels: any[] = [];
  volume_data: any[] = [];
  volume_labels: any[] = [];

  lineChartOptions: any = {
    responsive: true,
    animation: false,
    tooltipEvents: [
      'mousemove',
      'touchstart',
      'touchmove'
    ],
    elements: {
      point: { radius: 0 },
      line: { fill: false }
    },
    scales: {
      yAxes: [{ display: true }],
      xAxes: [{ display: false }]
    }
  };
  lineChartColors: Array<any> = [{
    backgroundColor: '#A1ADDC ',
    borderColor: '#525CAB',
    pointBackgroundColor: '#525CAB',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#525CAB'
  }];
  lineChartLegend: boolean = false;
  lineChartType: string = 'line';

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
      if (!_.isEmpty(data) && data.length > 0) {
        data = data[0];
        data.daily_volume_usd = data['24h_volume_usd'];
        data.img = './assets/icon/' + data.symbol + '.png'
        this.item = data;
      }
    }, (error) => {
      // loading.dismiss();
    }).then(() => {
      loading.dismiss();
    });

    this.DataFactory.getChartData(this.actions, this.item.symbol).then((data: any) => {
      console.log('data: ', data);
      let datePipe = new DatePipe('en-US');
      if (!_.isEmpty(data)) {
        this.showGraph = true;
        if (data.price && data.price.length > 0) {
          _.each(data.price, (value: any) => {
            this.price_data.push(value[1]);
            this.price_labels.push(datePipe.transform(value[0], 'medium'));
          });
          _.each(data.volume, (value: any) => {
            this.volume_data.push(value[1]);
            this.volume_labels.push(datePipe.transform(value[0], 'medium'));
          });
          _.each(data.market_cap, (value: any) => {
            this.marketcap_data.push(value[1]);
            this.marketcap_labels.push(datePipe.transform(value[0], 'medium'));
          });
        }
      }
    });
  }

  doRefresh(refresher) {
    this.DataFactory.getTickerById(this.item.id).then((data: any) => {
      if (!_.isEmpty(data) && data.length > 0) {
        data = data[0];
        data.daily_volume_usd = data['24h_volume_usd'];
        data.img = './assets/icon/' + data.symbol + '.png'
        this.item = data;
      }
    }, (error) => {
    }).then(() => {

      this.DataFactory.getChartData(this.actions, this.item.symbol).then((data: any) => {
        let datePipe = new DatePipe('en-US');
        if (!_.isEmpty(data)) {
          this.showGraph = true;
          this.price_data = [];
          this.price_labels = [];

          this.volume_data = [];
          this.volume_labels = [];

          this.marketcap_data = [];
          this.marketcap_labels = [];
          if (data.price && data.price.length > 0) {
            _.each(data.price, (value: any) => {
              this.price_data.push(value[1]);
              this.price_labels.push(datePipe.transform(value[0], 'medium'));
            });
            _.each(data.volume, (value: any) => {
              this.volume_data.push(value[1]);
              this.volume_labels.push(datePipe.transform(value[0], 'medium'));
            });
            _.each(data.market_cap, (value: any) => {
              this.marketcap_data.push(value[1]);
              this.marketcap_labels.push(datePipe.transform(value[0], 'medium'));
            });
          }
        }
      });

      refresher.complete();
    });
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

  segmentChanged(ev) {
    console.log('val: ', ev.value);
    let val = ev.value;
    this.DataFactory.getChartData(val, this.item.symbol).then((data: any) => {
      let datePipe = new DatePipe('en-US');
      if (!_.isEmpty(data)) {
        this.showGraph = true;
        this.price_data = [];
        this.price_labels = [];

        this.volume_data = [];
        this.volume_labels = [];

        this.marketcap_data = [];
        this.marketcap_labels = [];

        if (data.price && data.price.length > 0) {
          _.each(data.price, (value: any) => {
            this.price_data.push(value[1]);
            this.price_labels.push(datePipe.transform(value[0], 'medium'));
          });
          _.each(data.volume, (value: any) => {
            this.volume_data.push(value[1]);
            this.volume_labels.push(datePipe.transform(value[0], 'medium'));
          });
          _.each(data.market_cap, (value: any) => {
            this.marketcap_data.push(value[1]);
            this.marketcap_labels.push(datePipe.transform(value[0], 'medium'));
          });
        }
      }
    });
  }

}
