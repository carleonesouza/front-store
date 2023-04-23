import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProgramaCliente } from 'app/models/programaCliente.model';
import { DialogMessage } from 'app/utils/dialog-message ';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, tap, take, map, filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgramaClienteService {

  private _programaClientes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _programaCliente: BehaviorSubject<any | null> = new BehaviorSubject(null);


  constructor(private _httpClient: HttpClient, private error: HandleError,
    private dialogMessage: DialogMessage) { }


  get programaClientes$(): Observable<any[]> {
    return this._programaClientes.asObservable();
  }

  get programaCliente$(): Observable<any> {
    return this._programaCliente.asObservable();
  }


  getProgramaClienteList(page = 0, size = 10) {
    return this._httpClient.get<any[]>(environment.apiManager + 'programa-cliente/busca', {
      params:{page, size}
    })
      .pipe(
        tap((result) => {
          let programas = result['content'];
          programas = programas.sort((a, b) => a.progCliDescricao.localeCompare(b.progCliDescricao));
          this._programaClientes.next(programas);
        }),
        catchError(this.error.handleError<any[]>('getProgramaClienteList'))
      );
  }

  getProgramaClienteById(id: string): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'programa-cliente/busca', {
      params:{id}
    })
      .pipe(
        tap((result) => {
          this._programaCliente.next(result['content'][0]);
        }),
        catchError(this.error.handleError<any[]>('getProgramaClienteById'))
      );
  }

  deactivateActiveProgramaCliente(programaCliente){
    return this._httpClient.patch(environment.apiManager + 'programa-cliente/altera-status', programaCliente)
    .pipe(
      catchError(this.error.handleError<any>('deactivateActiveProgramaCliente'))
    );
  }

  editPrograma(programa): Observable<any> {
    return this.programaClientes$.pipe(
      take(1),
      switchMap(programas => this._httpClient.patch<any>(environment.apiManager + 'programa-cliente/edit', programa)
        .pipe(
          map((updatedPrograma) => {

            // Find the index of the updated Programa
            const index = programas.findIndex(item => item.recId === programa.recId);

            // Update the Programa
            programas[index] = updatedPrograma;

            // Update the Programas
            this._programaClientes.next(programas);

            // Return the updated Programa
            return updatedPrograma;
          }),
          switchMap(updatedPrograma => this.programaCliente$.pipe(
            take(1),
            filter(item => item && item.recId === programa.recId),
            tap(() => {
              // Update the Programa if it's selected
              this._programaCliente.next(updatedPrograma);

              // Return the Programa
              return updatedPrograma;
            })
          )),
          catchError(this.error.handleError<any>('editPrograma'))
        ))
    );
  }

  addProgramaCliente(programaCliente: ProgramaCliente){
      return this._httpClient.post(environment.apiManager + 'programa-cliente/add-programa-cliente', programaCliente)
      .pipe(
        tap((result) =>{
          this._programaCliente.next(result);
          this.dialogMessage.showMessageResponse('Programa Cliente Salvo com Sucesso','OK');
        }),
        catchError(this.error.handleError<any>('addProgramaCliente'))
      );
  }

}
