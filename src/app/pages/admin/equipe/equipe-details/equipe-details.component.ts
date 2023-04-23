import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { EquipeService } from '../equipe.service';

@Component({
  selector: 'app-equipe-details',
  templateUrl: './equipe-details.component.html',
  styleUrls: ['./equipe-details.component.scss']
})
export class EquipeDetailsComponent implements OnInit {

  @Input() equipeForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  equipe$: Observable<any>;
  equipe: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _equipeService: EquipeService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Equipe';
      this.createEquipeForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.equipe$ = this._equipeService.equipe$;

      this.equipe$
        .subscribe((equipe) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createEquipeForm();
          this.equipeForm.reset();
          this.equipe = equipe;
          // Get the Lista
          if (this.equipe) {
            this.loading = false;
            this.equipeForm.patchValue(this.equipe);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createEquipeForm(){
    this.equipeForm = this._formBuilder.group({
      equNome: new UntypedFormControl(''),
    });
  }

  get equipeControls() {
    return this.equipeForm.controls;
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
      this.title = 'Editar Equipe';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/equipes/list']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.equipeForm.valid) {
      console.log(this.equipeForm.value);
    }
  }

  onSubmit(){
    if(this.equipeForm.valid){
     console.log(this.equipeForm.value);
    }
  }
}

