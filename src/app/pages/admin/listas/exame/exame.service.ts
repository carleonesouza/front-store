import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  private _exames: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _exame: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError) { }


   get exames$(): Observable<any> {
    return this._exames.asObservable();
  }

  get exame$(): Observable<any>{
    return this._exame.asObservable();
  }

  getListasExames(page = 0, size = 10, tipoLista='SEXOS'){
    return this._httpClient.get<any>(environment.apiList +'/tipos-listas',{
      params:{page, size, tipoLista}
    })
    .pipe(
      tap((result) => {
        this._exames.next(result);
      }),
      catchError(this.error.handleError<[]>('getListasEspecialidades'))
    );
  }

  getTipoLista(page=0, size=10, tipoLista){
    return this._httpClient.get(environment.apiList +'lista', {
      params:{ page, size, tipoLista}
    })
    .pipe(
      tap(() => {
        this._exame.next(tipoLista);
      }),
      catchError(this.error.handleError<[]>('getTipoLista'))
    );
  }
}
