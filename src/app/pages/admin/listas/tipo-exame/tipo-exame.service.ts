import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoExameService {

  private _tipoExames: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _tipoExame: BehaviorSubject<any | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError) { }


  get tipoExames$(): Observable<any[]> {
    return this._tipoExames.asObservable();
  }

  get tipoExame$(): Observable<any> {
    return this._tipoExame.asObservable();
  }


  getTipoExameList(page = 0, size = 10, tipoLista='SEXOS') {
    return this._httpClient.get<any[]>(environment.apiList + 'lista', {
      params:{page, size, tipoLista}
    })
      .pipe(
        tap((result) => {
          this._tipoExames.next(result);
        }),
        catchError(this.error.handleError<any[]>('getTipoExameList'))
      );
  }

  getTipoExameById(id: string): Observable<any> {
    return this._tipoExames.pipe(
      take(1),
      map((tipoExa) => {

        // Find the Tipo Exame
        const tipoExame = tipoExa.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Tipo Exame
        this._tipoExames.next(tipoExame);

        // Return the Tipo Exame
        return tipoExame;
      }),
      switchMap((tipoExa) => {

        if (!tipoExa) {
          return throwError('Could not found Tipo Exame with id of ' + id + '!');
        }

        return of(tipoExa);
      }),
      catchError(this.error.handleError<any>('getTipoExameById'))
    );
  }

}
