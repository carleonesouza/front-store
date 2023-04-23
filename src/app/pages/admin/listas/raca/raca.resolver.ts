import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Raca } from 'app/models/raca';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { RacaService } from './raca.service';


@Injectable({
    providedIn: 'root'
})
export class RacasResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _racasService: RacaService, private _router: Router) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Raca[]> {
            return this._racasService.getListaRacas();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RacaResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _listaRaca: RacaService,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Raca> {
        if(route.paramMap.get('id') !== 'add'){
            return this._listaRaca.getRacaById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested contact is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
        }
    }
}
