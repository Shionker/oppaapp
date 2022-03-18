import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';

// cambiando LOCALE_ID a español
import es from '@angular/common/locales/es'
registerLocaleData(es)

import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common'
import { ApiService } from './providers/api/api.service';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationService } from './providers/location/location.service';
import { WebSocketService } from './providers/web-socket/web-socket.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AuthInterceptor } from './interceptors/auth.interceptor';
// import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule
  ],
  providers: [
    Autostart,
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    DatePipe,
    Camera,
    // File,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:true,
    },
    { 
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    { 
      provide: LOCALE_ID,
      useValue: "es-ES"
    },
    ApiService,
    LocationService,
    WebSocketService,
    LocalNotifications,
    AndroidPermissions,
    InAppBrowser,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
