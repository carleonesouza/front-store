import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Escolaridade } from 'app/models/escolaridade';
import { Estado } from 'app/models/estado';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { EstadoService } from '../estado.service';
import { ListEstadosComponent } from '../list-estados/list-estados.component';

@Component({
  selector: 'app-estado-details',
  templateUrl: './estado-details.component.html',
  styleUrls: ['./estado-details.component.scss']
})
export class EstadoDetailsComponent implements OnInit {

  @Input() estadoForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  user: User;
  creating: boolean = false;
  loading: boolean = false;
  estado$: Observable<Estado>;
  estado: Estado;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemsComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _estadoService: EstadoService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemsComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Estado';
      this.createEstadoForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.estado$ = this._estadoService.estado$;

      this._estadoService.estado$
        .pipe(
          delay(500),
          takeUntil(this._unsubscribeAll))
        .subscribe((estado: Estado) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();

          this.createEstadoForm();
          this.estadoForm.reset();

          // Get the Lista
          this.estado = estado;
          if (this.estado) {
            this.estadoForm.patchValue(this.estado);
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createEstadoForm(){
    this.estadoForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      nome: new UntypedFormControl('', Validators.required),
      sigla: new UntypedFormControl('', Validators.required),
      lstEstLoginInclusao: new UntypedFormControl(''),
      lstEstLoginAlteracao: new UntypedFormControl(''),
      lstEstLoginExclusao: new UntypedFormControl('')
    });
  }

  get estadoControls() {
    return this.estadoForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }


    /**
     * Close the drawer
     */
     async closeDrawer(): Promise<MatDrawerToggleResult> {
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
      this.title = 'Editar Estado';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/listas/estados']);
    }
    this.editMode = false;
  }

  async updateEstado() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
    if (this.estadoForm.valid && this.user) {
      if (this.estadoForm.updateOn === 'change' && !this.estadoForm.pristine) {
        this.estadoForm.value.lstEstLoginAlteracao = this.user.getFullName();
        const estado = new Estado(this.estadoForm.value);
        this._estadoService.editEstado(estado).subscribe(
          () => {
          this._snackBar.open('Estado Atualizado com Sucesso!', ' ' + 200, { duration: 6000 });
        });
      }

    }
  }

  async onSubmit(){
    await this._authService.getUser().then((user) =>{
      this.user = new User(user);
    });
    if(this.estadoForm.valid && this.user){
      this.estadoForm.value.lstEstLoginInclusao = this.user.getFullName();
      const estado = new Estado(this.estadoForm.value);
      this._estadoService.addEstado(estado).subscribe(()=>{
        this._snackBar.open('Estado Adicionado com Sucesso!', ' ' + 200, { duration: 6000 });
        this.closeDrawer();
        this.estadoForm.reset();
      });
    }
  }
}
