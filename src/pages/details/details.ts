import { Component, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Content
} from "ionic-angular";
import * as _ from "lodash";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color } from "ng2-charts";
import { Storage } from "@ionic/storage";

import { ServiceProvider } from "../../providers/service/service";

/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: "page-details",
  templateUrl: "details.html"
})
export class DetailsPage {
  item: any = {};
  @ViewChild("lineCanvas") lineCanvas;
  @ViewChild(Content) content: Content;

  lineChart: any;
  favorites: any[] = [];
  isAdded: boolean = false;
  showGraph: boolean = false;
  actions: string = "d1";
  mode: string = "info";

  assetHistory: ChartDataSets[] = [];
  assetMarkets: any[] = [];

  price_data: any[] = [];
  price_labels: any[] = [];
  marketcap_data: any[] = [];
  marketcap_labels: any[] = [];
  volume_data: any[] = [];
  volume_labels: any[] = [];

  lineChartOptions: ChartOptions = {
    responsive: true,
    animation: false,
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    elements: {
      point: { radius: 0 },
      line: { fill: false }
    },
    scales: {
      yAxes: [{ display: false }],
      xAxes: [{ display: false }]
    }
  };
  lineChartColors: Color[] = [
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
    public storage: Storage,
    public alertCtrl: AlertController
  ) {
    this.item = this.navParams.get("crypto");
    console.log("this.item: ", this.item);
    storage.get("favorites").then(val => {
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
    this.assetHistory = [
      {
        data: [],
        label: ""
      }
    ];
    this.initData();
  }

  private initData(ev?: any) {
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    loading.present();
    this.DataFactory.getAssetsById(this.item.id).then(
      (data: any) => {
        if (!_.isEmpty(data)) {
          this.item = data.data;
          this.item.icon =
            "./assets/icons/svg/color/" +
            _.lowerCase(this.item.symbol) +
            ".svg";
        }
        loading.dismiss();
        if (ev) {
          ev.complete();
        }
      },
      error => {
        console.log("error: ", error);
        loading.dismiss();
        if (ev) {
          ev.complete();
        }
      }
    );
  }

  private getAssetHistory(ev?: any) {
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    loading.present();
    const datePipe = new DatePipe("en-US");
    this.DataFactory.getAssetsHistory(this.item.id, this.actions)
      .then(
        (data: any) => {
          if (data && !_.isEmpty(data.data)) {
            this.assetHistory = [];
            this.price_data = [];
            this.price_labels = [];

            _.each(data.data, (value: any) => {
              this.price_data.push(parseFloat(value.priceUsd));
              this.price_labels.push(datePipe.transform(value.date, "medium"));
            });
            this.assetHistory.push({
              data: this.price_data,
              label: "Series"
            });
            console.log("this.assetHistory: ", this.assetHistory);
            // console.log("this.price_data: ", this.price_data);
            // console.log("this.price_labels: ", this.price_labels);
          }
          loading.dismiss();
          if (ev) {
            ev.complete();
          }
        },
        error => {
          console.log("error: ", error);
          loading.dismiss();
          if (ev) {
            ev.complete();
          }
        }
      )
      .then(() => {
        this.content.resize();
      });
  }

  private getAssetMarkets(ev?: any) {
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    loading.present();
    this.DataFactory.getAssetsMarkets(this.item.id).then(
      (data: any) => {
        if (data && !_.isEmpty(data.data)) {
          this.assetMarkets = data.data;
        }
        loading.dismiss();
        if (ev) {
          ev.complete();
        }
      },
      error => {
        console.log("error: ", error);
        loading.dismiss();
        if (ev) {
          ev.complete();
        }
      }
    );
  }

  doRefresh(ev) {
    if (this.mode === "info") {
      this.initData(ev);
    } else if (this.mode === "history") {
      this.getAssetHistory(ev);
    } else if (this.mode === "markets") {
      this.getAssetMarkets(ev);
    }
  }

  addToFav(item) {
    console.log("addToFav: ", item);
    let res = _.find(this.favorites, { id: item.id });
    if (res) {
      this.favorites = _.reject(this.favorites, { id: item.id });
      this.storage.set("favorites", this.favorites);
      this.isAdded = false;
      let alert = this.alertCtrl.create({
        title: "Favorites",
        subTitle: "Cryptocurrency remove on favorites!",
        buttons: ["OK"]
      });
      alert.present();
      return;
    }
    this.favorites.push({
      id: item.id
    });
    this.storage.set("favorites", this.favorites);
    this.isAdded = true;
    let alert = this.alertCtrl.create({
      title: "Favorites",
      subTitle: "Cryptocurrency added as favorites!",
      buttons: ["OK"]
    });
    alert.present();
  }

  modeSegmentChanged(ev) {
    if (this.mode === "info") {
      this.initData();
    } else if (this.mode === "history") {
      this.getAssetHistory();
    } else if (this.mode === "markets") {
      this.getAssetMarkets();
    }
  }

  segmentChanged(ev) {
    console.log("val: ", ev.value);
    let val = ev.value;
    this.actions = val;
    this.getAssetHistory();
  }
}
