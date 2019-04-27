import { Restangular } from "ngx-restangular/dist/esm/src";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Platform } from "ionic-angular";
import * as CryptoJS from "crypto-js";

import { environment } from "../../environments/environment";

import { HTTP } from "@ionic-native/http";

@Injectable()
export class ServiceProvider {
  constructor(
    public restangular: Restangular,
    private http: HttpClient,
    private _http: HTTP,
    public platform: Platform
  ) {
    console.log("Hello ServiceProvider Provider");
  }

  getAllAssets(param?: any) {
    let _params: any = {};

    if (param && param.search) {
      _params.search = param.search;
    }

    if (param && param.ids) {
      _params.ids = param.ids;
    }

    if (param && param.limit) {
      _params.limit = param.limit;
    }

    if (param && param.offset) {
      _params.offset = param.offset;
    }

    return new Promise((resolve, reject) => {
      const callbackResponse = (resp: any) => {
        resolve(resp);
      };

      const errorResponse = error => {
        console.log("error: ", error);
        reject(error);
      };
      console.log("environment: ", environment);

      if (this.platform.is("cordova")) {
        this._http
          .get(environment.api_url_coincap + "/assets", _params, {})
          .then(callbackResponse, errorResponse);
      } else {
        this.http
          .get(environment.api_url_coincap + "/assets", {
            params: _params
          })
          .subscribe(callbackResponse, errorResponse);
      }
    });
  }

  getAssetsById(id) {
    return new Promise((resolve, reject) => {
      let callbackResponse = (resp: any) => {
        resolve(resp);
      };

      let errorResponse = error => {
        console.log("error: ", error);
        reject(error);
      };

      if (this.platform.is("cordova")) {
        this._http
          .get(environment.api_url_coincap + "/assets/" + id, {}, {})
          .then(callbackResponse, errorResponse);
      } else {
        this.http
          .get(environment.api_url_coincap + "/assets/" + id, {})
          .subscribe(callbackResponse, errorResponse);
      }
    });
  }

  getAssetsHistory(id, interval) {
    return new Promise((resolve, reject) => {
      let callbackResponse = (resp: any) => {
        resolve(resp);
      };

      let errorResponse = error => {
        console.log("error: ", error);
        reject(error);
      };

      if (this.platform.is("cordova")) {
        this._http
          .get(
            environment.api_url_coincap + "/assets/" + id + "/history",
            {
              interval: interval
            },
            {}
          )
          .then(callbackResponse, errorResponse);
      } else {
        this.http
          .get(environment.api_url_coincap + "/assets/" + id + "/history", {
            params: {
              interval: interval
            }
          })
          .subscribe(callbackResponse, errorResponse);
      }
    });
  }

  getAssetsMarkets(id) {
    return new Promise((resolve, reject) => {
      let callbackResponse = (resp: any) => {
        resolve(resp);
      };

      let errorResponse = error => {
        console.log("error: ", error);
        reject(error);
      };

      if (this.platform.is("cordova")) {
        this._http
          .get(
            environment.api_url_coincap + "/assets/" + id + "/markets",
            {},
            {}
          )
          .then(callbackResponse, errorResponse);
      } else {
        this.http
          .get(environment.api_url_coincap + "/assets/" + id + "/markets", {})
          .subscribe(callbackResponse, errorResponse);
      }
    });
  }
}
