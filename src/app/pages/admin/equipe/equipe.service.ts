import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, tap, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  private _equipes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _equipe: BehaviorSubject<any | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError) { }


  get equipes$(): Observable<any[]> {
    return this._equipes.asObservable();
  }

  get equipe$(): Observable<any> {
    return this._equipe.asObservable();
  }


  getEquipeList(page = 0, size = 10, tipoLista='SEXOS') {
    return this._httpClient.get<any[]>(environment.apiList + 'lista', {
      params:{page, size, tipoLista}
    })
      .pipe(
        tap((result) => {
          this._equipes.next(result);
        }),
        catchError(this.error.handleError<any[]>('getEquipeList'))
      );
  }

  getEquipeById(id: string): Observable<any> {
    return this._equipes.pipe(
      take(1),
      map((equipes) => {

        // Find the Tipo Exame
        const equipe = equipes.find(item => parseInt(item.recId, 10) === parseInt(id, 10)) || null;

        // Update the Tipo Exame
        this._equipes.next(equipe);

        // Return the Tipo Exame
        return equipe;
      }),
      switchMap((equipe) => {

        if (!equipe) {
          return throwError('Could not found Equipe with id of ' + id + '!');
        }

        return of(equipe);
      }),
      catchError(this.error.handleError<any>('getEquipeById'))
    );
  }

}
