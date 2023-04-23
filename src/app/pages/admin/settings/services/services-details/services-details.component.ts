import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.scss']
})
export class ServicesDetailsComponent implements OnInit, OnDestroy {

  @Input() serviceForm: FormGroup;
  editMode: boolean = false;
  saving: boolean = false;
  title: string;
  service: any;
  creating: boolean = false;
  loading: boolean = false;
  service$: Observable<any>;
  private user: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _servicesService: ServicesService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _dialogMessage: DialogMessage,
    private _router: Router,
    public dialog: MatDialog,) {
  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Serviço';
      this.createSystemForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.service$ = this._servicesService.service$;

      this._servicesService.service$
      .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((service: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createSystemForm();
          this.serviceForm.reset();

          // Get the Lista
          this.service = service;
          if (this.service) {
            this.serviceForm.patchValue(this.service);
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

  createSystemForm() {
    this.serviceForm = this._formBuilder.group({
      servDescricao: new FormControl('', Validators.required),
    });
  }

  get serviceControls() {
    return this.service.controls;
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
      this.title = 'Editar Serviço';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/settings/services']);
    }
    this.editMode = false;
  }

  async updateSystem() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
  }

  onSubmit() {
    if(this.serviceForm.valid){
      console.log(this.serviceForm.value);
    }
  }

}
