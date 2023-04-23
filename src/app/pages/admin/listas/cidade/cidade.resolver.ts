import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Cidade } from 'app/models/cidade';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CidadeService } from './cidade.service';



@Injectable({
    providedIn: 'root'
})
export class CidadesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _cidadesService: CidadeService, private _router: Router) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
            return this._cidadesService.getListaCidades();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CidadeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _listaCidade: CidadeService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cidade> {
        if(route.paramMap.get('id') !== 'add'){
            return this._listaCidade.getCidadeById(route.paramMap.get('id'))
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
