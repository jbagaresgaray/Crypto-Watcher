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
	actions: string = 'top';
	global:any = {};

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

		let successResponse = (data: any) => {
			if (!_.isEmpty(data)) {
				_.each(data, (row: any) => {
					row.img = './assets/icon/' + row.symbol + '.png'
				});
				this.tickerArr = data;
				this.tickerArrCopy = data;
			}
		};

		let errorResponse = (error) => {
			// loading.dismiss();
			console.log('error: ', error);
		}

		this.DataFactory.getAllTicker(null, null, 50).then(successResponse, errorResponse).then(() => {
			loading.dismiss();
		});
	}

	doRefresh(refresher) {
		let successResponse = (data: any) => {
			if (!_.isEmpty(data)) {
				_.each(data, (row: any) => {
					row.img = './assets/icon/' + row.symbol + '.png'
				});
				this.tickerArr = data;
				this.tickerArrCopy = data;
			}
		};

		let errorResponse = (error) => {
			// loading.dismiss();
			console.log('error: ', error);
		}

		if (this.actions === 'top') {
			this.DataFactory.getAllTicker(null, null, 50).then(successResponse, errorResponse).then(() => {
				refresher.complete();
			});
		} else if (this.actions === 'full') {
			this.DataFactory.getAllTicker().then(successResponse, errorResponse).then(() => {
				refresher.complete();
			});
		}
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
		console.log('addToFav: ', item);
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

	segmentChanged(ev) {
		let loading = this.loadingCtrl.create();
		loading.present();

		let successResponse = (data: any) => {
			if (!_.isEmpty(data)) {
				_.each(data, (row: any) => {
					row.img = './assets/icon/' + row.symbol + '.png'
				});
				this.tickerArr = data;
				this.tickerArrCopy = data;
			}
		};

		let errorResponse = (error) => {
			// loading.dismiss();
			console.log('error: ', error);
		}

		if (ev.value === 'top') {
			this.DataFactory.getAllTicker(null, null, 50).then(successResponse, errorResponse).then(() => {
				loading.dismiss();
			});
		} else if (ev.value === 'full') {
			this.DataFactory.getAllTicker().then(successResponse, errorResponse).then(() => {
				loading.dismiss();
			});
		} else {
			this.DataFactory.getGlobalData().then((data:any)=>{
				console.log('getGlobalData: ',data);
				if(!_.isEmpty(data)){
					this.global = data;
				}
			},errorResponse).then(() => {
				loading.dismiss();
			});
		}
	}
}
