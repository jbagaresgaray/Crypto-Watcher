import { Component } from "@angular/core";
import {
  NavController,
  LoadingController,
  AlertController
} from "ionic-angular";
import * as _ from "lodash";
import { Storage } from "@ionic/storage";

import { ServiceProvider } from "../../providers/service/service";
import { DetailsPage } from "../../pages/details/details";
import { environment } from "../../environments/environment";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  tickerArr: any[] = [];
  tickerArrCopy: any[] = [];
  favorites: any[] = [];
  actions: string = "top";
  global: any = {};

  constructor(
    public navCtrl: NavController,
    public DataFactory: ServiceProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public alertCtrl: AlertController
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
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    loading.present();

    const successResponse = (data: any) => {
      _.each(data.data, (row: any) => {
        row.icon =
          "./assets/icons/svg/color/" + _.lowerCase(row.symbol) + ".svg";
      });
      this.tickerArr = data.data;
      this.tickerArrCopy = data.data;
      loading.dismiss();
      if (ev) {
        ev.complete();
      }
    };

    const errorResponse = error => {
      // loading.dismiss();
      console.log("error: ", error);
      loading.dismiss();
      if (ev) {
        ev.complete();
      }
    };

    if (this.actions === "top") {
      this.DataFactory.getAllAssets({
        offset: 0,
        limit: 50
      }).then(successResponse, errorResponse);
    } else if (this.actions === "full") {
      this.DataFactory.getAllAssets({
        offset: 0,
        limit: 2000
      }).then(successResponse, errorResponse);
    }
  }

  doRefresh(ev) {
    this.initData(ev);
  }

  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != "") {
      this.tickerArr = this.tickerArrCopy.filter(item => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.tickerArr = this.tickerArrCopy;
    }
  }

  gotoDetails(item) {
    this.navCtrl.push(DetailsPage, {
      crypto: item
    });
  }

  addToFav(item) {
    console.log("addToFav: ", item);
    let res = _.find(this.favorites, { id: item.id });
    if (res) {
      let alert = this.alertCtrl.create({
        title: "Favorites",
        subTitle: "Cryptocurrency already on the list!",
        buttons: ["OK"]
      });
      alert.present();
      return;
    }
    this.favorites.push({
      id: item.id
    });
    this.storage.set("favorites", this.favorites);
    let alert = this.alertCtrl.create({
      title: "Favorites",
      subTitle: "Cryptocurrency added as favorites!",
      buttons: ["OK"]
    });
    alert.present();
  }

  segmentChanged(ev) {
    this.initData();
  }
}
