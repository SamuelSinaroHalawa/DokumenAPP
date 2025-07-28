import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class LoginPage implements OnInit {
  nik: string = '';
  password: string = '';
  apiUrl: string = `${environment.apiUrl}/action.php`; // ✅ gunakan base url dari environment

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    localStorage.removeItem('loggedIn');
    console.log('[LoginPage] Reset login');
  }

  async presentToast(message: string, color: string = 'primary', duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration,
      position: 'bottom',
    });
    await toast.present();
  }

  async login() {
    if (!this.nik.trim() || !this.password.trim()) {
      return this.presentToast('NIK dan Password tidak boleh kosong.', 'danger');
    }

    const body = {
      aksi: 'login_user',
      nik: this.nik.trim(),
      password: this.password.trim(),
    };

    console.log('[LoginPage] Kirim login ke:', this.apiUrl, body);

    this.http.post<any>(this.apiUrl, body).subscribe({
      next: async (res) => {
        console.log('[LoginPage] Respon server:', res);

        if (res.success) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('nik', this.nik.trim());

          await this.presentToast('Login berhasil.', 'success');

          this.router.navigate(['/tabs']).catch(err =>
            console.error('[LoginPage] Navigasi ke /tabs gagal:', err)
          );
        } else {
          this.presentToast(res.msg || 'Login gagal. Cek NIK atau Password.', 'danger');
        }
      },
      error: (err) => {
        console.error('❌ [LoginPage] ERROR saat login:', err);
        this.presentToast('Kesalahan koneksi: ' + err.message, 'danger');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']).catch(err =>
      console.error('[LoginPage] Navigasi ke /register gagal:', err)
    );
  }

  logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('nik');
    this.router.navigate(['/login']).catch(err =>
      console.error('[LoginPage] Navigasi logout gagal:', err)
    );
  }
}
