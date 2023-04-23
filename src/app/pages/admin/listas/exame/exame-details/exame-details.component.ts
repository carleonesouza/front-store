import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { TipoExameService } from '../../tipo-exame/tipo-exame.service';
import { ExameService } from '../exame.service';

@Component({
  selector: 'app-exame-details',
  templateUrl: './exame-details.component.html',
  styleUrls: ['./exame-details.component.scss']
})
export class ExameDetailsComponent implements OnInit {

  @Input() exameForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  exame$: Observable<any>;
  exame: any;
  tipoExames$: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _exameService: ExameService,
    private _tipoExameService: TipoExameService,
    private _router: Router,
    public dialog: MatDialog) {
      this.tipoExames$ = this._tipoExameService.tipoExames$;
     }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Exame';
      this.createExameForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.exame$ = this._exameService.exame$;

      this.exame$
        .subscribe((exame) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createExameForm();
          this.exameForm.reset();
          this.exame = exame;
          // Get the Lista
          if (this.exame) {
            this.loading = false;
            this.exameForm.patchValue(this.exame);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createExameForm(){
    this.exameForm = this._formBuilder.group({
      lstExaDocDescricao: new UntypedFormControl(''),
      lstTipExaRecId: new UntypedFormControl('')
    });
  }

  get exameControls() {
    return this.exameForm.controls;
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
      this.title = 'Editar Exame';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/listas/exame/list']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.exameForm.valid) {
      console.log(this.exameForm.value);
    }
  }

  onSubmit(){
    if(this.exameForm.valid){
     console.log(this.exameForm.value);
    }
  }
}
