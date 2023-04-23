import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of } from 'rxjs';
import { PagesService } from './pages.service';

@Injectable({
    providedIn: 'root'
})
export class PagesResolver implements Resolve<any> {
    /**
     * Constructor
     */

    constructor(private _authService: AuthService, private _router: Router, private _pagesService: PagesService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
        return of();
    }


}
