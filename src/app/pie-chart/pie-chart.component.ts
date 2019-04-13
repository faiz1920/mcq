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
        label: (tooltipItem, chartData: any) => {
          let data = chartData.datasets[0].data;
          let total = data.reduce((t, n) => t + n);
          let label = chartData.labels[tooltipItem.index] + ' : ' + (data[tooltipItem.index] / total * 100).toFixed(2) + '% ';
          label += '(' + data[tooltipItem.index] + ')';
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = ['Correct', 'Wrong', 'Un-Attended'];
  public pieChartData: number[] = [0, 0, 0];
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
