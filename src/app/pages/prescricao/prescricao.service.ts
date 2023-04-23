/* eslint-disable no-var */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
declare var document: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare var MdSinapsePrescricao: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare var MdHub: any;


@Injectable({
  providedIn: 'root'
})
export class PrescricaoService {


  load(token): Observable<any>{
    const script = document.createElement('script') ;
    const idScript = 'sinapseMemed';

    script.type = 'text/javascript';
    script.id = idScript;
    script.src = 'https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js';
    script.setAttribute('data-token', token);
    script.setAttribute('data-color', '#1abc9c');
    script.setAttribute('data-container', 'memed-container');
    script.onload = () => {
      this.initEventsMemed();
    };
    document.body.appendChild(script);
    return of(true);
  }

  initEventsMemed() {
    MdSinapsePrescricao.event.add('core:moduleInit', (module) => {
      if (module.name === 'plataforma.prescricao') {
        MdHub.command.send('plataforma.prescricao', 'setFeatureToggle', {
           deletePatient: false,
           removePatient: false,
           editPatient: false,
           buttonClose: false,
        });

        MdHub.command.send('plataforma.prescricao', 'setPaciente',
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'external_id': '12312312312',
          'nome': 'José da Silva',
          'cpf': '87671504203',
          'telefone': '99999999999',
        }).then(() =>{
          MdHub.module.show('plataforma.prescricao');
        });

        MdHub.event.add('prescricaoImpressa', (prescriptionData) =>{
          console.log(prescriptionData);
        });
      }
    });
  }

}
