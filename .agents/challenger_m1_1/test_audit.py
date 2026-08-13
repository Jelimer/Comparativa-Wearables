import os
import re
import json

md_path = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md"
ts_path = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\src\data\wearables.ts"
public_dir = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\public"

with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

print("--- 1. Checking Forbidden Brands in MD ---")
forbidden_candidates = ["Ultrahuman", "Circular", "Withings", "Amazfit", "Huawei", "Coros", "Polar", "Fitbit Premium", "Apple Watch", "Whoop"]
authorized_brands = ["Google", "Fitbit", "Garmin", "Samsung", "Oura", "Whoop", "RingConn", "Signal Ring", "Apple", "Xiaomi"]

# Check for unauthorized brand names
all_potential_brands = ["Ultrahuman", "Circular", "Withings", "Amazfit", "Huawei", "Coros", "Polar", "KOSPET", "Mobvoi", "TicWatch", "Suunto", "Noise", "Fire-Boltt", "Boat"]
found_forbidden = []
for brand in all_potential_brands:
    if re.search(r'\b' + re.escape(brand) + r'\b', md_content, re.IGNORECASE):
        found_forbidden.append(brand)

print(f"Forbidden brands found: {found_forbidden}")

print("\n--- 2. Extracting Devices from MD ---")
# Devices mentioned in markdown
md_devices = re.findall(r'### [^\n]*?([A-Z][A-Za-z0-9\s\.\(\)\/\-\+]+)', md_content)
for d in md_devices:
    print(f"  - MD Device Header: {d.strip()}")

print("\n--- 3. Checking Images in Public Dir referenced by TS ---")
image_matches = re.findall(r"imageUrl:\s*['\"]([^'\"]+)['\"]", ts_content)
missing_images = []
for img in image_matches:
    # remove leading slash if present
    rel_path = img.lstrip('/')
    abs_img_path = os.path.join(public_dir, rel_path)
    exists = os.path.exists(abs_img_path)
    print(f"Image '{img}' -> Local Path '{abs_img_path}' Exists? {exists}")
    if not exists:
        missing_images.append(img)

print(f"Missing local images: {missing_images}")

print("\n--- Audit Script Completed ---")
