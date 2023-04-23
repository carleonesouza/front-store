import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, tap, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CondicaoClinicaService {

  private _condicaoClinicas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _condicaoClinica: BehaviorSubject<any | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError) { }


  get condicaoClinicas$(): Observable<any[]> {
    return this._condicaoClinicas.asObservable();
  }

  get condicaoClinica$(): Observable<any> {
    return this._condicaoClinica.asObservable();
  }


  getCondicaoClinicas(page = 0, size = 10, tipoLista='SEXOS') {
    return this._httpClient.get<any[]>(environment.apiList + 'lista', {
      params:{page, size, tipoLista}
    })
      .pipe(
        tap((result) => {
          this._condicaoClinicas.next(result);
        }),
        catchError(this.error.handleError<any[]>('getCondicaoClinicas'))
      );
  }

  getCondicaoClinicaById(id: string): Observable<any> {
    return this._condicaoClinicas.pipe(
      take(1),
      map((condicaoClinicas) => {

        // Find the Tipo Exame
        const condicao = condicaoClinicas.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Tipo Exame
        this._condicaoClinica.next(condicao);

        // Return the Tipo Exame
        return condicao;
      }),
      switchMap((condicao) => {

        if (!condicao) {
          return throwError('Could not found Condição Clínica with id of ' + id + '!');
        }

        return of(condicao);
      }),
      catchError(this.error.handleError<any>('getCondicaoClinicaById'))
    );
  }

}
