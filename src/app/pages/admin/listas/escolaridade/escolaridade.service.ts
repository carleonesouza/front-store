import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Escolaridade } from 'app/models/escolaridade';
import { MatSnackBarComponent } from 'app/shared/mat-snack-bar/mat-snack-bar.component';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EscolaridadeService {

  private _escolaridades: BehaviorSubject<Escolaridade[] | null> = new BehaviorSubject(null);
  private _escolaridade: BehaviorSubject<Escolaridade | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError,
     public _snackBar: MatSnackBar, private snackBar: MatSnackBarComponent) { }


  get escolaridades$(): Observable<Escolaridade[]> {
    return this._escolaridades.asObservable();
  }

  get escolaridade$(): Observable<Escolaridade> {
    return this._escolaridade.asObservable();
  }


  getListaEscolaridades(page = 0, size = 10, tipoLista='ESCOLARIDADES') {
    return this._httpClient.get<Escolaridade[]>(environment.apiList + 'lista', {params:{
      page, size, tipoLista
    }})
      .pipe(
        tap((result) => {
          let escolaridades = result['content'];
          escolaridades = escolaridades.sort((a, b) => a.escolaridade.localeCompare(b.escolaridade));
          this._escolaridades.next(escolaridades);
        }),
        catchError(this.error.handleError<Escolaridade[]>('getListaEscolaridades'))
      );
  }

  getEscolaridadeById(id: string): Observable<Escolaridade> {
    return this._escolaridades.pipe(
      take(1),
      map((escolaridades) => {

        // Find the Escolaridade
        const escolaridade = escolaridades.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Escolaridade
        this._escolaridade.next(escolaridade);

        // Return the Escolaridade
        return escolaridade;
      }),
      switchMap((escolaridade) => {

        if (!escolaridade) {
          return throwError('Could not found Escolaridade with id of ' + id + '!');
        }

        return of(escolaridade);
      }),
      catchError(this.error.handleError<Escolaridade>('getEscolaridadeById'))
    );
  }

  editEscolaridade(escolaridade: Escolaridade): Observable<Escolaridade> {
    return this.escolaridades$.pipe(
      take(1),
      switchMap(escolaridades => this._httpClient.patch<Escolaridade>(environment.apiList + 'edit-escolaridade', escolaridade)
      .pipe(
        map((updatedEscolaridade) => {

          // Find the index of the updated Escolaridade
          const index = escolaridades.findIndex(item => item.recId === escolaridade.recId);

          // Update the Escolaridade
          escolaridades[index] = updatedEscolaridade;

          // Update the Escolaridades
          this._escolaridades.next(escolaridades);

          // Return the updated Escolaridade
          return updatedEscolaridade;
        }),
        switchMap(updatedEscolaridade => this.escolaridade$.pipe(
          take(1),
          filter(item => item && item.recId === escolaridade.recId),
          tap(() => {
            // Update the Escolaridade if it's selected
            this._escolaridade.next(updatedEscolaridade);

            // Return the Escolaridade
            return updatedEscolaridade;
          })
        )),
        catchError(this.error.handleError<Escolaridade>('editEscolaridade'))
      ))
    );
  }

  addEscolaridade(escolaridade: Escolaridade): Observable<any> {
    return this._httpClient.post(environment.apiList + 'add-escolaridade', escolaridade)
      .pipe(
        catchError(this.error.handleError<Escolaridade>('addEscolaridade'))
      );
  }

  updateObservable(escolaridade: Escolaridade) {
    this._escolaridades.pipe(map((escolaridades) => {
      escolaridades = escolaridades.filter(u => u.recId !== escolaridade.recId ? u : escolaridade);
      this._escolaridades.next(escolaridades);
    })
    );
  }

  searchEscolaridade(query): Observable<any> {
    return this.escolaridades$.pipe(
      take(1),
      first(),
      tap((escolaridades) => {
        let escolas = escolaridades.filter(escola => escola.escolaridade && escola.escolaridade.toLowerCase().includes(query.toLowerCase()));
        // Sort the contacts by the name field by default
        escolas = escolas.sort((a, b) => a.escolaridade.localeCompare(b.escolaridade));

        if (escolas.length) {
          this._escolaridades.next(escolas);
        } else {
          this.snackBar.openSnackBar('Desculpas, não encontramos a Escolaridade ' + query + '!', 'X', 'red-snackbar');
          return throwError('Could not found Escolaridade with id of ' + query + '!');
        }
        return escolas;

      }),
      catchError(this.error.handleError<Escolaridade>('searchEscolaridade'))
    );
  }

}
