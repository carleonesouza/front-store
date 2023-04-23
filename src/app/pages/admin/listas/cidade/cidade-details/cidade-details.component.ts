import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Cidade } from 'app/models/cidade';
import { Estado } from 'app/models/estado';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { CidadeService } from '../cidade.service';
import { ListCidadesComponent } from '../list-cidades/list-cidades.component';


@Component({
  selector: 'app-cidade-details',
  templateUrl: './cidade-details.component.html',
  styleUrls: ['./cidade-details.component.scss']
})
export class CidadeDetailsComponent implements OnInit {

  @Input() cidadeForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  user: User;
  creating: boolean = false;
  loading: boolean = false;
  cidade: Cidade;
  cidade$: Observable<Cidade>;
  estados$: Observable<Estado[]>;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemsComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _cidadeService: CidadeService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,) {
    this.estados$ = this._cidadeService.getEstados();
  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Cidade';
      this.createCidadeForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.cidade$ = this._cidadeService.cidade$;

      this._cidadeService.cidade$
        .subscribe((cidade: Cidade) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createCidadeForm();
          this.cidadeForm.reset();

          // Get the Lista
          this.cidade = cidade;
          if (this.cidade) {
            this.cidadeForm.patchValue(this.cidade);
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createCidadeForm() {
    this.cidadeForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      lstCidDescricao: new UntypedFormControl('', Validators.required),
      estado: new UntypedFormControl('', Validators.required),
      lstCidLoginInclusao: new UntypedFormControl(''),
      lstCidLoginAlteracao: new UntypedFormControl(''),
      lstCidLoginExclusao: new UntypedFormControl('')
    });
  }

  get cidadeControls() {
    return this.cidadeForm.controls;
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
      this.title = 'Editar Cidade';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/cidade/lista/']);
    }
    this.editMode = false;
  }

  async updateCidade() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
    if (this.cidadeForm.valid && this.user) {
      if (this.cidadeForm.updateOn === 'change' && !this.cidadeForm.pristine) {
        this.cidadeForm.value.lstCidLoginAlteracao = this.user.getFullName();
        const cidade = new Cidade(this.cidadeForm.value);
        this._cidadeService.editCidade(cidade).subscribe(() => {
          this._snackBar.open('Cidade Atualizada com Sucesso!', ' ' + 200, { duration: 6000 });
        });
      }

    }
  }

  async onSubmit() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
    if (this.cidadeForm.valid && this.user) {
      this.cidadeForm.value.lstCidLoginInclusao = this.user.getFullName();
      const cidade = new Cidade(this.cidadeForm.value);
      this._cidadeService.addCidade(cidade).subscribe(() => {
        this._snackBar.open('Cidade Adicionada com Sucesso!', ' ' + 200, { duration: 6000 });
        this.closeDrawer();
        this._router.navigate(['/admin/cidade/lista/']);
        this.cidadeForm.reset();
      });
    }
  }

}
