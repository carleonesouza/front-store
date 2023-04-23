import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Estado } from 'app/models/estado';
import { Genero } from 'app/models/genero';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil, delay} from 'rxjs/operators';
import { GeneroService } from '../genero.service';

@Component({
  selector: 'app-genero-details',
  templateUrl: './genero-details.component.html',
  styleUrls: ['./genero-details.component.scss']
})
export class GeneroDetailsComponent implements OnInit {

  @Input() generoForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  user: User;
  creating: boolean = false;
  loading: boolean = false;
  genero$: Observable<Genero>;
  genero: Genero;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _generoService: GeneroService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Gênero';
      this.createGeneroForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.genero$ = this._generoService.genero$;

      this._generoService.genero$
        .pipe(
          delay(500),
          takeUntil(this._unsubscribeAll))
        .subscribe((genero: Genero) => {

          // Open the drawer in case it is closed
          this._listComponent.matDrawer.open();
          this.createGeneroForm();
          this.generoForm.reset();

          // Get the Lista
          this.genero = genero;
          if (this.genero) {
            this.generoForm.patchValue(this.genero);
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createGeneroForm(){
    this.generoForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      genero: new UntypedFormControl('', Validators.required),
      lstGenLoginInclusao: new UntypedFormControl(''),
      lstGenLoginAlteracao: new UntypedFormControl(''),
      lstGenLoginExclusao: new UntypedFormControl('')
    });
  }

  get generoControls() {
    return this.generoForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }


    /**
     * Close the drawer
     */
     async closeDrawer(): Promise<MatDrawerToggleResult> {
      return this._listComponent.matDrawer.close();
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
      this.title = 'Editar Gênero';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/listas/generos']);
    }
    this.editMode = false;
  }

  async updateGenero() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
    if (this.generoForm.valid && this.user) {
      if (this.generoForm.updateOn === 'change' && !this.generoForm.pristine) {
        this.generoForm.value.lstGenLoginAlteracao = this.user.getFullName();
        const genero = new Genero(this.generoForm.value);
        this._generoService.editGenero(genero).subscribe(
          () => {
          this._snackBar.open('Gênero Atualizado com Sucesso!', ' ' + 200, { duration: 6000 });
        });
      }
    }
  }

  async onSubmit(){
    await this._authService.getUser().then((user) =>{
      this.user = new User(user);
    });
    if(this.generoForm.valid && this.user){
      this.generoForm.value.lstGenLoginInclusao = this.user.getFullName();
      const genero = new Genero(this.generoForm.value);
      this._generoService.addGenero(genero).subscribe(()=>{
        this._snackBar.open('Gênero Adicionado com Sucesso!', ' ' + 200, { duration: 6000 });
        this.generoForm.reset();
      });
    }
  }
}
