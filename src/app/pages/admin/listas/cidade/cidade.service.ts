import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cidade } from 'app/models/cidade';
import { Estado } from 'app/models/estado';
import { MatSnackBarComponent } from 'app/shared/mat-snack-bar/mat-snack-bar.component';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private _cidades: BehaviorSubject<Cidade[] | null> = new BehaviorSubject(null);
  private _cidade: BehaviorSubject<Cidade | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError,
    public _snackBar: MatSnackBar, private snackBar: MatSnackBarComponent) { }


  get cidades$(): Observable<Cidade[]> {
    return this._cidades.asObservable();
  }

  get cidade$(): Observable<Cidade> {
    return this._cidade.asObservable();
  }


  getListaCidades(page = 0, size = 10, tipoLista = 'CIDADES') {
    return this._httpClient.get<Cidade[]>(environment.apiList + 'lista', {
      params: {
        page, size, tipoLista
      }
    })
      .pipe(
        tap((result) => {
          let cidades = result['content'];
          cidades = cidades.sort((a, b) => a.lstCidDescricao.localeCompare(b.lstCidDescricao));
          this._cidades.next(cidades);
        }),
        catchError(this.error.handleError<Cidade[]>('getCidadas'))
      );
  }

  searchCidades(query): Observable<any> {
    return this.cidades$.pipe(
      take(1),
      first(),
      tap((cidades) => {
        let cidade = cidades.filter(cdd => cdd.lstCidDescricao && cdd.lstCidDescricao.toLowerCase().includes(query.toLowerCase()));
        // Sort the contacts by the name field by default
        cidade = cidade.sort((a, b) => a.lstCidDescricao.localeCompare(b.lstCidDescricao));

        if (cidade.length) {
          this._cidades.next(cidade);
        } else {
          this.snackBar.openSnackBar('Desculpas, não encontramos a Cidade ' + query + '!', 'X', 'red-snackbar');
          return throwError('Could not found Cidade with id of ' + query + '!');
        }
        return cidade;

      }),
      catchError(this.error.handleError<Cidade>('searchCidades'))
    );
  }

  /**
   *
   * @return a list of estados
   */
  getEstados(tipoLista = 'ESTADOS', page = 0, size = 27) {
    return this._httpClient.get<Estado[]>(environment.apiList + 'lista', { params: { tipoLista, page, size } })
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Estado[]>('getEstados'))
      );
  }

  getCidadeById(id: string): Observable<Cidade> {
    return this._cidades.pipe(
      take(1),
      map((cidades) => {

        // Find the Cidade
        const cidade = cidades.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Cidade
        this._cidade.next(cidade);

        // Return the Cidade
        return cidade;
      }),
      switchMap((cidade) => {

        if (!cidade) {
          return throwError('Could not found Cidade with id of ' + id + '!');
        }

        return of(cidade);
      }),
      catchError(this.error.handleError<Cidade>('getCidadeById'))
    );
  }

  editCidade(cidade: Cidade): Observable<Cidade> {
    return this.cidades$.pipe(
      take(1),
      switchMap(cidades => this._httpClient.patch<Cidade>(environment.apiList + 'edit-cidade', cidade)
        .pipe(
          map((updatedCidade) => {

            // Find the index of the updated Cidade
            const index = cidades.findIndex(item => item.recId === cidade.recId);

            // Update the Cidade
            cidades[index] = updatedCidade;

            // Update the Cidades
            this._cidades.next(cidades);

            // Return the updated Cidade
            return updatedCidade;
          }),
          switchMap(updatedCidade => this.cidade$.pipe(
            take(1),
            filter(item => item && item.recId === cidade.recId),
            tap(() => {
              // Update the Cidade if it's selected
              this._cidade.next(updatedCidade);

              // Return the Cidade
              return updatedCidade;
            })
          )),
          catchError(this.error.handleError<Cidade>('editCidade'))
        ))
    );
  }

  addCidade(cidade: Cidade): Observable<any> {
    return this._httpClient.post(environment.apiList + 'add-cidade', cidade)
      .pipe(
        tap(() => {
          this.snackBar.openSnackBar('Cidade criada com Sucesso!', 'X', 'green-snackbar');
        }),
        catchError(this.error.handleError<Cidade>('addCidade'))
      );
  }
}
