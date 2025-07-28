import { Component } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class Tab2Page {
  namaWarga: string = '';
  nik: string = '';
  alamat: string = '';
  jenisDokumen: string = '';
  nomorDokumen: string = '';
  tanggalTerbit: string = '';
  tanggalBerakhir: string = '';
  dokumenPreview: string | null = null;

  showDateModal: boolean = false;
  activeDateType: string = '';

  dokumenList: string[] = [
    'KTP',
    'Kartu Keluarga',
    'Surat Domisili',
    'Surat Keterangan Usaha',
    'SKTM',
    'Surat Keterangan Lahir',
    'Surat Pengantar RT/RW'
  ];

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  bukaDatePicker(type: string) {
    this.activeDateType = type;
    const today = new Date().toISOString();

    if (type === 'terbit' && !this.tanggalTerbit) {
      this.tanggalTerbit = today;
    } else if (type === 'berakhir' && !this.tanggalBerakhir) {
      this.tanggalBerakhir = today;
    }

    this.showDateModal = true;
  }

  tanggalDipilih(event: any) {
    const selectedDate = event.detail.value;
    if (this.activeDateType === 'terbit') {
      this.tanggalTerbit = selectedDate;
    } else if (this.activeDateType === 'berakhir') {
      this.tanggalBerakhir = selectedDate;
    }
    this.showDateModal = false;
  }

  async uploadDokumen(event: any) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      this.showToast('❌ Hanya file PDF yang diizinkan.', 'danger');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${environment.apiUrl}/upload_pdf.php`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('[Upload] Respon:', result);

      if (result.success) {
        this.dokumenPreview = result.file_url;
        this.showToast('📄 File berhasil diunggah.', 'success');
      } else {
        this.showToast('Gagal upload: ' + result.msg, 'danger');
      }
    } catch (error) {
      console.error('[Upload] ERROR:', error);
      this.showToast('⚠️ Terjadi kesalahan saat upload.', 'danger');
    }
  }

  async simpanDokumen() {
    if (
      !this.namaWarga ||
      !this.nik ||
      !this.alamat ||
      !this.jenisDokumen ||
      !this.nomorDokumen ||
      !this.tanggalTerbit ||
      !this.dokumenPreview
    ) {
      this.showToast('⚠️ Lengkapi semua data dan unggah dokumen PDF.', 'danger');
      return;
    }

    const body = {
      aksi: 'add_dokumen',
      nama_pengaju: this.namaWarga,
      nik: this.nik,
      jenis_dokumen: this.jenisDokumen,
      nama_dokumen: this.nomorDokumen,
      tanggal_pengajuan: this.tanggalTerbit,
      tanggal_selesai: this.tanggalBerakhir,
      file_url: this.dokumenPreview,
      status: 'Diproses',
      keterangan: this.alamat
    };

    try {
      const response = await fetch(`${environment.apiUrl}/action.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      console.log('[SimpanDokumen] Respon:', result);

      if (result.success) {
        this.showToast('✅ Dokumen berhasil disimpan.', 'success');
        this.resetForm();
        setTimeout(() => {
          this.navCtrl.navigateRoot('/tabs/tab3');
        }, 1000);
      } else {
        this.showToast('❌ ' + result.msg, 'danger');
      }
    } catch (error) {
      console.error('[SimpanDokumen] ERROR:', error);
      this.showToast('⚠️ Tidak dapat menghubungi server.', 'danger');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  resetForm() {
    this.namaWarga = '';
    this.nik = '';
    this.alamat = '';
    this.jenisDokumen = '';
    this.nomorDokumen = '';
    this.tanggalTerbit = '';
    this.tanggalBerakhir = '';
    this.dokumenPreview = null;
  }

  kembaliKeDashboard() {
    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}
