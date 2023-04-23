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
export class ServicesService {

  private _service: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _services: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get service$(): Observable<any> {
    return this._service.asObservable();
  }


  get services$(): Observable<any[]> {
    return this._services.asObservable();
  }

  getAllServices(page=1, size=10): Observable<any[]>{
    return this._httpClient.get<any[]>(environment.apiManager+ `servicos/busca-servicos?page=${page}&size=${size}`).
    pipe(
      tap((result) => {
        console.log(result);
        this._services.next(result);
        return result;
      }),
      catchError(this.error.handleError<any[]>('getAllServices'))
    );
  }

  getSericeById(id): Observable<any>{
    return this._httpClient.get(environment.apiManager + 'busca-servico', { params: id})
    .pipe(
      tap((result) =>{
        console.log(result);
        this._service.next(result);
      }),
      catchError(this.error.handleError<any[]>('getSericeById'))
    );
  }

  addService(service): Observable<any>{
    return this._httpClient.post(environment.apiManager + 'add-servico', service)
    .pipe(
      tap((result) =>{
        console.log(result);
      }),
      catchError(this.error.handleError<any[]>('addService'))
    );
  }


}
