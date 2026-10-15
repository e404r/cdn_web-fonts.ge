# 🇬🇪 Georgian Web Fonts CDN (cdn_web-fonts.ge)

ქართული ვებ-ფონტების უფასო, სწრაფი და გლობალური CDN სერვისი **jsDelivr**-ის ბაზაზე.

ეს რეპოზიტორი წარმოადგენს [web-fonts/cdn](https://github.com/web-fonts/cdn)-ის სარკეს (Mirror), რომელიც სრულად თავსებადია jsDelivr CDN-თან და განკუთვნილია ნებისმიერ ვებსაიტზე ქართული ფონტების მარტივი ინტეგრაციისთვის.

---

## 🚀 სწრაფი დაწყება (Quick Start)

ფონტის გამოსაყენებლად ჩასვით სასურველი CSS ფაილის ლინკი თქვენი HTML დოკუმენტის `<head>` სექციაში:

```html
<!-- ALK Life -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/alk-life/css/alk-life.min.css">
```

შემდეგ გამოიყენეთ იგი თქვენს CSS ფაილში:

```css
body {
  font-family: 'ALK Life', sans-serif;
}
```

---

## 🔗 CDN URL სტრუქტურა

ნებისმიერი ფონტის გამოსაძახებლად ბმულის სტრუქტურა ასეთია:

```text
https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@{ვერსია-ან-ბრენჩი}/fonts/{ფონტის-საქაღალდე}/css/{ფაილი}.min.css
```

* **ბრენჩით (`main`):** ყოველთვის უახლესი ვერსია  
  `https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/...`
* **ტეგით (`1.0.0`):** მყარი, სტაბილური ქეში წარმოებისთვის (Production)  
  `https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@1.0.0/fonts/...`

---

## 📦 პოპულარული ფონტების ბმულები

| ფონტი | HTML Link (`<head>`) | CSS `font-family` |
| :--- | :--- | :--- |
| **ALK Life** | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/alk-life/css/alk-life.min.css">` | `'ALK Life'` |
| **BPG DejaVu Sans** | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/dejavu-sans/css/bpg-dejavu-sans.min.css">` | `'BPG DejaVu Sans'` |
| **BPG Arial** | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/bpg-arial/css/bpg-arial.min.css">` | `'BPG Arial'` |
| **BPG Nino Mkhedruli** | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/bpg-nino-mkhedruli/css/bpg-nino-mkhedruli.min.css">` | `'BPG Nino Mkhedruli'` |
| **BPG Glaho** | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/bpg-glaho/css/bpg-glaho.min.css">` | `'BPG Glaho'` |
| **BPG Banner** | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/bpg-banner/css/bpg-banner.min.css">` | `'BPG Banner'` |
| **BPG Rioni** | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/bpg-rioni/css/bpg-rioni.min.css">` | `'BPG Rioni'` |

---

## 🎨 გამოყენების ალტერნატიული გზები

### 1. იმპორტი პირდაპირ CSS-ში (`@import`):
```css
@import url('https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/alk-life/css/alk-life.min.css');

body {
  font-family: 'ALK Life', sans-serif;
}
```

### 2. ფონტის პირდაპირი გამოძახება (`@font-face`):
თუ არ გსურთ მზა CSS ფაილის ჩატვირთვა და გჭირდებათ მხოლოდ კონკრეტული ფაილი:
```css
@font-face {
  font-family: 'ALK Life';
  src: url('https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/alk-life/fonts/alk-life-webfont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
```

---

## 🔄 ავტომატური სინქრონიზაცია

რეპოზიტორი ავტომატურად სინქრონიზდება [web-fonts/cdn](https://github.com/web-fonts/cdn)-ის საწყის რეპოზიტორთან GitHub Actions-ის მეშვეობით კვირაში ერთხელ.
