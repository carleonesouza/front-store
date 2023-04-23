import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Raca } from 'app/models/raca';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RacaService {

  private _racas: BehaviorSubject<Raca[] | null> = new BehaviorSubject(null);
  private _raca: BehaviorSubject<Raca | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get racas$(): Observable<Raca[]> {
    return this._racas.asObservable();
  }

  get raca$(): Observable<Raca> {
    return this._raca.asObservable();
  }


  getListaRacas(page = 0, size = 10) {
    return this._httpClient.get<Raca[]>(environment.apiList + `lista?page=${page}&size=${size}&tipoLista=RACAS`)
      .pipe(
        tap((result) => {
          let raca = result['content'];
          raca = raca.sort((a, b) => a.raca.localeCompare(b.raca));
          this._racas.next(raca);
        }),
        catchError(this.error.handleError<Raca[]>('getListaRacas'))
      );
  }

  getRacaById(id: string): Observable<Raca> {
    return this._racas.pipe(
      take(1),
      map((racas) => {

        // Find the raças
        const raca = racas.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the raças
        this._raca.next(raca);

        // Return the raças
        return raca;
      }),
      switchMap((raca) => {

        if (!raca) {
          return throwError('Could not found raças with id of ' + id + '!');
        }

        return of(raca);
      }),
      catchError(this.error.handleError<Raca>('getRacaById'))
    );
  }


  editRaca(raca: Raca): Observable<Raca> {
    return this.racas$.pipe(
      take(1),
      switchMap(racas => this._httpClient.patch<Raca>(environment.apiList + 'edit-raca', raca)
        .pipe(
          map((updatedRaca) => {

            // Find the index of the updated Raça
            const index = racas.findIndex(item => item.recId === raca.recId);

            // Update the Raça
            racas[index] = updatedRaca;

            // Update the Raças
            this._racas.next(racas);

            // Return the updated Raça
            return updatedRaca;
          }),
          switchMap(updatedRaca => this.raca$.pipe(
            take(1),
            filter(item => item && item.recId === raca.recId),
            tap(() => {
              // Update the Raça if it's selected
              this._raca.next(updatedRaca);

              // Return the Raça
              return updatedRaca;
            })
          )),
          catchError(this.error.handleError<Raca>('editRaca'))
        ))
    );
  }

  addRaca(raca: Raca): Observable<any> {
    return this._httpClient.post(environment.apiList + 'add-raca', raca)
      .pipe(
        catchError(this.error.handleError<Raca>('addRaca'))
      );
  }
}
