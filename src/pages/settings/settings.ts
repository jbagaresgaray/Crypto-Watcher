import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { AboutPage } from '../about/about';

/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  mores: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('MorePage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter MorePage');
    
  }

}
