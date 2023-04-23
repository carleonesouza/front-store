import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Sexo } from 'app/models/sexo';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { SexoService } from '../sexo/sexo.service';


@Injectable({
    providedIn: 'root'
})
export class SexosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _sexosService: SexoService, private _router: Router) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sexo[]> {
            return this._sexosService.getListaSexos();
    }
}


@Injectable({
    providedIn: 'root'
})
export class SexoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _listaSexos: SexoService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sexo> {
        if(route.paramMap.get('id') !== 'add'){
            return this._listaSexos.getSexoById(route.paramMap.get('id'))
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
