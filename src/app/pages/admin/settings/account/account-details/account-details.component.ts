import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSystemModel } from 'app/models/user-system.model';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RolesService } from '../../roles/roles.service';
import { AccountService } from '../account.service';



@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {

  @Input() userForm: FormGroup;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  displayedColumns: string[] = ['position', 'name'];
  editMode: boolean = false;
  title: string;
  user: any;
  regex = /(?=.*[a-z]).*(?=[0-9]).*(?=[A-Z]).*(?=[!?*])[a-zA-Z0-9!?*#]{8,}/g;
  creating: boolean = false;
  loading: boolean = false;
  hide = true;
  user$: Observable<any>;
  roles$: Observable<any[]>;
  rotas$: Observable<any[]>;
  rotas: any[];
  saving: boolean;
  useDefault = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _accountService: AccountService,
    private _rolesService: RolesService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _dialog: DialogMessage,
    public dialog: MatDialog) {
    this.roles$ = this._rolesService.roles$;
  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Usuário';
      this.createUserForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.user$ = this._accountService.user$;


      this._accountService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createUserForm();
          this.userForm.reset();

          // Get the Lista
          this.user = user[0];
          this.user.realmRoles = this.user?.realmRoles.filter(item => item !== 'default-roles-evo_api');
          const roles = this.user?.realmRoles.filter(item => item !== 'default-roles-evo_api');
          if (this.user) {
            this.userForm.patchValue({
              keycloakId: this.user?.id,
              email: this.user?.email,
              fullName: this.user?.firstName,
            });
            this.removeRoleField(0);

            this._accountService
              .rotasUserbyRoleId(roles[0])
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe();
            this.rotas$ = this._accountService.rolesRoutes$;

            this.rotas$
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe((rotas) => {
                this.rotas = rotas;
              });

            if (roles.length > 0) {
              roles.forEach((role) => {
                if (role !== null && role !== undefined && role !== '') {

                  const roleForm = this.createFormRoles();
                  roleForm.patchValue({
                    role: String(role).toUpperCase()
                  });
                  this.rolesFormArray.push(roleForm);
                }

              });
            }

            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  createUserForm() {
    this.userForm = this._formBuilder.group({
      keycloakId: new FormControl(''),
      roles: this._formBuilder.array([this.createFormRoles()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullName: new FormControl('', Validators.required),
      password: new FormControl(''),
      confirmPassword: new FormControl('')

    });
  }

  get userControls() {
    return this.userForm.controls;
  }

  get rolesControls() {
    return (this.userForm.get('roles') as FormArray).controls;
  }

  get rolesFormArray(): FormArray {
    return this.userForm.get('roles') as FormArray;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.roleName === c2 : c2 === c1.roleName;
  }

  createFormRoles() {
    return new FormGroup({
      role: new FormControl('', Validators.required)
    });
  }

  /**
   * Close the drawer
   */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._listItemsComponent.matDrawer.close();
  }

  addRoleField(): void {

    const roleFormGroup = this._formBuilder.group({ role: '' });

    (this.userForm.get('roles') as FormArray).push(roleFormGroup);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  desativaAccount(event: MatSlideToggleChange) {

    const ativaDesativa = this.user.ativo === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Conta`, `Certeza que deseja ${ativaDesativa} Conta?`,
    this.user, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }


  removeRoleField(index: number): void {

    // Get form array for address
    const roleFormArray = this.userForm.get('roles') as FormArray;
    const roles = this.user?.realmRoles.filter(item => item !== 'default-roles-evo_api');

    const role = roleFormArray.at(index);

    if (role.value?.role !== null && role.value.role !== undefined && role.value.role !== '' && roles >= 1) {
      const dialogRef = this._dialog.showDialog('Remover Role', 'Certeza que deseja Remover Role?', role.value, true);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {

          const userSystem = new UserSystemModel();
          userSystem.email = this.userForm.value?.email;
          userSystem.fullName = this.userForm.value?.fullName;
          userSystem.password = this.userForm.value?.password;
          userSystem.keycloakId = this.userForm.value?.keycloakId;
          userSystem.roles = [role.value?.role?.roleName];

          this._accountService.removeUserRole(userSystem).subscribe();
          // Remove the Endereço field
          roleFormArray.removeAt(index);
        }
      });
    } else {
      // Remove the Endereço field
      roleFormArray.removeAt(index);
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle edit mode
   *
   * @param editMode
   */
  toggleEditMode(editMode: boolean | null = null): void {
    if (editMode === null) {
      this.editMode = !this.editMode;
    }
    else {
      this.editMode = editMode;
      this.title = 'Editar Usuário';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/configuracoes/conta/lista']);
    }
    this.editMode = false;
  }

  updateUser() {

    if (this.userForm.valid) {
      const userSystem = new UserSystemModel();
      this.saving = true;
      userSystem.email = this.userForm.value?.email;
      userSystem.fullName = this.userForm.value?.fullName;
      userSystem.password = this.userForm.value?.password;
      userSystem.keycloakId = this.userForm.value?.keycloakId;
      const userRoles = [];
      const roles = this.userForm.get('roles').value;
      roles.map((role) => {
        userRoles.push(role.role);
      });
      userSystem.roles = userRoles;
      if (userSystem && userRoles.length >= 1) {
        this._accountService
          .updateUser(userSystem)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.saving = false;
              // Toggle the edit mode off
              this.toggleEditMode(false);

              this._snackBar.open('Usuário Atualizado com Sucesso!', 'OK', { duration: 6000 });
            }
          );
      }
    }

  }

  updatePassword() {
    if (this.userForm.valid) {
      const userSystem = new UserSystemModel();
      this.saving = true;
      userSystem.email = this.userForm.value?.email;
      userSystem.fullName = this.userForm.value?.fullName;
      userSystem.password = this.userForm.value?.password;
      userSystem.keycloakId = this.userForm.value?.keycloakId;
      const userRoles = [];
      const roles = this.userForm.get('roles').value;
      roles.map((role) => {
        userRoles.push(role.role);
      });
      userSystem.roles = userRoles;
      if (userSystem && userRoles.length >= 1) {
        this._accountService
          .updateUserPassword(userSystem)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.saving = false;
              // Toggle the edit mode off
              this.toggleEditMode(false);
              this._snackBar.open('Senha Atualizada com Sucesso!', 'OK', { duration: 6000 });
            }
          );
      }
    }

  }


  onSubmit() {
    if (this.userForm.valid) {
      const userSystem = new UserSystemModel();
      this.saving = true;
      userSystem.email = this.userForm.value.email;
      userSystem.fullName = this.userForm.value.fullName;
      userSystem.password = this.userForm.value.password;
      const userRoles = [];
      const roles = this.userForm.get('roles').value;
      roles.map((role) => {
        userRoles.push(role.role.roleName);
      });
      userSystem.roles = userRoles;
      if (userSystem && userRoles.length >= 1) {
        this._accountService
          .addUser(userSystem)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.saving = false;
              this.toggleEditMode(false);
              this.closeDrawer().then(() => true);
              this._router.navigate(['/admin/configuracoes/conta/lista']);
              this.userForm.reset();
            },
          );
      }
    }
  }
}
