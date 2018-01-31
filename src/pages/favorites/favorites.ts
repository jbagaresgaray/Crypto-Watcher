import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import * as _ from 'lodash';

import { ServiceProvider } from '../../providers/service/service';
import { DetailsPage } from '../../pages/details/details';


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  tickerArr: any[] = [];
  tickerArrCopy: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public DataFactory: ServiceProvider,public loadingCtrl: LoadingController) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContentPage');
    let loading = this.loadingCtrl.create();
    loading.present();
    this.DataFactory.getAllTicker().then((data: any) => {
      console.log('ticker: ',data);
      if(!_.isEmpty(data)){
        _.each(data,(row:any)=>{
          row.img = './assets/icon/' + row.symbol + '.png'
        });
        this.tickerArr = data;
        this.tickerArrCopy = data;
      }
    }, (error) => {
      loading.dismiss();
    }).then(() => {
      loading.dismiss();
    });
  }
  

  doRefresh(refresher) {
    this.DataFactory.getAllTicker().then((data: any) => {
      console.log('ticker: ',data);
      if(!_.isEmpty(data)){
        _.each(data,(row:any)=>{
          row.img = './assets/icon/' + row.symbol + '.png'
        });
        this.tickerArr = data;
        this.tickerArrCopy = data;
      }
    }, (error) => {
      refresher.complete();
    }).then(() => {
      refresher.complete();
    });
  }

  gotoDetails(item){
    this.navCtrl.push(DetailsPage,{
      crypto: item
    });
  }

  getItems(ev: any) {
    let val = ev.target.value;
    console.log('val: ',val)
    if (val && val.trim() != '') {
      this.tickerArr = _.filter(this.tickerArrCopy, (row:any)=>{
        return row.name == val;
      })
    } else {
      this.tickerArr = this.tickerArrCopy;
    }
  }

}
