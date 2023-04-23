import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-saude-individuo',
  templateUrl: './saude-individuo.component.html',
  styleUrls: ['./saude-individuo.component.scss']
})
export class SaudeIndividuoComponent implements OnInit {
  chartOptions: any;
  chartOptions2: any;
  sequenciaNotasNPS: Array<number>;
  sequencialNPS: Array<number>;
  selectedClient: any;
  currentDate: any;

    constructor(){

      this.sequenciaNotasNPS = [8,6,7,8,9,10];
      this.sequencialNPS = [1,2,3,4,5,6];


      this.chartOptions2 = {
        series: [
          {
            name: 'Nota de saúde',
            data: this.sequenciaNotasNPS
          }
        ],
        chart: {
          id: 'chart2',
          height: 350,
          type: 'line',
          animation:false
        },
        title: {
          text: 'Sequencia de saúde'
        },
        xaxis: {
          categories: this.sequencialNPS
        }
      };
    }

   ngOnInit() {
    setInterval(() => {
  const proximoSequencialNPS = this.sequencialNPS[this.sequencialNPS.length -1]+1;
  const notaAleatoriaNPS =   10;

      this.sequenciaNotasNPS.push(notaAleatoriaNPS);
      this.sequencialNPS.push(proximoSequencialNPS);

      if(this.sequenciaNotasNPS.length > 30){
        this.sequenciaNotasNPS.shift();
        this.sequencialNPS.shift();
      }

      window.ApexCharts.exec('chart15', 'updateOptions', {
        series: [
          {
            name: 'Score de saúde',
            data: this.sequenciaNotasNPS
          }
        ],
        chart: {
          id: 'chart15',
          height: 350,
          type: 'line',
          animation:false
        },
        title: {
          text: 'Sequencia de saúde'
        },
        xaxis: {
          categories: this.sequencialNPS
        }
      });

    }, 8000);

   }
  }

