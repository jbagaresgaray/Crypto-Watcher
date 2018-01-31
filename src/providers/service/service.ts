import { Restangular } from 'ngx-restangular/dist/esm/src';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import * as CryptoJS from 'crypto-js';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {

  constructor(public restangular: Restangular) {
    console.log('Hello ServiceProvider Provider');
  }

  getAllTicker(convert?: string, start?: number, limit?: number) {
    let params: any = {};
    if (convert) {
      params.convert = convert
    }

    if (start) {
      params.start = start
    }

    if (limit) {
      params.limit = limit
    }

    return new Promise((resolve, reject) => {
      this.restangular.all('ticker').customGET("", params).subscribe((resp: any) => {
        resolve(resp.data);
      }, (error) => {
        console.log('error: ', error);
        reject(error);
      });
    });
  }

  getTickerById(id, convert?: string) {
    let params: any = {};
    if (convert) {
      params.convert = convert
    }
    return new Promise((resolve, reject) => {
      this.restangular.all('ticker').customGET(id, params).subscribe((resp: any) => {
        resolve(resp.data);
      }, (error) => {
        console.log('error: ', error);
        reject(error);
      });
    });
  }

  getGlobalData(convert?: string) {
    let params: any = {};
    if (convert) {
      params.convert = convert
    }
    return new Promise((resolve, reject) => {
      this.restangular.all('global').customGET("", params).subscribe((resp: any) => {
        resolve(resp.data);
      }, (error) => {
        console.log('error: ', error);
        reject(error);
      });
    });
  }

  getChartData(timespan, symbol) {
    return new Promise((resolve, reject) => {
      this.restangular.withConfig((config) => {
        config.setBaseUrl(environment.api_url_coincap);
      }).all('history/' + timespan + '/' + symbol).customGET().subscribe((resp: any) => {
        resolve(resp.data);
      }, (error) => {
        console.log('error: ', error);
        reject(error);
      });
    });
  }

}
