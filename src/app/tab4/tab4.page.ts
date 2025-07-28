import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab4',
  standalone: true,
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
})
export class Tab4Page implements OnInit {
  apiUrl: string = `${environment.apiUrl}/action.php`; // ✅ gunakan env

  totalDokumen = 0;
  totalDiproses = 0;
  totalSelesai = 0;
  totalDitolak = 0;
  dokumenTerbaru: any[] = [];

  chart: any;

  @ViewChild('statusChart', { static: false }) chartRef!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStatistik();
  }

  loadStatistik() {
    const body = { aksi: 'get_dokumen' };

    this.http.post<any>(this.apiUrl, body).subscribe(res => {
      if (res.success) {
        const data = res.result;

        this.totalDokumen = data.length;
        this.totalDiproses = data.filter((d: any) => d.status?.toLowerCase() === 'diproses').length;
        this.totalSelesai = data.filter((d: any) => d.status?.toLowerCase() === 'selesai').length;
        this.totalDitolak = data.filter((d: any) => d.status?.toLowerCase() === 'ditolak').length;

        this.dokumenTerbaru = data.slice(0, 5);

        setTimeout(() => this.renderChart(), 200);
      }
    });
  }

  renderChart() {
    const canvas = this.chartRef?.nativeElement as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Diproses', 'Selesai', 'Ditolak'],
        datasets: [
          {
            label: 'Jumlah Dokumen',
            data: [this.totalDiproses, this.totalSelesai, this.totalDitolak],
            backgroundColor: ['#ffc409', '#2dd36f', '#eb445a'],
            borderRadius: 10,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            ticks: { font: { size: 14 } },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, precision: 0 },
            grid: { color: '#e0e0e0' },
          },
        },
      },
    });
  }

  getStatusColor(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'selesai') return 'success';
    if (s === 'diproses') return 'warning';
    if (s === 'ditolak') return 'danger';
    return 'medium';
  }
}
