#!/usr/bin/env python3
"""
publish-packages.py
Publishes scoped font micro-packages (@e404r/web-font_<slug>) to npm registry.
"""

import os
import sys
import time
import subprocess
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACKAGES_DIR = os.path.join(BASE_DIR, "packages")

POPULAR_FONTS = [
    "bpg-nino-mkhedruli",
    "bpg-nino-mtavruli",
    "bpg-glaho",
    "bpg-arial",
    "bpg-arial-caps",
    "bpg-nuskha-modern",
    "bpg-ingiri",
    "bpg-banner",
    "alk-life",
    "alk-sanet",
    "alk-rounded-nusxuri",
    "dejavu-sans"
]

def publish_package(pkg_slug, dry_run=False):
    pkg_path = os.path.join(PACKAGES_DIR, pkg_slug)
    if not os.path.exists(pkg_path):
        print(f"Error: {pkg_path} does not exist. Run build-packages.py first.")
        return False

    cmd = ["npm", "publish", "--access", "public"]
    if dry_run:
        cmd.append("--dry-run")

    print(f"\n📦 Publishing @e404r/web-font_{pkg_slug} ({'DRY RUN' if dry_run else 'LIVE'})...")
    res = subprocess.run(cmd, cwd=pkg_path)
    if res.returncode == 0:
        print(f"✓ Successfully published @e404r/web-font_{pkg_slug}")
        return True
    else:
        print(f"✗ Failed to publish @e404r/web-font_{pkg_slug}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Publish font packages to npm registry.")
    parser.add_argument("--font", help="Specific font slug to publish (e.g. bpg-nino-mkhedruli)")
    parser.add_argument("--popular", action="store_true", help="Publish top popular fonts only")
    parser.add_argument("--all", action="store_true", help="Publish all available font packages")
    parser.add_argument("--dry-run", action="store_true", help="Run npm publish --dry-run without actually uploading")
    args = parser.parse_args()

    if not os.path.exists(PACKAGES_DIR):
        print("Error: packages/ directory not found. Run scripts/build-packages.py first.")
        sys.exit(1)

    if args.font:
        publish_package(args.font, dry_run=args.dry_run)
    elif args.popular:
        print(f"Publishing {len(POPULAR_FONTS)} popular fonts...")
        for slug in POPULAR_FONTS:
            publish_package(slug, dry_run=args.dry_run)
            time.sleep(1)
    elif args.all:
        pkgs = sorted(os.listdir(PACKAGES_DIR))
        print(f"Publishing all {len(pkgs)} packages...")
        for slug in pkgs:
            if os.path.isdir(os.path.join(PACKAGES_DIR, slug)):
                publish_package(slug, dry_run=args.dry_run)
                time.sleep(1)
    else:
        print("Please specify --font <slug>, --popular, or --all (optionally with --dry-run)")

if __name__ == "__main__":
    main()
