import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { RoleModel } from 'app/models/role.model';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoutesService } from '../../routes/routes.service';
import { SystemsService } from '../../systems/systems.service';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit, OnDestroy {

  @Input() roleForm: FormGroup;
  @Input() checked: boolean;
  editMode: boolean = false;
  saving: boolean = false;
  title: string;
  role: any;
  isActive: boolean;
  creating: boolean = false;
  loading: boolean = false;
  role$: Observable<any>;
  routes$: Observable<any>;
  routes: any[];
  systems: any[];
  systems$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _rolesService: RolesService,
    private _systemsService: SystemsService,
    private _routesService: RoutesService,
    public _dialog: DialogMessage,
    private _dialogMessage: DialogMessage,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,) {
    this.routes$ = this._routesService.getAllRoutes();
    this.systems$ = this._systemsService.getAllSystems();

  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Perfil';
      this.createRoleForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.role$ = this._rolesService.role$;

      this._rolesService.role$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((role: any) => {
          this.loading = false;
          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createRoleForm();
          this.roleForm.reset();

          // Get the Lista
          this.role = role['content'][0]?.role;
          this.isActive = role['content'][0]?.isActive;

          this.routes = role['content']?.map((perfils) => { if(perfils.rota){ return perfils.rota; } });

          this.systems = role['content']?.map((perfils) => { if(perfils.rota){ return perfils.rota.sistema; } });

          this.systems = this.getUniqueListBy(this.systems, 'name');

          if (this.role) {
            this.roleForm.patchValue({
              roles: this.role.roleName
            });
            this.roleForm.get('rota').patchValue({
              route: this.routes,
              sistema: this.systems
            });
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createRoleForm() {
    this.roleForm = this._formBuilder.group({
      roles: new FormControl('', Validators.required),
      rota: new FormGroup({
        recId: new FormControl(''),
        route: new FormControl(''),
        sistema: new FormControl('', Validators.required)
      }),
    });
  }

  createSystemForm() {
    return new FormGroup({
      system: new FormControl('', Validators.required),
    });
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

  get roleControls() {
    return this.roleForm.controls;
  }

  get systemsControls() {
    return (this.roleForm.get('systems') as FormArray).controls;
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }

  addSystemField(): void {

    const systemsFormArray = this._formBuilder.group({ system: [''] });

    (this.roleForm.get('systems') as FormArray).push(systemsFormArray);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  removeSystemField(index: number): void {

    // Get form array for address
    const systemsFormArray = this.roleForm.get('systems') as FormArray;

    const system = systemsFormArray.at(index);

    systemsFormArray.removeAt(index);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }



  /**
   * Close the drawer
   */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._listItemsComponent.matDrawer.close();
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
      this.title = 'Editar Perfil';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/configuracoes/perfil/lista']);
    }
    this.editMode = false;
  }

  desativaRole(event) {
    const ativaDesativa = this.role.isActive === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Perfil`, `Certeza que deseja ${ativaDesativa} Perfil?`,
      this.role, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          const role = new RoleModel(result?.item);
          role.isActive = role.isActive === true ? false : true;
          this._rolesService.ativaDesativaRole(role)
          .subscribe(() => {
            this.checked = true;
            this._router.navigate(['/admin/configuracoes/perfil/lista']);
              this.closeDrawer();
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
          });
      }else{
        this.checked = false;
      }
    });
  }

  updateRole() {
    if (this.roleForm.valid) {
      this.saving = true;
      const role = this.roleForm.get('roles').value;
      const roles = [{ roleName: role }];
      const rotas = {
        recId: this.roleForm.get('rota').value?.route?.recId,
        route: this.roleForm.get('rota').value?.route?.route,
        sistema: this.roleForm.get('rota').value?.sistema
      };
      const newRole = new RoleModel();
      newRole.rota = rotas;
      newRole.roles = roles;
      this._rolesService.addRoles(newRole)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/configuracoes/perfil/lista']);
            this._dialogMessage.showMessageResponse('Peril Alterado com Sucesso', 200);
            this.roleForm.reset();
          });
    }
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.saving = true;
      const role = this.roleForm.get('roles').value;
      const roles = [{ roleName: role }];
      const rotas = {
        recId: this.roleForm.get('rota').value?.route?.recId,
        createdBy: this.roleForm.get('rota').value?.route?.createdBy,
        route: this.roleForm.get('rota').value?.route?.route,
        sistema: this.roleForm.get('rota').value?.sistema
      };
      const newRole = new RoleModel();
      newRole.rota = rotas;
      newRole.roles = roles;
      this._rolesService.addRoles(newRole)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/configuracoes/perfil/lista']);
            this._dialogMessage.showMessageResponse('Perfil Criado com Sucesso', 200);
            this.roleForm.reset();
          });
    }
  }
}
