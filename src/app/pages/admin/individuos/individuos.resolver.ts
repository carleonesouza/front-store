import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Individuo } from 'app/models/individuo';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IndividuosService } from './individuos.service';


@Injectable({
    providedIn: 'root'
})
export class IndividuosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _individuosService: IndividuosService, private _router: Router) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Individuo[]> {
            return this._individuosService.getIndividuos();
    }
}

@Injectable({
    providedIn: 'root'
})
export class IndividuoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _individuosService: IndividuosService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Individuo> {
        if (route.paramMap.get('id') !== 'add') {
            return this._individuosService.getIndividuoById(route.paramMap.get('id'))
                .pipe(
                    // Error here means the requested individuo is not available
                    catchError((error) => {

                        // Log the error
                        console.error('Resolve ', error);

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
