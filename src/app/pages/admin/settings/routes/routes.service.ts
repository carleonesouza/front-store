import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoutesModel } from 'app/models/route.model';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private _route: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _routes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }



   get route$(): Observable<any> {
    return this._route.asObservable();
  }


  get routes$(): Observable<any[]> {
    return this._routes.asObservable();
  }

  getAllRoutes(): Observable<any[]>{
    return this._httpClient.get<any[]>(environment.apiManager+'routes/get-all').
    pipe(
    tap((result) => {
          result.map((a)=>{a.route = a.route.split('/api/').pop();});
          result = result.sort((a, b) => a.route.localeCompare(b.route));
          this._routes.next(result);
      }),
      catchError(this.error.handleError<any[]>('getAllRoutes'))
    );
  }


  getRouteById(rotaId): Observable<RoutesModel>    {
        return this._httpClient.get<RoutesModel>(environment.apiManager + `routes/busca-rota?rotaId=${rotaId}`)
        .pipe(
          tap((result) =>{
            this._route.next(result);
          }),
          catchError(this.error.handleError<any>('addRoute'))
        );
    }

    searchRoute(rotaId): Observable<any[]> {
      return this._httpClient.get<any[]>(environment.apiManager + 'routes/busca-rota', {
        params: { rotaId }
      }).pipe(
        tap((rotas) => {
          this._routes.next([rotas]);
        }),
        catchError(this.error.handleError<any>('searchRoute'))
      );
    }


    ativaDesativaRoute(route): Observable<any>{
      return this._httpClient.patch(environment.apiManager +'routes/ativa-desativa', route)
      .pipe(
        tap((result) =>{
          console.log(result);
        }),
        catchError(this.error.handleError<any>('ativaDesativaRoute'))
      );
    }

  addRoute(route): Observable<any>{
    return this._httpClient.post(environment.apiManager+'routes/add-rota', route)
    .pipe(
      tap((newRoute) => {

        // Update the Route if it's selected
        this._route.next(newRoute);

        // Return the new Route
        return newRoute;
      }),
      catchError(this.error.handleError<any>('addRoute'))
    );
  }

}
