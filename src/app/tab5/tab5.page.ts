import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

import html2pdf from 'html2pdf.js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tab5',
  standalone: true,
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule
  ]
})
export class Tab5Page implements OnInit {
  apiUrl = `${environment.apiUrl}/action.php`; // ✅ gunakan env

  dokumenAll: any[] = [];
  dokumenMasuk: any[] = [];

  username = '';
  password = '';
  isLoggedIn = false;

  keyword = '';
  statusFilter = '';

  fileUpload: Record<string, File> = {};
  fileNameInput: Record<string, string> = {};

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async loginAdmin() {
    if (!this.username || !this.password) {
      await this.showAlert('Login Gagal', 'Username dan password harus diisi!');
      return;
    }

    const body = {
      aksi: 'login_petugas',
      username: this.username,
      password: this.password
    };

    this.http.post<any>(this.apiUrl, body).subscribe(async res => {
      if (res.success && res.petugas) {
        this.isLoggedIn = true;
        localStorage.setItem('nama_petugas', res.petugas.nama);
        this.username = '';
        this.password = '';
        this.loadDokumenMasuk();
        await this.showToast(`Login berhasil sebagai ${res.petugas.nama}.`, 'success');
      } else {
        await this.showAlert('Login Gagal', res.msg || 'Username atau password salah!');
      }
    }, async () => {
      await this.showAlert('Error', 'Gagal menghubungi server.');
    });
  }

  async logoutAdmin() {
    this.isLoggedIn = false;
    this.dokumenAll = [];
    this.dokumenMasuk = [];
    localStorage.removeItem('nama_petugas');
    await this.showToast('Logout berhasil.', 'medium');
  }

  loadDokumenMasuk() {
    this.http.post<any>(this.apiUrl, { aksi: 'get_dokumen' }).subscribe(res => {
      if (res.success) {
        this.dokumenAll = res.result;
        this.filterDokumen();
      } else {
        this.dokumenAll = [];
        this.dokumenMasuk = [];
      }
    });
  }

  filterDokumen() {
    const keywordLower = this.keyword.toLowerCase();
    this.dokumenMasuk = this.dokumenAll.filter(item => {
      const matchKeyword = item.nama_pengaju.toLowerCase().includes(keywordLower) ||
                           item.nik.toLowerCase().includes(keywordLower);
      const matchStatus = this.statusFilter ? item.status === this.statusFilter : true;
      return matchKeyword && matchStatus;
    });
  }

  getStatusColor(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'diproses': return 'warning';
      case 'selesai': return 'success';
      case 'ditolak': return 'danger';
      default: return 'medium';
    }
  }

  async ubahStatus(id: string, status: string) {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: `Yakin ingin mengubah status menjadi <strong>${status.toUpperCase()}</strong>?`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Ya, Ubah',
          handler: () => {
            this.http.post<any>(this.apiUrl, { aksi: 'update_status', id, status }).subscribe(async res => {
              if (res.success) {
                await this.showToast('Status berhasil diperbarui.', 'success');
                this.loadDokumenMasuk();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  onFileSelected(event: any, id: string) {
    this.fileUpload[id] = event.target.files[0];
  }

  uploadBalasan(id: number) {
    const file = this.fileUpload[id];
    if (!file) return;

    const formData = new FormData();
    formData.append('aksi', 'upload_balasan');
    formData.append('id', id.toString());
    formData.append('file', file);

    const namaCustom = this.fileNameInput[id] || '';
    formData.append('custom_name', namaCustom);

    this.http.post<any>(this.apiUrl, formData).subscribe(async res => {
      if (res.success) {
        await this.showToast('Surat balasan berhasil diunggah.', 'success');
        this.loadDokumenMasuk();
        delete this.fileUpload[id];
        delete this.fileNameInput[id];
      } else {
        await this.showToast(res.msg || 'Gagal mengunggah surat balasan.', 'danger');
      }
    }, async err => {
      console.error('HTTP error:', err);
      await this.showToast('Terjadi kesalahan saat upload.', 'danger');
    });
  }

  exportToPDF() {
    const element = document.body.appendChild(document.createElement('div'));
    element.innerHTML = this.generateReportHTML();
    html2pdf().from(element).set({
      margin: 10,
      filename: 'laporan-validasi.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save().finally(() => {
      document.body.removeChild(element);
    });
  }

  exportToExcel() {
    const data = this.dokumenMasuk.map((d, i) => ({
      No: i + 1,
      Nama: d.nama_pengaju,
      NIK: d.nik,
      JenisDokumen: d.jenis_dokumen,
      Nomor: d.nama_dokumen,
      Tanggal: d.tanggal_pengajuan,
      Status: d.status,
      Keterangan: d.keterangan || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'laporan-validasi.xlsx');
  }

  generateReportHTML(): string {
    const rows = this.dokumenMasuk.map((d, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${d.nama_pengaju}</td>
        <td>${d.nik}</td>
        <td>${d.jenis_dokumen}</td>
        <td>${d.nama_dokumen}</td>
        <td>${d.tanggal_pengajuan}</td>
        <td>${d.status}</td>
        <td>${d.keterangan || '-'}</td>
      </tr>`).join('');

    return `
      <style>
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #999; padding: 6px; text-align: left; }
        th { background: #f0f0f0; }
      </style>
      <h3>Laporan Validasi Dokumen</h3>
      <table>
        <thead>
          <tr>
            <th>No</th><th>Nama</th><th>NIK</th><th>Jenis</th><th>Nomor</th><th>Tanggal</th><th>Status</th><th>Keterangan</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }
}
