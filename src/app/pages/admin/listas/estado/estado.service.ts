import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Estado } from 'app/models/estado';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private _estados: BehaviorSubject<Estado[] | null> = new BehaviorSubject(null);
  private _estado: BehaviorSubject<Estado | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get estados$(): Observable<Estado[]> {
    return this._estados.asObservable();
  }

  get estado$(): Observable<Estado> {
    return this._estado.asObservable();
  }


  getListaEstados(page = 0, size = 10, tipoLista='ESTADOS') {
    return this._httpClient.get<Estado[]>(environment.apiList + 'lista', {params: {
      page, size, tipoLista
    }})
      .pipe(
        tap((result) => {
          let estados = result['content'];
          estados = estados.sort((a, b) => a.nome.localeCompare(b.nome));
          this._estados.next(estados);
        }),
        catchError(this.error.handleError<Estado[]>('getListaEstados'))
      );
  }

  getEstadoById(id: string): Observable<Estado> {
    return this._estados.pipe(
      take(1),
      map((estados) => {

        // Find the Estado
        const estado = estados.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Estado
        this._estado.next(estado);

        // Return the Estado
        return estado;
      }),
      switchMap((estado) => {

        if (!estado) {
          return throwError('Could not found Estado with id of ' + id + '!');
        }

        return of(estado);
      }),
      catchError(this.error.handleError<Estado>('getEstadoById'))
    );
  }

  editEstado(estado: Estado): Observable<Estado> {
    return this.estados$.pipe(
      take(1),
      switchMap(estados => this._httpClient.patch<Estado>(environment.apiList + 'edit-estado', estado)
        .pipe(
          map((updatedEstado) => {

            // Find the index of the updated Estado
            const index = estados.findIndex(item => item.recId === estado.recId);

            // Update the Estado
            estados[index] = updatedEstado;

            // Update the Cidades
            this._estados.next(estados);

            // Return the updated Estado
            return updatedEstado;
          }),
          switchMap(updatedEstado => this.estado$.pipe(
            take(1),
            filter(item => item && item.recId === estado.recId),
            tap(() => {
              // Update the Estado if it's selected
              this._estado.next(updatedEstado);

              // Return the Estado
              return updatedEstado;
            })
          )),
          catchError(this.error.handleError<Estado>('editEstado'))
        ))
    );
  }

  addEstado(estado: Estado): Observable<any> {
    return this._httpClient.post(environment.apiList + 'add-estado', estado)
      .pipe(
        catchError(this.error.handleError<Estado>('addEstado'))
      );
  }
}

