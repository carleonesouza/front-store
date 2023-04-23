import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { RoleModel } from 'app/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private _role: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }



   get role$(): Observable<any> {
    return this._role.asObservable();
  }


  get roles$(): Observable<any[]> {
    return this._roles.asObservable();
  }


  getAllRoles(): Observable<any[]>{
    return this._httpClient.get<any[]>(environment.apiManager+'roles/get-all').
    pipe(
      delay(500),
      tap((result) => {
        result = result.sort((a, b) => a.roleName.localeCompare(b.roleName));
        this._roles.next(result);
      }),
      catchError(this.error.handleError<any[]>('getAllRoles'))
    );
  }


  getRoleById(roleId: string): Observable<any>
    {
        return this._httpClient.get(environment.apiManager + 'routes/get-by-roleid', {params: {roleId}})
        .pipe(
          tap((result) =>{
            this._role.next(result);
          }),
          catchError(this.error.handleError<any>('getRoleById'))
        );
    }

    ativaDesativaRole(role): Observable<any>{
      return this._httpClient.patch(environment.apiManager +'roles/ativa-desativa', role)
      .pipe(
        tap((result) =>{
          console.log(result);
        }),
        catchError(this.error.handleError<any>('ativaDesativaRole'))
      );
    }



  addRoles(role): Observable<any>{
    return this._httpClient.post<any>(environment.apiManager+'roles/add-role', role)
    .pipe(
      tap((newRole) => {

        this._role.next(newRole);

        return newRole;
      }),
      catchError(this.error.handleError<any>('addRoles'))
    );
  }
}
