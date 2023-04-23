import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { RolesService } from '../roles/roles.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _user: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roleRoute: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _rolesRoutes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, public dialog: MatDialog,
    private error: HandleError, public _snackBar: MatSnackBar,
    private _rolesService: RolesService) { }



  get user$(): Observable<any> {
    return this._user.asObservable();
  }

  get users$(): Observable<any[]> {
    return this._users.asObservable();
  }

  get roleRoute$(): Observable<any> {
    return this._roleRoute.asObservable();
  }

  get rolesRoutes$(): Observable<any[]> {
    return this._rolesRoutes.asObservable();
  }



  getAllUsers(first = 1, last= 20): Observable<any[]> {
    return this._httpClient.get<any[]>(environment.apiManager + `idp/busca-todos-usuarios?first=${first}&last=${last}`)
      .pipe(
        tap((result) => {
          result = result.filter(items => items.firstName !== null || items.firstName !== undefined || items.firstName !== '');
          //result = result.sort((a, b) => a.firstName.localeCompare(b.firstName));
          this._users.next(result);
        }),
        catchError(this.error.handleError<any[]>('getAllUsers'))
      );
  }

  getUserById(id): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + `idp/busca-usuario?id=${id}`)
      .pipe(
        tap((result) => {
          this._user.next(result);
        }),
        catchError(this.error.handleError<any>('getUserById'))
      );
  }

  removeUserRole(userRole){
    return this._httpClient.patch<any>(environment.apiManager + 'idp/remove-roles-usuario', userRole)
    .pipe(
      tap(() => {
        this._snackBar.open('Role removido com Sucesso!', '', { duration: 4000 });
      }),
      catchError(this.error.handleError<any>('removeUserRole'))
    );
  }

  searchUsers(email): Observable<any[]> {
    return this._httpClient.get<any[]>(environment.apiManager + 'idp/busca-usuario', {
      params: { email }
    }).pipe(
      tap((users) => {
        this._users.next(users);
      }),
      catchError(this.error.handleError<any>('searchUsers'))
    );
  }

  rotasUserbyRoleId(roleUser){
    let role;
    return this._rolesService.getAllRoles()
    .pipe(
      tap((result) => {
        result = result.filter(items => items.roleName === String(roleUser).toUpperCase());
        role = result;
        return role;
      }),
      switchMap(() => this._httpClient.get(environment.apiManager + `routes/get-by-roleid?page=0&roleId=${role[0].recId}&size=10`)
        .pipe(
          tap((rotasRoles) => {
            this._rolesRoutes.next(rotasRoles['content']);
          }),
          catchError(this.error.handleError<any>('checkRolesRoutes'))
        )
      ),
      catchError(this.error.handleError<any>('checkRolesRoutes'))
    );
  }

  updateUserPassword(userPassword): Observable<any>{
    return this._httpClient.post(environment.apiManager + 'idp/troca-senha-usuario', userPassword)
    .pipe(
      tap((result) => {
        console.log(result);
      }),
      catchError(this.error.handleError<any>('updateUserPassword'))
    );
  }

  updateUser(updateUser): Observable<any> {

    return this._httpClient.patch<any>(environment.apiManager + 'idp/edita-usuario', updateUser)
    .pipe(
      switchMap(() => this._httpClient.get<any>(environment.apiManager + `idp/busca-usuario?id=${updateUser.keycloakId}`)
      .pipe(
        switchMap(updatedUser => this.user$.pipe(
          //take(1),
          filter(item => item && item.id === updatedUser.id),
          tap(() => {
            // Update the user if it's selected
            this._user.next(updatedUser);
            // Return the user
            return updatedUser;
          })
        ))
    )));
  }

  associateUserCustomer(userCustomer){
    return this._httpClient.post(environment.apiManager + 'associa-usuario-cliente', userCustomer)
    .pipe(
      tap((result) => {
          console.log(result);
      }),
      catchError(this.error.handleError<any>('associateUserCustomer'))
    );
  }

  addUser(usuarioCliente): Observable<any> {
    return this._httpClient.post(environment.apiManager + 'idp/novo-usuario', usuarioCliente)
      .pipe(
        tap((result) => {
          const senha = result['password'];
            this.showDialog('Salve sua Senha Provisória!', senha, '', false);
        }),
        catchError(this.error.handleError<any>('addUsuario'))
      );
  }

  showDialog(title: string, message: string, item: any, confirmation: boolean): MatDialogRef<ConfirmationDialogComponent, any> {
    return this.dialog.open(ConfirmationDialogComponent, { width: 'auto', data: { title: title, message: message, confirm: confirmation, item } });
  }

}
