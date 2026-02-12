import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { ProductAdministrationModule } from './modules/product-administration/product-administration.module';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        httpErrorInterceptor,
        errorInterceptor
      ])
    ),
    importProvidersFrom(ProductAdministrationModule),
  ]
};
