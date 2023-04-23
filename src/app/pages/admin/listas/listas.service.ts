import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListasService {
  private _listas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _lista: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


   get listas$(): Observable<any> {
    return this._listas.asObservable();
  }

  get lista$(): Observable<any>{
    return this._lista.asObservable();
  }

  getListasDisponiveis(){
    return this._httpClient.get<any>(environment.apiList +'/tipos-listas')
    .pipe(
      tap((result) => {
        result = result.sort((a, b) => a.localeCompare(b));
        this._listas.next(result);
      }),
      catchError(this.error.handleError<[]>('getListasDisponiveis'))
    );
  }

  getTipoLista(page=0, size=10, tipoLista){
    return this._httpClient.get(environment.apiList +'lista', {
      params:{ page, size, tipoLista}
    })
    .pipe(
      tap(() => {
        console.log(tipoLista);
        this._lista.next(tipoLista);
      }),
      catchError(this.error.handleError<[]>('getTipoLista'))
    );
  }
}
