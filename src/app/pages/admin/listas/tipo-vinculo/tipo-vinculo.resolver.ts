import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoVinculoService } from './tipo-vinculo.service';

@Injectable({
  providedIn: 'root'
})
export class TiposVinculoResolver implements Resolve<boolean> {

  constructor(private _tipoVinculoService: TipoVinculoService){ }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._tipoVinculoService.getListasVinculo();
  }
}



@Injectable({
  providedIn: 'root'
})
export class TipoVinculoResolver implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(
      private _tipoVinculoService: TipoVinculoService,
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
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      if(route.paramMap.get('id') !== 'add'){
          return this._tipoVinculoService.getVinculoById(route.paramMap.get('id'))
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

