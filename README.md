# ⚛️ Elementa — Precision Periodic Laboratory & Atomic Directory

> **Elementa**, 118 kimyasal elementin tamamını kuantum elektron dizilimleri, termodinamik faz simülasyonları, periyodik eğilim ısı haritaları ve derin bilimsel analizlerle sunan, araştırma düzeyinde, fütüristik ve çift dilli (TR / EN) etkileşimli bir periyodik tablo laboratuvarıdır.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-periodictableviewer.web.app-cyan?style=for-the-badge&logo=firebase)](https://periodictableviewer.web.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 🌐 Canlı Demo / Live Deployment
Projeyi doğrudan tarayıcınızda canlı olarak test edebilirsiniz:  
👉 **[https://periodictableviewer.web.app](https://periodictableviewer.web.app)**

---

## ✨ Temel Özellikler / Key Features

### 1. 🔬 Etkileşimli Periyodik Tablo (Hero Periodic Table)
* **118 IUPAC Elementi:** 10 ana kimyasal kategoriye göre hassas renk kodlaması ve kuantum alt blok (s, p, d, f) ayrımı.
* **Masaüstü Hover Önizleme:** İmleç element üzerine geldiğinde açılan, gerçek zamanlı 2D/3D Bohr atom modeli, elektron kabuk dağılımı ve temel termodinamik verilerini gösteren akıllı önizleme penceresi.
* **Mobil Uyumlu Alt Çekmece:** Mobil cihazlarda akıcı hareketlerle yukarı kaydırılabilen dokunmatik element bilgi çekmecesi.
* **Laboratuvar Telemetri Şeridi:** Canlı doğal/sentetik element sayıları, oda sıcaklığında sıvı olanlar (#80 Hg, #35 Br), en yüksek erime noktası (#74 W) ve en yoğun element (#76 Os) hızlı göstergeleri.

### 2. 🌡️ Termodinamik Faz Simülasyonu (0 K – 6000 K)
* **Gerçek Zamanlı Faz Dönüşümü:** Sıcaklık kaydırıcısı ile 0 Kelvin'den 6000 Kelvin'e kadar elementlerin katı, sıvı ve gaz faz değişimlerini anlık modelleme.
* **Birim Dönüştürücü:** Kelvin (K), Santigrat (°C) ve Fahrenhayt (°F) birimleri arasında kesintisiz geçiş.
* **Bilimsel Önemli Noktalar:** Mutlak Sıfır (0 K), Sıvı Azot (77 K), Buz Donma (273 K), Oda Sıcaklığı (293 K), Su Kaynama (373 K), Altın Erime (1337 K) ve Güneş Yüzeyi (5778 K) hızlı butonları.
* **Dinamik Sayaçlar:** Seçilen sıcaklıkta kaç elementin katı, sıvı veya gaz fazında olduğunu yüzde oranlarıyla gösteren telemetri paneli.

### 3. 📈 Periyodik Trendler Isı Haritası (Periodic Trends Heatmap)
* **Sürekli Renk Skalası:** Elementleri ampirik ölçüm değerlerine göre renklendiren bilimsel gradyan haritası.
* **Desteklenen Trendler:**
  * Pauling Elektronegatifliği
  * Atomik Yarıçap (pm)
  * 1. İyonlaşma Enerjisi (kJ/mol)
  * Elektron İlgisi (kJ/mol)
  * Yoğunluk (g/cm³)
  * Erime Noktası (K)
  * Kaynama Noktası (K)

### 4. ⚖️ Çoklu Element Karşılaştırma Matrisi (Element Comparison)
* 4 elemente kadar yan yana diferansiyel fiziksel ve kuantum özellik karşılaştırması.
* Çift dilli (Türkçe / İngilizce) dinamik element arama ve matrise hızlı ekleme.
* Karşılaştırma sayfası için kalıcı rota desteği (`/compare`).

### 5. 🔍 Kapsamlı Element Analizi (Modal & `/elements/[slug]`)
Her bir element için 8 derinlemesine bilimsel sekme:
1. **Genel Bakış & 3D Atom:** Etkileşimli Bohr atom modeli ve IUPAC sınıflandırma özeti.
2. **Özellikler Matrisi:** 18 temel termodinamik, atomik ve kristal yapı özelliği.
3. **Elektron Dizilimi & Kuantum Orbitaller:** Değerlik orbital kutuları (s, p, d, f) ve Hund kuralına uygun spin okları (↑ / ↓).
4. **İzotop Zaman Çizelgesi:** Nükleer kararlılık, yarı ömürler, doğal bolluk yüzdeleri ve sentetik izotoplar.
5. **Teknolojik Uygulamalar:** Gerçek hayat, endüstriyel ve biyoteknolojik kullanım alanları.
6. **Doğada Bulunuş & Bolluk:** Evren, yer kabuğu ve insan vücudundaki kütlece oranlar.
7. **Keşif Kronolojisi:** Kaşif, keşif yılı, keşif coğrafyası ve tarihsel anlatı.
8. **Güvenlik & Biyoloji:** Biyolojik roller, MSDS toksisite/yanıcılık/radyoaktivite piktogramları ve "Biliyor Muydunuz?" bilimsel notları.

### 6. ⌨️ Hızlı Komut Paleti (Command Palette — ⌘K / Ctrl+K)
* Klavye odaklı arama: Element sembolü, adı (TR/EN) veya atom numarasıyla anında bulma.
* Hızlı filtreleme: Yalnızca radyoaktif elementler, 293 K'de sıvılar, alkali metaller, soygazlar.
* Klavye kısayolları: `↑↓` gezinme, `↵` seçme, `ESC` kapatma, `/` arama kutusuna odaklanma.

### 7. 🌍 Tam İki Dilli Destek (Türkçe & English)
* Navbar'daki **TR / EN** butonu ile sayfa yenilenmeksizin tek tıkla anında dil değişimi.
* 118 elementin Türkçe adları, kategorileri, bilimsel özetleri ve tarihsel notları eksiksiz yerelleştirilmiştir.
* Statik üretimde 366 farklı rotanın tamamı çift dilli altyapıyı destekler.

---

## 🛠️ Teknoloji Yığını / Tech Stack

| Kategori | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** (App Router) | Statik HTML üretimi (`output: 'export'`) |
| **UI Kütüphanesi** | **React 19** | Modern istemci bileşenleri ve Context API |
| **Dil** | **TypeScript 5.7** | Tip güvenliği ve sıfır derleme hatası |
| **Stil / Tasarım** | **Tailwind CSS 3.4** | Glassmorphism, koyu tema ve bilimsel tasarım dili |
| **Animasyonlar** | **Framer Motion 11** | Akıcı kart geçişleri, yay fiziği ve modal animasyonları |
| **İkon Seti** | **Lucide React** | Minimalist bilimsel vektör ikonlar |
| **Hosting & CI** | **Firebase Hosting** | Yüksek performanslı CDN ve küresel dağıtım |

---

## 📁 Proje Dizin Yapısı / Project Structure

```text
Periodic Table/
├── public/                     # Statik varlıklar, ikonlar ve manifest
├── src/
│   ├── app/                    # Next.js App Router sayfaları
│   │   ├── compare/            # Karşılaştırma sayfası (/compare)
│   │   ├── elements/[slug]/    # Element detay sayfaları (/elements/gold, /elements/79 vb.)
│   │   ├── trends/[trend]/     # Eğilim sayfaları (/trends/electronegativity vb.)
│   │   ├── layout.tsx          # Kök düzen (LanguageProvider ve AmbientBackground)
│   │   └── page.tsx            # Ana sayfa ve orkestrasyon
│   ├── components/             # Yeniden kullanılabilir UI bileşenleri
│   │   ├── background/         # Kozmik ortam arka plan efektleri
│   │   ├── detail/             # Element detay modalı ve 8 bilimsel sekme
│   │   ├── educational/        # Tarihçe, eğilimler rehberi, süperağır rehberi, vitrin
│   │   ├── hover/              # Masaüstü hover kartı ve mini atom modeli
│   │   ├── mobile/             # Mobil alt çekmece bileşeni
│   │   ├── modes/              # Sıcaklık konsolu, eğilim haritası, karşılaştırma
│   │   ├── navbar/             # Üst menü ve dil anahtarı
│   │   ├── search/             # Arama çubuğu ve Cmd+K komut paleti
│   │   └── table/              # Periyodik tablo ızgarası ve filtre çubukları
│   ├── context/                # Dil yönetimi (LanguageContext.tsx)
│   ├── data/                   # 118 element IUPAC veritabanı ve i18n sözlükleri
│   │   ├── categories.ts       # Kategori tanımları, renkleri ve açıklamaları
│   │   ├── elements.ts         # 118 elementin tam bilimsel veritabanı
│   │   └── i18n.ts             # Türkçe/İngilizce çeviriler ve veri setleri
│   └── types/                  # TypeScript arayüz ve tip tanımları
│       └── element.ts          # ElementData, ElementCategory, ElementPhase vb.
├── firebase.json               # Firebase Hosting yapılandırması
├── next.config.ts              # Next.js derleme ayarları (static export)
├── package.json                # Bağımlılıklar ve npm scriptleri
├── tailwind.config.ts          # Tailwind renk paleti ve tema genişletmeleri
└── tsconfig.json               # TypeScript yapılandırması
```

---

## 🚀 Başlarken / Getting Started

### Gereksinimler
* [Node.js](https://nodejs.org/) (v18.18 veya üzeri önerilir — v20 / v22 / v25 test edildi)
* npm, yarn veya pnpm

### Kurulum

1. Repoyu klonlayın veya proje dizinine geçin:
   ```bash
   cd "Periodic Table"
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

4. Tarayıcınızda açın:
   ```text
   http://localhost:3000
   ```

### Üretim Derlemesi (Production Build)

Projeyi statik HTML ve istemci paketleri olarak derlemek için:
```bash
npm run build
```
Derleme çıktıları `out/` dizinine yazılır.

### Firebase'e Canlıya Dağıtım (Deploy to Firebase Hosting)

Firebase CLI yüklü olduğundan emin olun ve dağıtımı başlatın:
```bash
npx firebase-tools deploy --only hosting
```

---

## 📚 Bilimsel Veri Kaynakları / Data Sources & Citations

Element verileri, standart atomik kütleler ve periyodik özellikler uluslararası geçerliliği olan saygın kaynaklardan derlenmiştir:
* **IUPAC** (International Union of Pure and Applied Chemistry) — Standard Atomic Weights & Periodic Table of the Elements
* **NIST** (National Institute of Standards and Technology) — Atomic Spectra & Physical Constants Database
* **CRC Handbook of Chemistry and Physics** — Thermodynamic Properties of the Elements
* **WebElements Periodic Table** & Hakemli Kimya Literatürü

---

## 📄 Lisans / License

Bu proje **MIT Lisansı** ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakabilirsiniz.

