# Panduan Maintenance Hugo Website

## Setup Awal

### 1. Instalasi Hugo
```bash
# Windows (REKOMENDASI - menggunakan Winget, sudah terinstall di Windows 10/11)
winget install Hugo.Hugo.Extended

# Windows - Alternatif lain:
# Chocolatey
choco install hugo-extended

# Scoop
scoop install hugo-extended

# macOS
brew install hugo

# Linux
sudo snap install hugo
```

**Catatan Windows**: Winget adalah pilihan paling direkomendasikan karena:
- Sudah terinstall di Windows 10 (build 1809+) dan Windows 11
- Package manager resmi dari Microsoft
- Tidak perlu install tools tambahan
- Mudah di-manage dan update

**Penting**: Setelah instalasi, **restart VS Code atau terminal** agar Hugo bisa dikenali.

### 2. Setup GitHub Secrets untuk Netlify Deployment

Untuk menggunakan GitHub Action, Anda perlu menambahkan secrets berikut di repository GitHub:

1. **NETLIFY_AUTH_TOKEN**
   - Login ke https://app.netlify.com
   - Klik avatar Anda → User settings → Applications → Personal access tokens
   - Klik "New access token"
   - Copy token tersebut

2. **NETLIFY_SITE_ID**
   - Buka site Anda di Netlify dashboard
   - Pergi ke Site settings → General → Site details
   - Copy nilai "API ID"

3. Tambahkan secrets ke GitHub:
   - Buka repository di GitHub
   - Settings → Secrets and variables → Actions
   - Klik "New repository secret"
   - Tambahkan kedua secrets di atas

## Maintenance Rutin

### Membuat Post Baru

```bash
# Buat post baru
hugo new posts/nama-post-baru.md

# Edit file di content/posts/nama-post-baru.md
```

### Menjalankan Server Development Lokal

```bash
# Jalankan server development
hugo server -D

# Akses di http://localhost:1313
```

### Build untuk Production

```bash
# Build site (output ke folder public/)
hugo --gc --minify

# atau dengan themesDir seperti di netlify.toml
hugo --gc --minify --themesDir ./themes/hugo-theme/..
```

### Update Theme

Jika theme adalah git submodule:
```bash
cd themes/hugo-theme
git pull origin main
cd ../..
git add themes/hugo-theme
git commit -m "Update theme"
```

### Deployment

Deployment menggunakan GitHub Action dijalankan secara **manual**:
1. Buka repository di GitHub
2. Klik tab **Actions**
3. Pilih workflow **Deploy to Netlify**
4. Klik **Run workflow**
5. Pilih branch dan klik **Run workflow**

Manual deployment juga bisa dilakukan melalui Netlify dashboard.

## Struktur Folder

```
hugo-web/
├── config.toml          # Konfigurasi utama Hugo
├── netlify.toml         # Konfigurasi Netlify build
├── archetypes/          # Template untuk konten baru
├── content/             # Semua konten website
│   ├── posts/           # Blog posts
│   └── about.md         # Halaman about
├── themes/              # Hugo themes
├── static/              # File static (images, js, css)
├── resources/           # Generated resources
└── public/              # Output build (tidak di-commit)
```

## Tips Maintenance

1. **Backup Regular**: Pastikan semua perubahan di-commit ke Git
2. **Testing Lokal**: Selalu test dengan `hugo server -D` sebelum push
3. **Update Hugo**: Check update Hugo secara berkala
4. **Monitor Build**: Cek GitHub Actions dan Netlify deploy logs
5. **Content Review**: Review konten secara berkala untuk SEO dan typo

## Troubleshooting

### Hugo Command Not Found (Windows)
Jika setelah install Hugo muncul error "The term 'hugo' is not recognized":

**Solusi Permanen:**
1. Tutup **semua terminal** di VS Code (klik icon trash di terminal)
2. Tutup VS Code sepenuhnya (Ctrl+Q atau File → Exit)
3. Buka kembali VS Code
4. Test: `hugo version`

**Solusi Sementara (untuk terminal aktif):**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Build Gagal
- Check Hugo version di `netlify.toml` sesuai dengan lokal
- Pastikan theme ada di folder `themes/`
- Check syntax error di config.toml

### Theme Tidak Muncul
- Pastikan theme directive di config.toml benar
- Check folder themes/ memiliki theme yang tepat
- Jika submodule, pastikan sudah di-init dan update

### Deploy Gagal di Netlify
- Check NETLIFY_AUTH_TOKEN dan NETLIFY_SITE_ID di GitHub Secrets
- Verify build command di netlify.toml
- Check deploy logs di Netlify dashboard

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
