import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, switchMap,tap, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {


  private _tipoDocumentos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _tipoDocumento: BehaviorSubject<any | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError) { }


  get tipoDocumentos$(): Observable<any[]> {
    return this._tipoDocumento.asObservable();
  }

  get tipoDocumento$(): Observable<any> {
    return this._tipoDocumento.asObservable();
  }


  getTipoDocumentos(page = 0, size = 10, tipoLista='SEXOS') {
    return this._httpClient.get<any[]>(environment.apiList + 'lista', {
      params:{page, size, tipoLista}
    })
      .pipe(
        tap((result) => {
          this._tipoDocumentos.next(result);
        }),
        catchError(this.error.handleError<any[]>('getTipoDocumentos'))
      );
  }

  getTipoDocumentoById(id: string): Observable<any> {
    return this._tipoDocumentos.pipe(
      take(1),
      map((tipoDoc) => {

        // Find the Tipo Exame
        const tipoDocumento = tipoDoc.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Tipo Exame
        this._tipoDocumentos.next(tipoDocumento);

        // Return the Tipo Exame
        return tipoDocumento;
      }),
      switchMap((tipoDoc) => {

        if (!tipoDoc) {
          return throwError('Could not found Tipo Documento with id of ' + id + '!');
        }

        return of(tipoDoc);
      }),
      catchError(this.error.handleError<any>('getTipoDocumentoById'))
    );
  }

}
