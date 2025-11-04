import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeTr);

  bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    { provide: LOCALE_ID, useValue: 'tr' }
  ]
});
