import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Estado } from 'app/models/estado';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EstadoService } from './estado.service';


@Injectable({
    providedIn: 'root'
})
export class EstadosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _estadosService: EstadoService, private _router: Router) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Estado[]> {
            return this._estadosService.getListaEstados();
    }
}



@Injectable({
    providedIn: 'root'
})
export class EstadoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _listaEstado: EstadoService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Estado> {
        if(route.paramMap.get('id') !== 'add'){
            return this._listaEstado.getEstadoById(route.paramMap.get('id'))
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
