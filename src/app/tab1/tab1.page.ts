import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Dokumen {
  id: number;
  nama_pengaju: string;
  status: string;
  [key: string]: any;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
})
export class Tab1Page implements OnInit {

  today: Date = new Date();
  dokumenList: Dokumen[] = [];

  totalDokumen = 0;
  totalProses = 0;
  totalSelesai = 0;
  lastJumlahDokumen = 0;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadDokumen();
    setInterval(() => {
      this.checkNotifikasiBaru();
    }, 5000);
  }

  loadDokumen() {
    const body = { aksi: 'get_dokumen' };

    this.http.post<any>(`${environment.apiUrl}/action.php`, body).subscribe(
      res => {
        if (res.success && Array.isArray(res.result)) {
          this.dokumenList = res.result;
          this.hitungStatistik();
          this.lastJumlahDokumen = this.dokumenList.length;
          console.table(this.dokumenList);
        } else {
          console.error('Gagal mengambil dokumen:', res.msg);
        }
      },
      error => {
        console.error('Kesalahan koneksi:', error);
      }
    );
  }

  checkNotifikasiBaru() {
    const body = { aksi: 'get_dokumen' };

    this.http.post<any>(`${environment.apiUrl}/action.php`, body).subscribe(
      res => {
        if (res.success && Array.isArray(res.result)) {
          const dokumenBaru = res.result;
          const jumlahSekarang = dokumenBaru.length;

          if (jumlahSekarang > this.lastJumlahDokumen) {
            const selisih = jumlahSekarang - this.lastJumlahDokumen;
            this.showToast(`🔔 ${selisih} dokumen baru masuk`, 'warning');
            this.dokumenList = dokumenBaru;
            this.hitungStatistik();
            this.lastJumlahDokumen = jumlahSekarang;
          }
        }
      },
      error => {
        console.error('Gagal cek dokumen baru:', error);
      }
    );
  }

  hitungStatistik() {
    this.totalDokumen = this.dokumenList.length;
    this.totalProses = this.dokumenList.filter(d =>
      d.status && d.status.toLowerCase() === 'diproses'
    ).length;
    this.totalSelesai = this.dokumenList.filter(d =>
      d.status && d.status.toLowerCase() === 'selesai'
    ).length;
  }

  async showToast(pesan: string, warna: string = 'primary') {
    const toast = await this.toastController.create({
      message: pesan,
      duration: 3000,
      position: 'top',
      color: warna,
    });
    await toast.present();
  }

  goToAjukan() {
    this.router.navigate(['/tabs/tab2']);
  }

  goToDokumen() {
    this.router.navigate(['/tabs/tab3']);
  }

  goToStatistik() {
    this.router.navigate(['/tabs/tab4']);
  }

  goToPetugas() {
    this.router.navigate(['/tabs/tab5']);
  }

  async logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('nik');
    const toast = await this.toastController.create({
      message: 'Berhasil logout',
      duration: 2000,
      position: 'bottom',
      color: 'medium'
    });
    await toast.present();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
