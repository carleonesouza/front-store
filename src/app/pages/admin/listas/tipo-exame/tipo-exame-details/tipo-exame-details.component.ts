import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { TipoExameService } from '../tipo-exame.service';

@Component({
  selector: 'app-tipo-exame-details',
  templateUrl: './tipo-exame-details.component.html',
  styleUrls: ['./tipo-exame-details.component.scss']
})
export class TipoExameDetailsComponent implements OnInit {

  @Input() tipoExameForm: FormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  tipoExame$: Observable<any>;
  tipoExame: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _tipoExameService: TipoExameService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Tipo Exame';
      this.createTipoExameForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.tipoExame$ = this._tipoExameService.tipoExame$;

      this.tipoExame$
        .subscribe((tipoExame) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createTipoExameForm();
          this.tipoExameForm.reset();
          this.tipoExame = tipoExame;
          // Get the Lista
          if (this.tipoExame) {
            this.loading = false;
            this.tipoExameForm.patchValue(this.tipoExame);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createTipoExameForm(){
    this.tipoExameForm = this._formBuilder.group({
      lstTipExaDescricao: new FormControl(''),
    });
  }

  get tipoExameControls() {
    return this.tipoExameForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }


    /**
     * Close the drawer
     */
     async closeDrawer(): Promise<MatDrawerToggleResult> {
      return this._listItemComponent.matDrawer.close();
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
      this.title = 'Editar Tipo Exame';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/listas/tipo-exame/list']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.tipoExameForm.valid) {
      console.log(this.tipoExameForm.value);
    }
  }

  onSubmit(){
    if(this.tipoExameForm.valid){
     console.log(this.tipoExameForm.value);
    }
  }
}
