import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {BrowserModule, Title} from '@angular/platform-browser';
import {TranslationModule} from './shared/langauge/translation.module';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SBB_SELECT_SCROLL_STRATEGY_PROVIDER} from '@sbb-esta/angular/select';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, ),
    importProvidersFrom(BrowserAnimationsModule),
    // Set this to true to enable service worker (PWA)
    importProvidersFrom(TranslationModule),
    provideHttpClient(withInterceptorsFromDi()),
    SBB_SELECT_SCROLL_STRATEGY_PROVIDER,

    Title,
    { provide: LOCALE_ID, useValue: 'en' },
  ],
};
