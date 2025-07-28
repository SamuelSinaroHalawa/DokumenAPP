import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { AppRoutingModule } from './app/app-routing.module';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, IonicModule.forRoot(), AppRoutingModule)
  ]
}).catch(err => console.error(err));
