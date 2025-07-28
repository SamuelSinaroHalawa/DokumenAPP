import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  ToastController,
  AlertController
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class Tab3Page implements OnInit {
  dokumenList: any[] = [];
  filteredDokumenList: any[] = [];
  filterText: string = '';
  filterStatus: string = '';

  apiUrl: string = `${environment.apiUrl}/action.php`; // ✅ gunakan base dari environment
  editingItemId: number | null = null;
  editForm: any = {};

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadDokumen();
  }

  async loadDokumen() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aksi: 'get_dokumen' })
      });

      const result = await response.json();

      if (result.success) {
        this.dokumenList = result.result;
        this.applyFilter();
        localStorage.setItem('dokumenList', JSON.stringify(this.dokumenList));
      } else {
        this.showToast('❌ Gagal mengambil data dokumen.', 'danger');
      }
    } catch (error) {
      this.showToast('⚠️ Tidak dapat terhubung ke server.', 'danger');
    }
  }

  applyFilter() {
    const search = this.filterText.toLowerCase();
    this.filteredDokumenList = this.dokumenList.filter(item => {
      const cocokText = item.nama_pengaju.toLowerCase().includes(search) || item.nik.includes(search);
      const cocokStatus = this.filterStatus === '' || item.status === this.filterStatus;
      return cocokText && cocokStatus;
    });
  }

  editDokumen(item: any) {
    this.editingItemId = item.id;
    this.editForm = { ...item };
  }

  batalEdit() {
    this.editingItemId = null;
    this.editForm = {};
  }

  async updateDokumen() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aksi: 'update_dokumen', ...this.editForm })
      });

      const result = await response.json();

      if (result.success) {
        this.showToast('✅ Dokumen berhasil diperbarui.', 'success');
        this.batalEdit();
        this.loadDokumen();
      } else {
        this.showToast('❌ Gagal memperbarui dokumen.', 'danger');
      }
    } catch (error) {
      this.showToast('⚠️ Gagal menyimpan perubahan.', 'danger');
    }
  }

  async hapusDokumen(id: number) {
    const alert = await this.alertController.create({
      header: 'Hapus Dokumen',
      message: 'Yakin ingin menghapus dokumen ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          handler: () => this.deleteDokumen(id)
        }
      ]
    });

    await alert.present();
  }

  async deleteDokumen(id: number) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aksi: 'delete_dokumen', id })
      });

      const result = await response.json();

      if (result.success) {
        this.showToast('✅ Dokumen berhasil dihapus.', 'success');
        this.loadDokumen();
      } else {
        this.showToast('❌ Gagal menghapus dokumen.', 'danger');
      }
    } catch (error) {
      this.showToast('⚠️ Terjadi kesalahan saat menghapus.', 'danger');
    }
  }

  lihatDetail(item: any) {
    if (item.file_url) {
      window.open(item.file_url, '_blank');
    } else {
      this.showToast('📎 File dokumen tidak tersedia.', 'medium');
    }
  }

  lihatSuratBalasan(item: any) {
    if (item.file_balasan) {
      window.open(item.file_balasan, '_blank');
    } else {
      this.showToast('📎 Surat balasan tidak tersedia.', 'medium');
    }
  }

  getStatusColor(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'diproses': return 'warning';
      case 'selesai': return 'success';
      case 'ditolak': return 'danger';
      default: return 'medium';
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
