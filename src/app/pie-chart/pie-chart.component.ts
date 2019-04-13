import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-labels';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {
  @Input() data = [];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    plugins: {
      labels: {
        render: 'percentage',
        fontColor: ['green', 'red', 'blue'],
        precision: 2
      }
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          let total = data.datasets[0].data.reduce((t, n) => { return t + n });
          let label = data.labels[tooltipItem.index] + ' : ' + (data.datasets[0].data[tooltipItem.index] / total * 100).toFixed(2) + '% ';
          label += '(' + data.datasets[0].data[tooltipItem.index] + ')';
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = ['Correct', 'Wrong', 'Un-Attended'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  constructor() { }

  ngOnInit() {
    this.pieChartData = this.data;
  }
}
