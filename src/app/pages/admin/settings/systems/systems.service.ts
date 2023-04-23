import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { System } from 'app/models/system.model';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemsService {

  private _system: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _systems: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }



   get system$(): Observable<any> {
    return this._system.asObservable();
  }

  get systems$(): Observable<any[]> {
    return this._systems.asObservable();
  }


  getAllSystems(): Observable<any[]>{
    return this._httpClient.get<any[]>(environment.apiManager+'sistemas/get-all').
    pipe(
      delay(500),
      tap((result) => {
        result.map((a) =>{a.name = a.name.replace('_', ' ');});
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        this._systems.next(result);
      }),
      catchError(this.error.handleError<any[]>('getSystems'))
    );
  }



  getSystemById(id: string): Observable<any>
    {
        return this._systems.pipe(
            take(1),
            map((systems) => {

                // Find the systems
                const system = systems.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

                // Update the systems
                this._system.next(system);

                // Return the systems
                return system;
            }),
            switchMap((system) => {

                if ( !system )
                {
                    return throwError('Could not found role with id of ' + id + '!');
                }

                return of(system);
            })
        );
    }

    searchSystems(sistemaId ): Observable<any[]> {
      return this._httpClient.get<any[]>(environment.apiManager + 'sistemas/busca-sistema', {
        params: { sistemaId }
      }).pipe(
        tap((system) => {
          this._systems.next([system]);
        }),
        catchError(this.error.handleError<any>('searchSystems'))
      );
    }

    addSystem(system): Observable<any>{
      return this._httpClient.post<any>(environment.apiManager + 'sistemas/add-sistema', system)
      .pipe(
        tap((newSystem) => {

          this._system.next(newSystem);

          return newSystem;
        }),
        catchError(this.error.handleError<any>('addSystem'))
      );
    }


}
