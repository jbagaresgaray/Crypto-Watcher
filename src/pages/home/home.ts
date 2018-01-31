import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import * as _ from 'lodash';
import { Storage } from '@ionic/storage';

import { ServiceProvider } from '../../providers/service/service';
import { DetailsPage } from '../../pages/details/details';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	tickerArr: any[] = [];
	tickerArrCopy: any[] = [];
	favorites: any[] = [];

	constructor(public navCtrl: NavController, public DataFactory: ServiceProvider, public loadingCtrl: LoadingController, public storage: Storage, public alertCtrl: AlertController) {
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
			if (!_.isEmpty(data)) {
				_.each(data, (row: any) => {
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
			if (!_.isEmpty(data)) {
				_.each(data, (row: any) => {
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

	getItems(ev: any) {
		let val = ev.target.value;
		console.log('val: ', val)
		if (val && val.trim() != '') {
			this.tickerArr = _.filter(this.tickerArrCopy, (row: any) => {
				return row.name == val;
			})
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
		console.log('addToFav: ',item);
		let res = _.find(this.favorites, { id: item.id });
		if (res) {
			let alert = this.alertCtrl.create({
				title: 'Favorites',
				subTitle: 'Cryptocurrency already on the list!',
				buttons: ['OK']
			});
			alert.present();
			return;
		}
		this.favorites.push({
			id: item.id
		});
		this.storage.set('favorites', this.favorites);
		let alert = this.alertCtrl.create({
			title: 'Favorites',
			subTitle: 'Cryptocurrency added as favorites!',
			buttons: ['OK']
		});
		alert.present();
	}
}
