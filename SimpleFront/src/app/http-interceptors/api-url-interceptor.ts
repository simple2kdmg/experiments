import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable< HttpEvent<any> > {
        const reqToApi = req.clone({ url: environment.apiUrl + req.url });
        return next.handle(reqToApi);
    }
}