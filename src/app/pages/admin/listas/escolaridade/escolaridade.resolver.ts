import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Escolaridade } from 'app/models/escolaridade';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EscolaridadeService } from './escolaridade.service';


@Injectable({
    providedIn: 'root'
})
export class EscolaridadesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _escolaridadesService: EscolaridadeService, private _router: Router) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Escolaridade[]> {
            return this._escolaridadesService.getListaEscolaridades();
    }
}

@Injectable({
    providedIn: 'root'
})
export class EscolaridadeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _listaEscolaridade: EscolaridadeService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Escolaridade> {
        if(route.paramMap.get('id') !== 'add'){
            return this._listaEscolaridade.getEscolaridadeById(route.paramMap.get('id'))
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
