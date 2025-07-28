import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md', // Default to material design (optional)
      backButtonText: '', // Hide back button text
      animated: true // Enable animations
    }),
    AppRoutingModule,
    HttpClientModule // For HTTP requests
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Ionic routing strategy
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}