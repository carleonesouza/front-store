import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoVinculoService {

  private _vinculos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _vinculo: BehaviorSubject<any | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError) { }


  get vinculos$(): Observable<any[]> {
    return this._vinculos.asObservable();
  }

  get vinculo$(): Observable<any> {
    return this._vinculo.asObservable();
  }


  getListasVinculo(page = 0, size = 10, tipoLista='TIPO_VINCULO') {
    return this._httpClient.get<any[]>(environment.apiList + 'lista', {
      params:{page, size, tipoLista}
    })
      .pipe(
        tap((result) => {
          let vinculos = result['content'];
          vinculos = vinculos.sort((a, b) => a?.lstTipVinDescricao.localeCompare(b?.lstTipVinDescricao));
          this._vinculos.next(vinculos);
        }),
        catchError(this.error.handleError<any[]>('getListasVinculo'))
      );
  }

  getVinculoById(id: string): Observable<any> {
    return this._vinculos.pipe(
      take(1),
      map((vinculos) => {

        // Find the vinculo
        const vinculo = vinculos.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the vinculo
        this._vinculo.next(vinculo);

        // Return the vinculo
        return vinculo;
      }),
      switchMap((vinculo) => {

        if (!vinculo) {
          return throwError('Could not found sexo with id of ' + id + '!');
        }

        return of(vinculo);
      }),
      catchError(this.error.handleError<any>('getVinculoById'))
    );
  }

  editTipoVinculo(tipoVinculo: any): Observable<any> {
    return this.vinculos$.pipe(
      take(1),
      switchMap(vinculos => this._httpClient.patch<any>(environment.apiList + 'edit-tipo-vinculo', tipoVinculo)
        .pipe(
          map((updatedVinculo) => {

            // Find the index of the updated Vículo
            const index = vinculos.findIndex(item => item.recId === tipoVinculo.recId);

            // Update the Vínculo
            vinculos[index] = updatedVinculo;

            // Update the Vículos
            this._vinculos.next(vinculos);

            // Return the updated Vínculo
            return updatedVinculo;
          }),
          switchMap(updatedVinculo => this.vinculo$.pipe(
            take(1),
            filter(item => item && item.recId === tipoVinculo.recId),
            tap(() => {
              // Update the Vínculo if it's selected
              this._vinculo.next(updatedVinculo);

              // Return the Vínculo
              return updatedVinculo;
            })
          )),
          catchError(this.error.handleError<any>('editTipoVinculo'))
        ))
    );
  }

  addTipoVinculo(tipoVinculo){
    return this._httpClient.post(environment.apiList + 'add-tipo-vinculo', tipoVinculo)
    .pipe(
      tap((result) =>{
        console.log(result);
      }),
      catchError(this.error.handleError<any>('addTipoVinculo'))
    );
  }

}
