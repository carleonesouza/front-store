import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Genero } from 'app/models/genero';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private _generos: BehaviorSubject<Genero[] | null> = new BehaviorSubject(null);
  private _genero: BehaviorSubject<Genero | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get generos$(): Observable<Genero[]> {
    return this._generos.asObservable();
  }

  get genero$(): Observable<Genero> {
    return this._genero.asObservable();
  }


  getListaGeneros(page = 0, size = 10, tipoLista='GENEROS') {
    return this._httpClient.get<Genero[]>(environment.apiList + 'lista', {params: {
      page, size, tipoLista
    }})
      .pipe(
        tap((result) => {
          let generos = result['content'];
          generos = generos.sort((a, b) => a.genero.localeCompare(b.genero));
          this._generos.next(generos);
        }),
        catchError(this.error.handleError<Genero[]>('getListaGeneros'))
      );
  }

  getGeneroById(id: string): Observable<Genero> {
    return this._generos.pipe(
      take(1),
      map((generos) => {

        // Find the Genêros
        const genero = generos.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Genêros
        this._genero.next(genero);

        // Return the Genêros
        return genero;
      }),
      switchMap((genero) => {

        if (!genero) {
          return throwError('Could not found Genêro with id of ' + id + '!');
        }

        return of(genero);
      }),
      catchError(this.error.handleError<Genero>('getGeneroById'))
    );
  }

  editGenero(genero: Genero): Observable<Genero> {
    return this.generos$.pipe(
      take(1),
      switchMap(generos => this._httpClient.patch<Genero>(environment.apiList + 'edit-genero', genero)
        .pipe(
          map((updatedGenero) => {

            // Find the index of the updated Gênero
            const index = generos.findIndex(item => item.recId === genero.recId);

            // Update the Gênero
            generos[index] = updatedGenero;

            // Update the Gêneros
            this._generos.next(generos);

            // Return the updated Gênero
            return updatedGenero;
          }),
          switchMap(updatedGenero => this.genero$.pipe(
            take(1),
            filter(item => item && item.recId === genero.recId),
            tap(() => {
              // Update the Gênero if it's selected
              this._genero.next(updatedGenero);

              // Return the Gênero
              return updatedGenero;
            })
          )),
          catchError(this.error.handleError<Genero>('editGenero'))
        ))
    );

  }

  addGenero(genero: Genero): Observable<any> {
    return this._httpClient.post(environment.apiList + 'add-genero', genero)
      .pipe(
        catchError(this.error.handleError<Genero>('addGenero'))
      );
  }
}
