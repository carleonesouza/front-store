import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  private _especialidades: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _especialidade: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError) { }


   get especialidades$(): Observable<any> {
    return this._especialidades.asObservable();
  }

  get especialidade$(): Observable<any>{
    return this._especialidade.asObservable();
  }

  getListasEspecialidades(page = 0, size = 10, tipoLista='SEXOS'){
    return this._httpClient.get<any>(environment.apiList +'/tipos-listas',{
      params:{page, size, tipoLista}
    })
    .pipe(
      tap((result) => {
        //let especialidades = result['content'];
        //especialidades = especialidades.sort((a, b) => a?.lstTipVinDescricao.localeCompare(b?.lstTipVinDescricao));
        this._especialidades.next(result);
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
        this._especialidade.next(tipoLista);
      }),
      catchError(this.error.handleError<[]>('getTipoLista'))
    );
  }
}
