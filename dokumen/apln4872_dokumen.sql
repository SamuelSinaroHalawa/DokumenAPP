-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 28 Jul 2025 pada 21.56
-- Versi server: 11.4.7-MariaDB-cll-lve
-- Versi PHP: 8.3.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apln4872_dokumen`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `dokumen_warga`
--

CREATE TABLE `dokumen_warga` (
  `id` int(11) NOT NULL,
  `nama_pengaju` varchar(100) NOT NULL,
  `nik` varchar(20) NOT NULL,
  `jenis_dokumen` varchar(100) NOT NULL,
  `nama_dokumen` varchar(150) NOT NULL,
  `tanggal_pengajuan` date NOT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `file_url` text DEFAULT NULL,
  `status` enum('Diproses','Selesai','Ditolak') DEFAULT 'Diproses',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `komentar` text DEFAULT NULL,
  `file_balasan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `dokumen_warga`
--

INSERT INTO `dokumen_warga` (`id`, `nama_pengaju`, `nik`, `jenis_dokumen`, `nama_dokumen`, `tanggal_pengajuan`, `tanggal_selesai`, `file_url`, `status`, `keterangan`, `created_at`, `komentar`, `file_balasan`) VALUES
(12, 'Samuel Halawa', '12141082346235', 'KTP', '1234', '2025-07-26', '2025-07-27', 'https://dokumen.aplikasi.blog/uploads/S2-2017-389023-title.pdf', 'Ditolak', 'Jl.Jamin Ginting Gg.Sumber No.20', '2025-07-26 13:39:33', NULL, NULL),
(13, 'Samuel Halawa', '121248764848', 'Surat Pengantar RT/RW', '12', '2025-07-28', '2025-07-31', 'https://dokumen.aplikasi.blog/uploads/simpanCETAK_KARTU_UJIAN_22100097_(2)_(1).pdf', 'Selesai', 'Medan', '2025-07-27 07:00:59', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori_dokumen`
--

CREATE TABLE `kategori_dokumen` (
  `id` int(11) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `petugas`
--

CREATE TABLE `petugas` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `petugas`
--

INSERT INTO `petugas` (`id`, `username`, `password`, `nama`) VALUES
(1, 'admin', '12345', 'Admin Desa');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nik` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nik`, `password`, `nama`, `created_at`) VALUES
(11, '555', '333', 'agus', '2025-07-19 20:52:37'),
(12, '365', '123', 'aguss', '2025-07-21 06:03:37'),
(13, '123456', 'oke123', 'Samuel', '2025-07-26 13:36:59'),
(14, '5555', '123', 'Agus', '2025-07-27 07:02:33');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `dokumen_warga`
--
ALTER TABLE `dokumen_warga`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kategori_dokumen`
--
ALTER TABLE `kategori_dokumen`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `petugas`
--
ALTER TABLE `petugas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik` (`nik`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `dokumen_warga`
--
ALTER TABLE `dokumen_warga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `kategori_dokumen`
--
ALTER TABLE `kategori_dokumen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `petugas`
--
ALTER TABLE `petugas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
