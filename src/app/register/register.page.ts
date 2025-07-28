import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})
export class RegisterPage {
  nik: string = '';
  nama: string = '';
  password: string = '';

  apiUrl: string = `${environment.apiUrl}/action.php`; // ✅ dinamis dari environment

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  register() {
    if (!this.nik.trim() || !this.nama.trim() || !this.password.trim()) {
      this.presentToast('Semua kolom harus diisi!', 'danger');
      return;
    }

    const body = {
      aksi: 'register_user',
      nik: this.nik.trim(),
      nama: this.nama.trim(),
      password: this.password.trim()
    };

    console.log('[RegisterPage] Kirim body:', body);

    this.http.post<any>(this.apiUrl, body).subscribe({
      next: res => {
        console.log('[RegisterPage] Respon:', res);

        if (res.success) {
          this.presentToast('Registrasi berhasil! Silakan login.', 'success');
          this.router.navigate(['/login']);
        } else {
          this.presentToast(res.msg || 'NIK sudah terdaftar.', 'danger');
        }
      },
      error: (err) => {
        console.error('[RegisterPage] ERROR:', err);
        this.presentToast('Gagal koneksi ke server: ' + err.message, 'danger');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
