import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiUrlInterceptor } from './api-url-interceptor';
import { AddCredentialsInterceptor } from './add-credentials-interceptor';


export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AddCredentialsInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true },
];
