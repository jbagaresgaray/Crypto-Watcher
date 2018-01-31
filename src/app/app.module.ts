import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { RestangularModule } from 'ngx-restangular/dist/esm/src';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { environment } from '../environments/environment';


import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { DetailsPage } from '../pages/details/details';
import { FavoritesPage } from '../pages/favorites/favorites';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider } from '../providers/service/service';
import { InAppBrowser } from '@ionic-native/in-app-browser';

export function RestangularConfigFactory(RestangularProvider) {
  RestangularProvider.setBaseUrl(environment.api_url);
  RestangularProvider.setPlainByDefault(true);
  RestangularProvider.setFullResponse(true);
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    SettingsPage,
    DetailsPage,
    FavoritesPage,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',
    }),
    RestangularModule.forRoot(RestangularConfigFactory),
    FormsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    SettingsPage,
    DetailsPage,
    FavoritesPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServiceProvider
  ]
})
export class AppModule { }
