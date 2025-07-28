<?php
header('Access-Control-Allow-Origin: *'); 

$hostname = 'localhost';
$username = 'apln4872_dokumen';
$password = 'vUJA^9wayt~Xw-7c'; // isi kalau ada
$database = 'apln4872_dokumen';
$charset  = 'utf8';

$dsn  = "mysql:host=$hostname;port=3306;dbname=$database;charset=$charset";

$opt  = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
    PDO::ATTR_EMULATE_PREPARES   => false,
);

try {
    $pdo = new PDO($dsn, $username, $password, $opt);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'msg' => 'Database connection error: ' . $e->getMessage()]);
    exit;
}
