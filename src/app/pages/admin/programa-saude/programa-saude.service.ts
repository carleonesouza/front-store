import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProgramaSaude } from 'app/models/programaSaude.model';
import { DialogMessage } from 'app/utils/dialog-message ';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, tap, take, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgramaSaudeService {

  private _programaSaudes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _programaSaude: BehaviorSubject<any | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError,
    private dialogMessage: DialogMessage) { }


  get programaSaudes$(): Observable<any[]> {
    return this._programaSaudes.asObservable();
  }

  get programaSaude$(): Observable<any> {
    return this._programaSaude.asObservable();
  }


  getProgramaSaudeList(page = 0, size = 10) {
    return this._httpClient.get<any[]>(environment.apiManager + 'programa-saude/busca', {
      params: { page, size }
    })
      .pipe(
        tap((result) => {
          let programas = result['content'];
          programas = programas.sort((a, b) => a.progSauDescricao.localeCompare(b.progSauDescricao));
          this._programaSaudes.next(programas);
        }),
        catchError(this.error.handleError<any[]>('getProgramaSaudeList'))
      );
  }

  getProgramaSaudeById(id: string): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'programa-saude/busca', {
      params: { id }
    })
      .pipe(
        tap((result) => {
          this._programaSaude.next(result['content'][0]);
        }),
        catchError(this.error.handleError<any>('getProgramaSaudeById'))
      );
  }

  deactivateActiveProgramaSaude(programaSaude){
    return this._httpClient.patch(environment.apiManager + 'programa-saude/altera-status', programaSaude)
    .pipe(
      catchError(this.error.handleError<any>('inativaProgramaSaude'))
    );
  }


  editPrograma(programa): Observable<any> {
    return this.programaSaudes$.pipe(
      take(1),
      switchMap(programas => this._httpClient.patch<any>(environment.apiManager + 'programa-saude/edit', programa)
        .pipe(
          map((updatedPrograma) => {

            // Find the index of the updated Programa
            const index = programas.findIndex(item => item.recId === programa.recId);

            // Update the Programa
            programas[index] = updatedPrograma;

            // Update the Programas
            this._programaSaudes.next(programas);

            // Return the updated Programa
            return updatedPrograma;
          }),
          switchMap(updatedPrograma => this.programaSaude$.pipe(
            take(1),
            filter(item => item && item.recId === programa.recId),
            tap(() => {
              // Update the Programa if it's selected
              this._programaSaude.next(updatedPrograma);

              // Return the Programa
              return updatedPrograma;
            })
          )),
          catchError(this.error.handleError<any>('editPrograma'))
        ))
    );
  }

  addProgramaSaude(programaSaude: ProgramaSaude) {
    return this._httpClient.post(environment.apiManager + 'programa-saude/add-programa-saude', programaSaude)
      .pipe(
        tap((result) => {
          this._programaSaude.next(result);
          this.dialogMessage.showMessageResponse('Programa Saúde Salvo com Sucesso', 'OK');
        }),
        catchError(this.error.handleError<any>('addProgramaSaude'))
      );
  }

}
