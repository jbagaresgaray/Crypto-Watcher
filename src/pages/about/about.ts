import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import * as _ from 'lodash';

import { ServiceProvider } from '../../providers/service/service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  schoolsArr: any[];
  constructor(public navCtrl: NavController, public DataFactory: ServiceProvider, public loadingCtrl: LoadingController) {
    this.schoolsArr = [];
  }


  doRefresh(e) {
    setTimeout(()=>{
      e.complete();
    },600);
  }

}
