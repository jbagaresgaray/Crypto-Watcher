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
  showGraph:boolean = false;
  actions: string = '/1day';

  price_data: any[] = [];
  price_labels: any[] = [];
  marketcap_data: any[] = [];
  marketcap_labels: any[] = [];
  volume_data: any[] = [];
  volume_labels: any[] = [];


  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

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

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
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
    });
  }

}
