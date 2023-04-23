import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-equipes',
  templateUrl: './equipes.component.html',
  styleUrls: ['./equipes.component.scss']
})
export class DashboardEquipesComponent implements OnInit {


  chartOptions: any;
  chartOptions2: any;
  sequenciaNotasNPS: Array<number>;
  sequencialNPS: Array<number>;
  selectedClient: any;
  currentDate: any;

    constructor(){

      this.sequenciaNotasNPS = [1,6,7,8,9,10];
      this.sequencialNPS = [1,2,3,4,5,6];

      this.selectedClient = 'Todos';
      this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');

      this.chartOptions = {
        series: [
          {
            name: 'Número de atendimentos',
            data: [25, 48, 50, 21, 93]
          }
        ],
        chart: {
          height: 160,
          type: 'bar'
        },
        title: {
          text: 'Acumulado do dia'
        },
        xaxis: {
          categories: ['DM', 'HAS',  'IDOSOS',  'GRAVIDEZ',  'Sem Comorb.']
        }
      };

      this.chartOptions2 = {
        series: [
          {
            name: 'Nota de NPS',
            data: this.sequenciaNotasNPS
          }
        ],
        chart: {
          id: 'chart2',
          height: 350,
          type: 'line'
        },
        title: {
          text: 'Sequencia de atendimentos'
        },
        xaxis: {
          categories: this.sequencialNPS
        }
      };
    }

   ngOnInit() {
    setInterval(() => {
  const proximoSequencialNPS = this.sequencialNPS[this.sequencialNPS.length -1]+1;
  const notaAleatoriaNPS =   parseInt((Math.random() * (10 - 7) + 7).toFixed(0), 10);

      this.sequenciaNotasNPS.push(notaAleatoriaNPS);
      this.sequencialNPS.push(proximoSequencialNPS);

      if(this.sequenciaNotasNPS.length > 30){
        this.sequenciaNotasNPS.shift();
        this.sequencialNPS.shift();
      }

      window.ApexCharts.exec('chart2', 'updateOptions', {
        series: [
          {
            name: 'Nota de NPS',
            data: this.sequenciaNotasNPS
          }
        ],
        chart: {
          id: 'chart2',
          height: 350,
          type: 'line'
        },
        title: {
          text: 'Sequencia de atendimentos'
        },
        xaxis: {
          categories: this.sequencialNPS
        }
      });

    }, 2000);

   }
  }
