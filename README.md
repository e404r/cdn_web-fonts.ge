# 🇬🇪 Georgian Web Fonts CDN & NPM Package (Web-Fonts.ge)

[![CDN](https://img.shields.io/badge/CDN-jsDelivr-orange.svg)](https://www.jsdelivr.com/)
[![Fonts](https://img.shields.io/badge/Fonts-122%2B-blue.svg)](#-პოპულარული-ფონტები)
[![Formats](https://img.shields.io/badge/Formats-WOFF2%20%7C%20TTF%20%7C%20WOFF-success.svg)](#-ფორმატები)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![NPM](https://img.shields.io/badge/NPM-Ready-red.svg)](#-npm--package-manager-ინტეგრაცია)

ქართული ვებ-ფონტების უფასო, სწრაფი, საიმედო და გლობალური CDN სერვისი და კატალოგი.  
შეიცავს **122+ ქართულ ფონტს** (BPG, ALK, Arial GEO, DejaVu და სხვ.) ოპტიმიზებული **WOFF2, TTF, WOFF, EOT და SVG** ფორმატებით.

> 💡 ეს პროექტი წარმოადგენს [web-fonts/cdn](https://github.com/web-fonts/cdn)-ის განვითარებულ და მოდერნიზებულ ვერსიას (v2.0), რომლის თავდაპირველი იდეა და შექმნა ეკუთვნის **ლადო ლომიძეს ([Lado Lomidze / web-fonts](https://github.com/web-fonts))**.

🌐 **ონლაინ კატალოგი & Live Preview:** [https://web-fonts.e404r.vip](https://web-fonts.e404r.vip) (ან [GitHub Pages](https://e404r.github.io/cdn_web-fonts.ge/))

---

## ⚡ სწრაფი დაწყება (HTML & CSS)

### 1. HTML-ში ჩასმა (`<head>`-ში):
```html
<!-- BPG Nino Mkhedruli -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/bpg-nino-mkhedruli/css/bpg-nino-mkhedruli.min.css">

<!-- ALK Life -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/alk-life/css/alk-life.min.css">

<!-- BPG Nuskha Modern -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/bpg-nuskha-modern/css/bpg-nuskha-modern.min.css">
```

### 2. გამოყენება თქვენს CSS-ში:
```css
body {
  font-family: 'BPG Nino Mkhedruli', sans-serif;
}

h1, .logo {
  font-family: 'BPG Nuskha Modern', sans-serif;
}
```

---

## 📦 NPM / Package Manager ინტეგრაცია (Angular, React, Next.js, Vite, Vue)

პროექტი გთავაზობთ ორ მოქნილ გზას:

### ვარიანტი 1: ინდივიდუალური მიკრო-პაკეტები (Fontsource Style — რეკომენდებული ⭐)
თითოეული ფონტი ხელმისაწვდომია როგორც მსუბუქი დამოუკიდებელი პაკეტი (~**150–250 KB**). თქვენი `node_modules` არ გაიბერება და ჩამოიწერება **მხოლოდ ის ფონტი, რაც რეალურად გჭირდებათ**:

```bash
npm install @e404r/web-font_bpg-nino-mkhedruli
```

**იმპორტი (React / Next.js / Vite / Angular / Vue):**
```javascript
// main.js / _app.js / layout.tsx / index.ts
import '@e404r/web-font_bpg-nino-mkhedruli';
```
*(ან CSS/SCSS-ში: `@import "@e404r/web-font_bpg-nino-mkhedruli";`)*

---

### ვარიანტი 2: სრული კოლექცია (Full Archive — 122 ფონტი)
თუ გსურთ ყველა 122-ვე ქართული ფონტის სრული ბიბლიოთეკა ერთიანად (~67 MB):

```bash
npm install georgian-fonts
```

```javascript
import 'georgian-fonts/fonts/bpg-nino-mkhedruli/css/bpg-nino-mkhedruli.min.css';
import 'georgian-fonts/fonts/alk-life/css/alk-life.min.css';
```

---

## 🔗 CDN URL სტრუქტურა

სერვისი მხარს უჭერს ორ CDN პროვაიდერს:

### 1. jsDelivr Global Multi-CDN (რეკომენდებული):
```text
https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@{ვერსია-ან-ბრენჩი}/fonts/{ფონტის-slug}/css/{ფაილი}.min.css
```
- **ბრენჩით (`main`):** `https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/...`
- **ტეგით (`v2.0.0`):** `https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@2.0.0/fonts/...`

### 2. პირდაპირი CDN (web-fonts.e404r.vip):
```text
https://web-fonts.e404r.vip/fonts/{ფონტის-slug}/css/{ფაილი}.min.css
```

---

## 🎨 პოპულარული ფონტები და ბმულები

| ფონტი | კატეგორია | HTML `<link>` | CSS `font-family` |
| :--- | :--- | :--- | :--- |
| **BPG Nino Mkhedruli** | BPG | `fonts/bpg-nino-mkhedruli/css/bpg-nino-mkhedruli.min.css` | `'BPG Nino Mkhedruli'` |
| **BPG Nino Mkhedruli Bold** | BPG | `fonts/bpg-nino-mkhedruli-bold/css/bpg-nino-mkhedruli-bold.min.css` | `'BPG Nino Mkhedruli Bold'` |
| **BPG Nuskha Modern** | BPG | `fonts/bpg-nuskha-modern/css/bpg-nuskha-modern.min.css` | `'BPG Nuskha Modern'` |
| **BPG Glaho** | BPG | `fonts/bpg-glaho/css/bpg-glaho.min.css` | `'BPG Glaho'` |
| **BPG Glaho Bold** | BPG | `fonts/bpg-glaho-bold/css/bpg-glaho-bold.min.css` | `'BPG Glaho Bold'` |
| **ALK Life** | ALK | `fonts/alk-life/css/alk-life.min.css` | `'ALK Life'` |
| **Arial GEO** | Arial GEO | `fonts/arial-geo/css/arial-geo.min.css` | `'Arial GEO'` |
| **Arial GEO Bold** | Arial GEO | `fonts/arial-geo-bold/css/arial-geo-bold.min.css` | `'Arial GEO Bold'` |
| **BPG Banner** | BPG | `fonts/bpg-banner/css/bpg-banner.min.css` | `'BPG Banner'` |
| **BPG Rioni** | BPG | `fonts/bpg-rioni/css/bpg-rioni.min.css` | `'BPG Rioni'` |
| **BPG Mrgvlovani** | BPG | `fonts/bpg-mrgvlovani/css/bpg-mrgvlovani.min.css` | `'BPG Mrgvlovani'` |
| **DejaVu Sans** | DejaVu | `fonts/dejavu-sans/css/dejavu-sans.min.css` | `'DejaVu Sans'` |

---

## ✨ კატალოგის ფუნქციონალი (Web App Features)

საიტის ინტერფეისი აგებულია თანამედროვე Vanilla JavaScript-სა და CSS-ზე ყოველგვარი მძიმე ფრეიმვორკების გარეშე:

- 🔍 **ინტელექტუალური ძიება & ტრანსლიტერაცია:** მუშაობს როგორც ქართული (`გლახო`), ისე ლათინური (`glaho`) კლავიატურით.
- 🔤 **Live Preview & ტექსტის რედაქტირება:** ნებისმიერი სატესტო ტექსტის აკრეფა და ზომის შეცვლა რეალურ დროში.
- 🎨 **ქართული UI ფონტები:** საიტის ინტერფეისის ფონტის შეცვლა (`BPG Nino Mkhedruli`, `BPG Nuskha Modern`, `BPG Glaho`, `ALK Life`, `System`).
- 🛒 **არჩეული ფონტების კალათა (Drawer):** რამდენიმე ფონტის ერთდროული HTML, CSS და NPM კოდის გენერაცია.
- 👁️ **გლიფების მოდალი (Glyph Viewer):** სრული ანბანის (მხედრული, მთავრული, ლათინური, ციფრები) დათვალიერება და 1-Click კოპირება.
- 💾 **პირდაპირი ჩამოტვირთვა:** WOFF2, TTF, WOFF, SVG და EOT ფაილები ლოკალური დიზაინისთვის (Figma, Photoshop).
- 🌙 **Dark & Light თემები:** თანამედროვე მუქი და ნათელი რეჟიმები მეხსიერებით (`localStorage`).
- ⚡ **Lazy Loading:** ფონტის CSS ფაილები იტვირთება მხოლოდ ეკრანზე გამოჩენისას (`IntersectionObserver`).

---

## 🛠️ ლოკალური გაშვება და დეველოპმენტი

```bash
# რეპოზიტორიის კლონირება
git clone https://github.com/e404r/cdn_web-fonts.ge.git
cd cdn_web-fonts.ge

# ლოკალური სერვერის გაშვება
python3 -m http.server 8089
# ან npm-ით:
npm start

# გახსენით ბრაუზერში:
# http://localhost:8089
```

### კატალოგის მონაცემების ხელახალი გენერაცია:
თუ დაამატებთ ახალ ფონტებს `fonts/` საქაღალდეში, გაუშვით:
```bash
python3 build-catalog.py
```
სკრიპტი ავტომატურად დაასკანერებს ყველა ფონტს, წაიკითხავს `@font-face` დეკლარაციებს და დააგენერირებს განახლებულ `fonts.json`-სა და `assets/js/fonts-data.js`-ს.

---

## 📁 პროექტის სტრუქტურა

```text
cdn_web-fonts.ge/
├── index.html              # მთავარი ვებ-აპლიკაცია (Semantic HTML5)
├── package.json            # NPM პაკეტის კონფიგურაცია
├── fonts.json              # 122+ ფონტის მეტამონაცემების სრული ბაზა
├── build-catalog.py        # კატალოგის ავტომატური გენერატორი
├── assets/
│   ├── css/
│   │   └── app.css         # თანამედროვე CSS დიზაინ-სისტემა
│   └── js/
│       ├── app.js          # აპლიკაციის ლოგიკა (Vanilla JS)
│       └── fonts-data.js   # ფონტების გლობალური მონაცემები
└── fonts/                  # 122+ ფონტის საქაღალდე (CSS და WOFF2/TTF ფაილები)
    ├── bpg-nino-mkhedruli/
    ├── bpg-nuskha-modern/
    ├── alk-life/
    └── ...
```

---

## 🤝 მადლობა და ავტორები (Credits & Acknowledgements)

* **ლადო ლომიძე ([Lado Lomidze / web-fonts](https://github.com/web-fonts))** — პროექტის თავდაპირველი შემქმნელი და ინიციატორი ([web-fonts/cdn](https://github.com/web-fonts/cdn)), რომელმაც შექმნა და წლების განმავლობაში უზრუნველყო ქართული ვებ-ფონტების CDN სისტემა.
* **შრიფტების ავტორები და ოსტატები:**
  * **ბესარიონ გუგუშვილი (Besarion Paata Gugushvili)** — ლეგენდარული BPG ფონტების ოჯახის (Nino Mkhedruli, Glaho, Nuskha, Banner, Rioni, DejaVu GEO და სხვ.) შემქმნელი და ქართული ციფრული ტიპოგრაფიის პიონერი.
  * **აკაკი რაზმაძე & ALK Fonts** — ცნობილი ALK ფონტების (ALK Life, ALK Sanet, ALK Rounded და სხვ.) ავტორები.
  * და ყველა სხვა ქართველი ტიპოგრაფი, რომელთა დაუღალავი შრომითაც შეიქმნა ეს ეროვნული ციფრული საგანძური.
* **e404r** — პროექტის v2.0 მოდერნიზაცია: სრული რედიზაინი, თანამედროვე ინტერაქტიული კატალოგი, NPM პაკეტის მხარდაჭერა, ავტომატური მეტამონაცემების გენერაცია და jsDelivr Multi-CDN ოპტიმიზაცია.

---

## 📄 ლიცენზია

* **ფონტები:** საავტორო უფლებები ეკუთვნით მათ თავდაპირველ ავტორებს (Besarion Paata Gugushvili, ALK, და სხვ.). გამოყენება ექვემდებარება შესაბამისი ფონტების სალიცენზიო პირობებს (GPL / OFL / Freeware).
* **კოდი და CDN სისტემა:** კატალოგის ვებ-აპლიკაცია, სკრიპტები და დამხმარე კოდი ვრცელდება [MIT](LICENSE) ლიცენზიით.

