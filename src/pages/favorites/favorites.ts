import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import * as _ from 'lodash';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';

import { ServiceProvider } from '../../providers/service/service';
import { DetailsPage } from '../../pages/details/details';


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  tickerArr: any[] = [];
  tickerArrCopy: any[] = [];
  favorites: any[] = [];
  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public DataFactory: ServiceProvider,public loadingCtrl: LoadingController,public storage:Storage) {
    storage.get('favorites').then((val) => {
      if (!_.isEmpty(val)) {
        this.favorites = val;
      }
    });
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.DataFactory.getAllTicker().then((data: any) => {
      if(!_.isEmpty(data)){
        let temp:any[] = [];
        _.each(data,(row:any)=>{
          row.img = './assets/icon/' + row.symbol + '.png'
          if(_.find(this.favorites,{id: row.id})){
            temp.push(row);
          }
        });
        this.tickerArr = temp;
        this.tickerArrCopy = temp;
      }
    }, (error) => {
      // loading.dismiss();
    }).then(() => {
      loading.dismiss();

      /*this.lineChart = new Chart(this.lineCanvas.nativeElement, {
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
      });*/
    });
  }
  

  doRefresh(refresher) {
    this.DataFactory.getAllTicker().then((data: any) => {
      if(!_.isEmpty(data)){
        let temp:any[] = [];
        _.each(data,(row:any)=>{
          row.img = './assets/icon/' + row.symbol + '.png'
          if(_.find(this.favorites,{id: row.id})){
            temp.push(row);
          }
        });
        this.tickerArr = temp;
        this.tickerArrCopy = temp;
      }
    }, (error) => {
      refresher.complete();
    }).then(() => {
      refresher.complete();

      /*this.lineChart = new Chart(this.lineCanvas.nativeElement, {
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
      });*/
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
