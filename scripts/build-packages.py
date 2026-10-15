#!/usr/bin/env python3
"""
build-packages.py
Generates individual scoped NPM micro-packages for each Georgian font:
@e404r/web-font_<font-slug>
"""

import os
import sys
import json
import shutil
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS_DIR = os.path.join(BASE_DIR, "fonts")
FONTS_JSON_PATH = os.path.join(BASE_DIR, "fonts.json")
PACKAGES_DIR = os.path.join(BASE_DIR, "packages")

def load_fonts_catalog():
    if os.path.exists(FONTS_JSON_PATH):
        with open(FONTS_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def build_single_package(font_info, output_base):
    slug = font_info["slug"]
    name = font_info["name"]
    category = font_info.get("category", "Classic")
    script_type = font_info.get("scriptType", "Mkhedruli")
    src_font_dir = os.path.join(FONTS_DIR, slug)

    if not os.path.exists(src_font_dir):
        print(f"Warning: Directory {src_font_dir} not found. Skipping.")
        return None

    pkg_dir = os.path.join(output_base, slug)
    os.makedirs(pkg_dir, exist_ok=True)

    # 1. Copy fonts directory
    src_fonts_sub = os.path.join(src_font_dir, "fonts")
    dst_fonts_sub = os.path.join(pkg_dir, "fonts")
    if os.path.exists(dst_fonts_sub):
        shutil.rmtree(dst_fonts_sub)
    if os.path.exists(src_fonts_sub):
        shutil.copytree(src_fonts_sub, dst_fonts_sub)

    # 2. Build index.css
    css_file_name = font_info.get("cssFile", f"{slug}.min.css")
    src_css = os.path.join(src_font_dir, "css", css_file_name)
    if not os.path.exists(src_css):
        # fallback to non-minified
        src_css = os.path.join(src_font_dir, "css", f"{slug}.css")

    css_content = ""
    if os.path.exists(src_css):
        with open(src_css, "r", encoding="utf-8", errors="ignore") as f:
            css_content = f.read()
        # Adjust font paths from ../fonts/ to ./fonts/
        css_content = css_content.replace("../fonts/", "./fonts/")

    dst_css = os.path.join(pkg_dir, "index.css")
    with open(dst_css, "w", encoding="utf-8") as f:
        f.write(css_content)

    # 3. Create package.json
    pkg_name = f"@e404r/web-font_{slug}"
    pkg_json = {
        "name": pkg_name,
        "version": "2.0.0",
        "description": f"{name} ({category}, {script_type}) — Georgian Web Font for modern frontend apps (React, Next.js, Vite, Angular, Vue)",
        "main": "index.css",
        "style": "index.css",
        "repository": {
            "type": "git",
            "url": "git+https://github.com/e404r/cdn_web-fonts.ge.git",
            "directory": f"fonts/{slug}"
        },
        "keywords": [
            "georgian-fonts",
            "webfont",
            slug,
            category.lower().replace(" ", "-"),
            "typography",
            "georgian"
        ],
        "author": "e404r",
        "license": "MIT",
        "publishConfig": {
            "access": "public"
        },
        "bugs": {
            "url": "https://github.com/e404r/cdn_web-fonts.ge/issues"
        },
        "homepage": "https://web-fonts.e404r.vip"
    }

    with open(os.path.join(pkg_dir, "package.json"), "w", encoding="utf-8") as f:
        json.dump(pkg_json, f, indent=2, ensure_ascii=False)

    # 4. Create README.md
    readme_content = f"""# {pkg_name}

> **{name}** — ქართული ვებ-ფონტი (Georgian Web Font)
> კატეგორია: {category} | დამწერლობა: {script_type}

## 📦 ინსტალაცია (Installation)

```bash
npm install {pkg_name}
```

## 🚀 გამოყენება (Usage)

### 1. იმპორტი React, Next.js, Vite, Angular, Vue ან სტილის ფაილში:
```javascript
// main.js / _app.js / index.ts
import '{pkg_name}';
```
ან CSS/SCSS-ში:
```css
@import "{pkg_name}";
```

### 2. გამოყენება CSS-ში:
```css
body {{
  font-family: '{name}', sans-serif;
}}
```

---
🌐 **ონლაინ კატალოგი & ცოცხალი გადახედვა:** [web-fonts.e404r.vip](https://web-fonts.e404r.vip)  
📂 **სრული კოლექცია:** [github.com/e404r/cdn_web-fonts.ge](https://github.com/e404r/cdn_web-fonts.ge)
"""
    with open(os.path.join(pkg_dir, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme_content)

    return pkg_dir

def main():
    parser = argparse.ArgumentParser(description="Build modular NPM packages for Georgian fonts.")
    parser.add_argument("--font", help="Slug of a single font to build (e.g. bpg-nino-mkhedruli)")
    parser.add_argument("--all", action="store_true", help="Build all font packages")
    parser.add_argument("--clean", action="store_true", help="Clean packages/ directory before building")
    args = parser.parse_args()

    fonts = load_fonts_catalog()
    if not fonts:
        print("Error: No fonts found in fonts.json. Run build-catalog.py first.")
        sys.exit(1)

    if args.clean and os.path.exists(PACKAGES_DIR):
        print(f"Cleaning {PACKAGES_DIR}...")
        shutil.rmtree(PACKAGES_DIR)

    os.makedirs(PACKAGES_DIR, exist_ok=True)

    if args.font:
        target = next((f for f in fonts if f["slug"] == args.font), None)
        if not target:
            print(f"Error: Font with slug '{args.font}' not found.")
            sys.exit(1)
        res = build_single_package(target, PACKAGES_DIR)
        print(f"✓ Built package for {target['name']}: {res}")
    elif args.all:
        count = 0
        for f in fonts:
            res = build_single_package(f, PACKAGES_DIR)
            if res:
                count += 1
        print(f"✓ Successfully built {count} font packages in {PACKAGES_DIR}/")
    else:
        print("Please specify --font <slug> or --all")

if __name__ == "__main__":
    main()
