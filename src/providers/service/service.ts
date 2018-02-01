import { Restangular } from 'ngx-restangular/dist/esm/src';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Platform } from 'ionic-angular';
import * as CryptoJS from 'crypto-js';

import { environment } from '../../environments/environment';

import { HTTP } from '@ionic-native/http';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {

  constructor(public restangular: Restangular, private http: HttpClient, private _http: HTTP, public platform: Platform) {
    console.log('Hello ServiceProvider Provider');
  }

  getAllTicker(convert?: string, start?: number, limit?: number) {
    let params = new HttpParams();
    let _params: any = {};
    if (convert) {
      params = params.append('convert', convert);
      _params.convert = convert;
    }

    if (start) {
      params = params.append('start', start.toString());
      _params.start = start;
    }

    if (limit) {
      params = params.append('limit', limit.toString());
      _params.limit = limit;
    }

    return new Promise((resolve, reject) => {
      let callbackResponse = (resp: any) => {
        console.log('callbackResponse: ',resp);
        resolve(resp);
      };

      let errorResponse = (error) => {
        console.log('error: ', error);
        reject(error);
      };

      // this.restangular.all('ticker').customGET("", params).subscribe(callbackResponse,errorResponse);
      if (this.platform.is('cordova')) {
        this._http.get(environment.api_url + 'ticker', _params, {}).then(callbackResponse, errorResponse);
      } else {
        this.http.get(environment.api_url + 'ticker', { params: params }).subscribe(callbackResponse, errorResponse);
      }
    });
  }

  getTickerById(id, convert?: string) {
    let params = new HttpParams();
    let _params: any = {};
    if (convert) {
      params = params.append('convert', convert);
      _params.convert = convert
    }

    return new Promise((resolve, reject) => {
      let callbackResponse = (resp: any) => {
        console.log('callbackResponse: ',resp);
        resolve(resp);
      };

      let errorResponse = (error) => {
        console.log('error: ', error);
        reject(error);
      };
      // this.restangular.all('ticker').customGET(id, params).subscribe(callbackResponse, errorResponse);
      if (this.platform.is('cordova')) {
        this._http.get(environment.api_url + 'ticker/' + id, _params, {}).then(callbackResponse, errorResponse);
      } else {
        this.http.get(environment.api_url + 'ticker/' + id, { params: params }).subscribe(callbackResponse, errorResponse);
      }
    });


  }

  getGlobalData(convert?: string) {
    let params = new HttpParams();
    let _params: any = {};
    if (convert) {
      params = params.append('convert', convert);
      _params.convert = convert
    }

    return new Promise((resolve, reject) => {
      let callbackResponse = (resp: any) => {
        console.log('callbackResponse: ',resp);
        resolve(resp);
      };

      let errorResponse = (error) => {
        console.log('error: ', error);
        reject(error);
      };

      // this.restangular.all('global').customGET("", params).subscribe(callbackResponse, errorResponse);
      if (this.platform.is('cordova')) {
        this._http.get(environment.api_url + 'global', _params, {}).then(callbackResponse, errorResponse);
      } else {
        this.http.get(environment.api_url + 'global', { params: params }).subscribe(callbackResponse, errorResponse);
      }
    });
  }

  getChartData(timespan, symbol) {
    return new Promise((resolve, reject) => {
      let callbackResponse = (resp: any) => {
        console.log('callbackResponse: ',resp);
        resolve(resp);
      };

      let errorResponse = (error) => {
        console.log('error: ', error);
        reject(error);
      };

      /*this.restangular.withConfig((config) => {
        config.setBaseUrl(environment.api_url_coincap);
      }).all('history' + timespan + '/' + symbol).customGET().subscribe(callbackResponse, errorResponse);*/
      if (this.platform.is('cordova')) {
        this._http.get(environment.api_url_coincap + 'history' + timespan + '/' + symbol, {}, {}).then(callbackResponse, errorResponse);
      } else {
        this.http.get(environment.api_url_coincap + 'history' + timespan + '/' + symbol).subscribe(callbackResponse, errorResponse);
      }
    });
  }

}
