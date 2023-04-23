import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Escolaridade } from 'app/models/escolaridade';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EscolaridadeService } from '../escolaridade.service';
import { ListEscolaridadeComponent } from '../list-escolaridades/list-escolaridades.component';

@Component({
  selector: 'app-escolaridade-details',
  templateUrl: './escolaridade-details.component.html',
  styleUrls: ['./escolaridade-details.component.scss']
})
export class EscolaridadeDetailsComponent implements OnInit {

  @Input() escolaridadeForm: FormGroup;
  editMode: boolean = false;
  title: string;
  user: User;
  creating: boolean = false;
  loading: boolean = false;
  escolaridade$: Observable<Escolaridade>;
  escolaridade: Escolaridade;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _escolaridadeService: EscolaridadeService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemsComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Escolaridade';
      this.createEscolaridadeForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.escolaridade$ = this._escolaridadeService.escolaridade$;

      this._escolaridadeService.escolaridade$
        .subscribe((escolaridade: Escolaridade) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createEscolaridadeForm();
          this.escolaridadeForm.reset();

          // Get the Lista
          this.escolaridade = escolaridade;
          if (this.escolaridade) {
            this.escolaridadeForm.patchValue(this.escolaridade);
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createEscolaridadeForm(){
    this.escolaridadeForm = this._formBuilder.group({
      recId: new FormControl(''),
      escolaridade: new FormControl('', Validators.required),
      lstEscLoginAlteracao: new FormControl(''),
      lstEscLoginInclusao: new FormControl(''),
      lstEscLoginExclusao: new FormControl('')
    });
  }

  get escolaridadeControls() {
    return this.escolaridadeForm.controls;
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
      this.title = 'Editar Escolaridade';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/listas/escolaridades']);
    }
    this.editMode = false;
  }

  async updateEscolaridade() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
    if (this.escolaridadeForm.valid && this.user) {
      if (this.escolaridadeForm.updateOn === 'change' && !this.escolaridadeForm.pristine) {
        this.escolaridadeForm.value.lstEscLoginAlteracao = this.user.getFullName();
        const escolaridade = new Escolaridade(this.escolaridadeForm.value);
        this._escolaridadeService.editEscolaridade(escolaridade).subscribe(
          () => {
          this._snackBar.open('Escolaridade Atualizada com Sucesso!', ' ' + 200, { duration: 6000 });
        });
      }
    }
  }

  async onSubmit(){
    await this._authService.getUser().then((user) =>{
      this.user = new User(user);
    });
    if(this.escolaridadeForm.valid && this.user){
      this.escolaridadeForm.value.lstEscLoginInclusao = this.user.getFullName();
      this.escolaridadeForm.value.lstEscDescricao = this.escolaridadeForm.value.escolaridade;
      const escolaridade = new Escolaridade(this.escolaridadeForm.value);

      this._escolaridadeService.addEscolaridade(escolaridade).subscribe(()=>{
        this._snackBar.open('Escolaridade Adicionada com Sucesso!', ' ' + 200, { duration: 6000 });
        this.closeDrawer();
        this.escolaridadeForm.reset();
      });
    }
  }
}
