<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Direktori target untuk menyimpan file
$targetDir = "uploads/";

// Buat folder jika belum ada
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Cek apakah file ada dan tidak error
if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {
    $fileTmp  = $_FILES['file']['tmp_name'];
    $fileName = basename($_FILES['file']['name']);
    $fileType = mime_content_type($fileTmp);

    // Validasi tipe file
    if ($fileType !== 'application/pdf') {
        echo json_encode(['success' => false, 'msg' => 'Hanya file PDF yang diperbolehkan.']);
        exit;
    }

    // Ganti nama file agar unik (gunakan timestamp)
    $newFileName = preg_replace('/\s+/', '_', $fileName);
    $targetFile = $targetDir . $newFileName;

    // Pindahkan file ke folder upload
    if (move_uploaded_file($fileTmp, $targetFile)) {
        // URL hasil upload
        $fileUrl = 'https://dokumen.aplikasi.blog/uploads/'. $newFileName;

        echo json_encode(['success' => true, 'file_url' => $fileUrl]);
    } else {
        echo json_encode(['success' => false, 'msg' => 'Gagal menyimpan file.']);
    }
} else {
    echo json_encode(['success' => false, 'msg' => 'Tidak ada file dikirim atau terjadi kesalahan.']);
}
?>
