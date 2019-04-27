import { Component } from "@angular/core";
import { DatePipe } from "@angular/common";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import * as _ from "lodash";
import * as async from "async";
import { Storage } from "@ionic/storage";
import { Chart } from "chart.js";

import { ServiceProvider } from "../../providers/service/service";
import { DetailsPage } from "../../pages/details/details";

@Component({
  selector: "page-favorites",
  templateUrl: "favorites.html"
})
export class FavoritesPage {
  tickerArr: any[] = [];
  tickerArrCopy: any[] = [];
  favorites: any[] = [];
  actions: string = "/1day";

  lineChartOptions: any = {
    responsive: true,
    animation: false,
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    elements: {
      point: { radius: 0 },
      line: { fill: false }
    },
    scales: {
      yAxes: [{ display: true }],
      xAxes: [{ display: false }]
    }
  };
  lineChartColors: Array<any> = [
    {
      backgroundColor: "#A1ADDC ",
      borderColor: "#525CAB",
      pointBackgroundColor: "#525CAB",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#525CAB"
    }
  ];
  lineChartLegend: boolean = false;
  lineChartType: string = "line";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public DataFactory: ServiceProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage
  ) {
    storage.get("favorites").then(val => {
      if (!_.isEmpty(val)) {
        this.favorites = val;
      }
    });
  }

  ionViewDidLoad() {
    this.initData();
  }

  private initData(ev?: any) {
    /* let loading = this.loadingCtrl.create();
    loading.present();
    this.DataFactory.getAllTicker()
      .then(
        (data: any) => {
          if (!_.isEmpty(data)) {
            let temp: any[] = [];
            _.each(data, (row: any) => {
              row.img = "./assets/icon/" + row.symbol + ".png";
              if (_.find(this.favorites, { id: row.id })) {
                temp.push(row);
              }
            });

            async.each(
              temp,
              (item: any, callback: any) => {
                item.price_data = [];
                item.price_labels = [];
                item.marketcap_data = [];
                item.marketcap_labels = [];
                item.volume_data = [];
                item.volume_labels = [];

                this.DataFactory.getChartData(this.actions, item.symbol)
                  .then((data: any) => {
                    let datePipe = new DatePipe("en-US");
                    if (!_.isEmpty(data)) {
                      if (data.price && data.price.length > 0) {
                        _.each(data.price, (value: any) => {
                          item.price_data.push(value[1]);
                          item.price_labels.push(
                            datePipe.transform(value[0], "medium")
                          );
                        });
                      }
                    }
                  })
                  .then(() => {
                    callback();
                  });
              },
              () => {
                this.tickerArr = temp;
                this.tickerArrCopy = temp;
              }
            );
          }
        },
        error => {
          // loading.dismiss();
        }
      )
      .then(() => {
        loading.dismiss();
      }); */
  }

  doRefresh(ev) {
    this.initData(ev);
  }

  gotoDetails(item) {
    this.navCtrl.push(DetailsPage, {
      crypto: item
    });
  }

  getItems(ev: any) {
    let val = ev.target.value;
    console.log("val: ", val);
    if (val && val.trim() != "") {
      this.tickerArr = _.filter(this.tickerArrCopy, (row: any) => {
        return row.name == val;
      });
    } else {
      this.tickerArr = this.tickerArrCopy;
    }
  }
}
