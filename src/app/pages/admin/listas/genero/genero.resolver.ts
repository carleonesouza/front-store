import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Genero } from 'app/models/genero';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeneroService } from './genero.service';



@Injectable({
    providedIn: 'root'
})
export class GenerosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _generosService: GeneroService, private _router: Router) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Genero[]> {
            return this._generosService.getListaGeneros();
    }
}



@Injectable({
    providedIn: 'root'
})
export class GeneroResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _listaGenero: GeneroService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Genero> {
        if(route.paramMap.get('id') !== 'add'){
            return this._listaGenero.getGeneroById(route.paramMap.get('id'))
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
