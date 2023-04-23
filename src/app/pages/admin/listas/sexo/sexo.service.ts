import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sexo } from 'app/models/sexo';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { parseInt } from 'lodash';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SexoService {

  private _sexos: BehaviorSubject<Sexo[] | null> = new BehaviorSubject(null);
  private _sexo: BehaviorSubject<Sexo | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get sexos$(): Observable<Sexo[]> {
    return this._sexos.asObservable();
  }

  get sexo$(): Observable<Sexo> {
    return this._sexo.asObservable();
  }


  getListaSexos(page = 0, size = 10, tipoLista='SEXOS') {
    return this._httpClient.get<Sexo[]>(environment.apiList + 'lista', {
      params:{page, size, tipoLista}
    })
      .pipe(
        tap((result) => {
          let sexo = result['content'];
          sexo = sexo.sort((a, b) => a.sexo.localeCompare(b.sexo));
          this._sexos.next(sexo);
        }),
        catchError(this.error.handleError<Sexo[]>('getListaSexos'))
      );
  }

  getSexoById(id: string): Observable<Sexo> {
    return this._sexos.pipe(
      take(1),
      map((sexos) => {

        // Find the sexo
        const sexo = sexos.find(item => parseInt(item.recId) === parseInt(id)) || null;

        // Update the sexo
        this._sexo.next(sexo);

        // Return the sexo
        return sexo;
      }),
      switchMap((sexo) => {

        if (!sexo) {
          return throwError('Could not found sexo with id of ' + id + '!');
        }

        return of(sexo);
      }),
      catchError(this.error.handleError<Sexo>('getSexoById'))
    );
  }

  editSexo(sexo: Sexo): Observable<Sexo> {
    return this.sexos$.pipe(
      take(1),
      switchMap(sexos => this._httpClient.patch<Sexo>(environment.apiList + 'edit-sexo', sexo)
        .pipe(
          map((updatedSexo) => {

            // Find the index of the updated Sexo
            const index = sexos.findIndex(item => item.recId === sexo.recId);

            // Update the Sexo
            sexos[index] = updatedSexo;

            // Update the Sexos
            this._sexos.next(sexos);

            // Return the updated Sexo
            return updatedSexo;
          }),
          switchMap(updatedSexo => this.sexo$.pipe(
            take(1),
            filter(item => item && item.recId === sexo.recId),
            tap(() => {
              // Update the Sexo if it's selected
              this._sexo.next(updatedSexo);

              // Return the Sexo
              return updatedSexo;
            })
          )),
          catchError(this.error.handleError<Sexo>('editSexo'))
        ))
    );
  }

  addSexo(sexo: Sexo): Observable<any> {
    return this._httpClient.post(environment.apiList + 'add-sexo', sexo)
      .pipe(
        catchError(this.error.handleError<Sexo>('addSexo'))
      );
  }
}
