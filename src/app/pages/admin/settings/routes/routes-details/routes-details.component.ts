import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesModel } from 'app/models/route.model';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RolesService } from '../../roles/roles.service';
import { SystemsService } from '../../systems/systems.service';
import { RoutesService } from '../routes.service';


@Component({
  selector: 'app-routes-details',
  templateUrl: './routes-details.component.html',
  styleUrls: ['./routes-details.component.scss']
})
export class RoutesDetailsComponent implements OnInit, OnDestroy {

  @Input() routeForm: UntypedFormGroup;
  @Input() checked: boolean;
  editMode: boolean = false;
  saving: boolean = false;
  title: string;
  route: any;
  creating: boolean = false;
  loading: boolean = false;
  route$: Observable<any>;
  roles$: Observable<any>;
  roles: any[];
  systems$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _routesService: RoutesService,
    private _systemsService: SystemsService,
    private _rolesService: RolesService,
    public _dialog: DialogMessage,
    private _dialogMessage: DialogMessage,
    private _route: ActivatedRoute,
    private _router: Router) {
      this.systems$ = this._systemsService.getAllSystems();
      this.roles$ = this._rolesService.getAllRoles();
  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Rota';
      this.createRouteForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.route$ = this._routesService.route$;

      this._routesService.route$
      .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((route: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createRouteForm();

          // Get the Lista
          this.route = route;
          if (this.route) {

            this.routeForm.patchValue({
              roles: this.route.roles[0],
              rota:{route: this.route.route,
              sistema: this.route.sistema}
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createRouteForm() {
    this.routeForm = this._formBuilder.group({
      roles:  new UntypedFormControl(),
      rota: new UntypedFormGroup({
        route: new UntypedFormControl('', Validators.required),
        sistema: new UntypedFormControl('', Validators.required)
      }),
    });
  }

  get routeControls() {
    return this.routeForm.controls;
  }

  get rolesControls(){
    return (this.routeForm.get('roles') as UntypedFormArray).controls;
  }

  get systemsControls(){
    return (this.routeForm.get('rota').get('sistema') as UntypedFormArray).controls;
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
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
      this.title = 'Editar Rota';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/configuracoes/rota/lista']);
    }
    this.editMode = false;
  }

  desativaRota(event) {
    const ativaDesativa = this.route.isActive === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Rota`, `Certeza que deseja ${ativaDesativa} Rota?`,
      this.route, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          const route = new RoutesModel(result?.item);
          route.isActive = route.isActive === true ? false : true;
          this._routesService.ativaDesativaRoute(route)
          .subscribe(() => {
            this.checked = true;
            this._router.navigate(['/admin/configuracoes/rota/lista']);
              this.closeDrawer();
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
          });
      }else{
        this.checked = false;
      }
    });
  }

  updateRota() {
    if(this.routeForm.valid) {
      console.log(this.routeForm.value);
    }
  }

  onSubmit() {
    if(this.routeForm.valid) {
      this.saving = true;
      const role = this.routeForm.get('roles').value;
      const roles =  [{ roleName: role.roleName }];
      const newRoutes = new RoutesModel(this.routeForm.value);
      newRoutes.roles = roles;
        this._routesService.addRoute(newRoutes)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
          this.saving = false;
          this.toggleEditMode(false);
          this.closeDrawer().then(() => true);
          this._router.navigate(['/admin/configuracoes/rota/lista']);
          this._dialogMessage.showMessageResponse('Rota Criada com Sucesso', 201);
          this.routeForm.reset();
        });
    }
  }
}
