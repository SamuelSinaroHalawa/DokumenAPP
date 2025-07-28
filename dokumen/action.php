<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

include "db_config.php"; // Koneksi PDO

// Tangkap aksi dari FormData (upload) atau JSON
$aksi = null;
$postjson = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['aksi'])) {
        $aksi = strip_tags($_POST['aksi']);
        $postjson = $_POST;
    } else {
        $input = file_get_contents("php://input");
        if ($input) {
            $postjson = json_decode($input, true);
            $aksi = isset($postjson['aksi']) ? strip_tags($postjson['aksi']) : null;
        }
    }
}

if (!$aksi) {
    echo json_encode(['success' => false, 'msg' => 'Aksi tidak dikirim']);
    exit;
}

try {
    switch ($aksi) {

        // === LOGIN USER ===
        case "login_user":
            $nik = trim($postjson['nik'] ?? '');
            $password = trim($postjson['password'] ?? '');

            if (empty($nik) || empty($password)) {
                echo json_encode(['success' => false, 'msg' => 'NIK dan password harus diisi']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT nik, nama FROM users WHERE nik = :nik AND password = :password");
            $stmt->execute([':nik' => $nik, ':password' => $password]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'msg' => 'NIK atau password salah']);
            }
            break;

        // === LOGIN PETUGAS ===
        case "login_petugas":
            $username = trim($postjson['username'] ?? '');
            $password = trim($postjson['password'] ?? '');

            if (empty($username) || empty($password)) {
                echo json_encode(['success' => false, 'msg' => 'Username dan password harus diisi']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT id, nama FROM petugas WHERE username = :username AND password = :password");
            $stmt->execute([':username' => $username, ':password' => $password]);
            $petugas = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($petugas) {
                echo json_encode(['success' => true, 'petugas' => $petugas]);
            } else {
                echo json_encode(['success' => false, 'msg' => 'Username atau password salah']);
            }
            break;

        // === REGISTER USER ===
        case "register_user":
            $nik = trim($postjson['nik'] ?? '');
            $password = trim($postjson['password'] ?? '');
            $nama = trim($postjson['nama'] ?? '');

            if (empty($nik) || empty($password) || empty($nama)) {
                echo json_encode(['success' => false, 'msg' => 'Semua field wajib diisi']);
                exit;
            }

            $cek = $pdo->prepare("SELECT nik FROM users WHERE nik = :nik");
            $cek->execute([':nik' => $nik]);

            if ($cek->rowCount() > 0) {
                echo json_encode(['success' => false, 'msg' => 'NIK sudah terdaftar']);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO users (nik, password, nama) VALUES (:nik, :password, :nama)");
            $stmt->execute([':nik' => $nik, ':password' => $password, ':nama' => $nama]);

            echo json_encode(['success' => true, 'msg' => 'Registrasi berhasil']);
            break;

        // === TAMBAH DOKUMEN ===
        case "add_dokumen":
            if (
                empty($postjson['nama_pengaju']) ||
                empty($postjson['nik']) ||
                empty($postjson['jenis_dokumen']) ||
                empty($postjson['nama_dokumen']) ||
                empty($postjson['tanggal_pengajuan'])
            ) {
                echo json_encode(['success' => false, 'msg' => 'Data belum lengkap']);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO dokumen_warga 
                (nama_pengaju, nik, jenis_dokumen, nama_dokumen, tanggal_pengajuan, tanggal_selesai, file_url, status, keterangan)
                VALUES 
                (:nama_pengaju, :nik, :jenis_dokumen, :nama_dokumen, :tanggal_pengajuan, :tanggal_selesai, :file_url, :status, :keterangan)");

            $stmt->execute([
                ':nama_pengaju' => $postjson['nama_pengaju'],
                ':nik' => $postjson['nik'],
                ':jenis_dokumen' => $postjson['jenis_dokumen'],
                ':nama_dokumen' => $postjson['nama_dokumen'],
                ':tanggal_pengajuan' => $postjson['tanggal_pengajuan'],
                ':tanggal_selesai' => $postjson['tanggal_selesai'] ?? null,
                ':file_url' => $postjson['file_url'] ?? null,
                ':status' => $postjson['status'] ?? 'Diproses',
                ':keterangan' => $postjson['keterangan'] ?? null
            ]);

            echo json_encode(['success' => true, 'msg' => 'Dokumen berhasil ditambahkan']);
            break;

        // === GET DOKUMEN ===
        case "get_dokumen":
            $stmt = $pdo->query("SELECT * FROM dokumen_warga ORDER BY id DESC");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'result' => $data]);
            break;

        // === UPDATE DOKUMEN ===
        case "update_dokumen":
            if (empty($postjson['id'])) {
                echo json_encode(['success' => false, 'msg' => 'ID tidak dikirim']);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE dokumen_warga SET
                nama_pengaju = :nama_pengaju,
                nik = :nik,
                jenis_dokumen = :jenis_dokumen,
                nama_dokumen = :nama_dokumen,
                tanggal_pengajuan = :tanggal_pengajuan,
                tanggal_selesai = :tanggal_selesai,
                keterangan = :keterangan
                WHERE id = :id");

            $stmt->execute([
                ':nama_pengaju' => $postjson['nama_pengaju'],
                ':nik' => $postjson['nik'],
                ':jenis_dokumen' => $postjson['jenis_dokumen'],
                ':nama_dokumen' => $postjson['nama_dokumen'],
                ':tanggal_pengajuan' => $postjson['tanggal_pengajuan'],
                ':tanggal_selesai' => $postjson['tanggal_selesai'],
                ':keterangan' => $postjson['keterangan'],
                ':id' => $postjson['id']
            ]);

            echo json_encode(['success' => true, 'msg' => 'Dokumen berhasil diperbarui']);
            break;

        // === UPDATE STATUS ===
        case "update_status":
            if (empty($postjson['id']) || !isset($postjson['status'])) {
                echo json_encode(['success' => false, 'msg' => 'ID atau status tidak lengkap']);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE dokumen_warga SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $postjson['status'], ':id' => $postjson['id']]);

            echo json_encode(['success' => true, 'msg' => 'Status berhasil diubah']);
            break;

        // === UPLOAD SURAT BALASAN (via FormData) ===
      case "upload_balasan":
    $id = $_POST['id'] ?? null;
    $customName = $_POST['custom_name'] ?? ''; // ambil nama custom dari frontend

    if (!$id || !isset($_FILES['file'])) {
        echo json_encode(['success' => false, 'msg' => 'ID atau file tidak ditemukan']);
        exit;
    }

    $file = $_FILES['file'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);

    // Bersihkan nama custom dari karakter aneh
    $customName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($customName, PATHINFO_FILENAME));
    $safeName = $customName ? $customName . '.' . $ext : 'balasan_' . time() . '_' . rand(1000, 9999) . '.' . $ext;

    $uploadDir = 'uploads/';
    $filename = $uploadDir . $safeName;

    $server_url = (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
    $full_url = $server_url . '/uploads/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $filename)) {
        $stmt = $pdo->prepare("UPDATE dokumen_warga SET file_balasan = :file WHERE id = :id");
        $stmt->execute([':file' => $full_url, ':id' => $id]);
        echo json_encode(['success' => true, 'file_url' => $full_url]);
    } else {
        echo json_encode(['success' => false, 'msg' => 'Gagal menyimpan file ke server']);
    }
    break;


        // === DELETE DOKUMEN ===
        case "delete_dokumen":
            if (empty($postjson['id'])) {
                echo json_encode(['success' => false, 'msg' => 'ID tidak dikirim']);
                exit;
            }

            $stmt = $pdo->prepare("DELETE FROM dokumen_warga WHERE id = :id");
            $stmt->execute([':id' => $postjson['id']]);

            echo json_encode(['success' => true, 'msg' => 'Dokumen berhasil dihapus']);
            break;

        // === DEFAULT ===
        default:
            echo json_encode(['success' => false, 'msg' => 'Aksi tidak dikenali']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'msg' => 'Error DB: ' . $e->getMessage()]);
}
