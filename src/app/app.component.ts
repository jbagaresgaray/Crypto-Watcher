import { Component,ViewChild } from '@angular/core';
import { Platform,Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { FavoritesPage } from '../pages/favorites/favorites';
import { SettingsPage } from '../pages/settings/settings';

import { ServiceProvider } from '../providers/service/service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pages: any[] = [];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public DataFactory: ServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Market Cap', component: HomePage, icon:'stats',color:'secondary' },
      { title: 'Favorites', component: FavoritesPage, icon:'heart',color:'danger' },
      { title: 'Settings',component: SettingsPage, icon:'settings',color: 'calm' },
      { title: 'About',component: AboutPage, icon:'information-circle', color:'calm' }
    ];
  }

   openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
