import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-riscos-gerais',
  templateUrl: './riscos-gerais.component.html',
  styleUrls: ['./riscos-gerais.component.scss']
})
export class RiscosGeraisComponent implements OnInit {

  chartOptions: any;
  chartOptions2: any;
  sequenciaNotasNPS: Array<number>;
  sequencialNPS: Array<number>;
  selectedClient: any;
  currentDate: any;
  chartGithubIssues: ApexOptions = {};
  chartTaskDistribution: ApexOptions = {};
  chartBudgetDistribution: ApexOptions = {};
  chartWeeklyExpenses: ApexOptions = {};
  chartMonthlyExpenses: ApexOptions = {};
  chartYearlyExpenses: ApexOptions = {};
  panelOpenState = false;

    constructor(){

      this.sequenciaNotasNPS = [1,6,7,8,9,10];
      this.sequencialNPS = [1,2,3,4,5,6];

      this.selectedClient = 'Todos';
      this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');

      this.chartOptions = {
        series: [
          {
            name: 'Nota em 100',
            data: [98, 98, 50, 75, 90]
          }
        ],
        chart: {
          height: 160,
          type: 'bar'
        },
        title: {
          text: 'nota geral'
        },
        xaxis: {
          categories: ['Geral' , ' Mental e Neurológico',  'Metabólico',  'Respiratório',  'Cardiovascular']

        }
      };

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
    window['Apex'] = {
      chart: {
          events: {
              mounted: (chart: any, options?: any): void => {
                  this._fixSvgFill(chart.el);
              },
              updated: (chart: any, options?: any): void => {
                  this._fixSvgFill(chart.el);
              }
            }
          }
    };

    setInterval(() => {
  const proximoSequencialNPS = this.sequencialNPS[this.sequencialNPS.length -1]+1;
  const notaAleatoriaNPS =   10;

      this.sequenciaNotasNPS.push(notaAleatoriaNPS);
      this.sequencialNPS.push(proximoSequencialNPS);

      if(this.sequenciaNotasNPS.length > 30){
        this.sequenciaNotasNPS.shift();
        this.sequencialNPS.shift();
      }

      window.ApexCharts.exec('chart2', 'updateOptions', {
        series: [
          {
            name: 'Nota de saúde',
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
  private _fixSvgFill(el: any) {
    throw new Error('Method not implemented.');
  }
}
