# Izinkan hanya file tertentu
<FilesMatch "\.(php|php5|php7|phtml|pl|py|sh|cgi|exe|jsp|asp|aspx)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>

# Tambahan keamanan: Nonaktifkan eksekusi skrip
RemoveHandler .php .php5 .php7 .phtml .pl .py .sh .cgi .exe .jsp .asp .aspx
RemoveType .php .php5 .php7 .phtml .pl .py .sh .cgi .exe .jsp .asp .aspx

# Proteksi index (blok akses direktori langsung)
Options -Indexes

# Izinkan file biasa seperti PDF, gambar, dokumen
<IfModule mod_mime.c>
    AddType application/pdf .pdf
    AddType application/msword .doc
    AddType application/vnd.openxmlformats-officedocument.wordprocessingml.document .docx
    AddType image/jpeg .jpg .jpeg
    AddType image/png .png
</IfModule>
