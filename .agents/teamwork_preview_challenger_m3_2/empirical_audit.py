import os
import re
import json

ROOT_DIR = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables"
MD_PATH = os.path.join(ROOT_DIR, "informe_wearables_salud.md")
TS_DATA_PATH = os.path.join(ROOT_DIR, "src", "data", "wearables.ts")
FILTER_BAR_PATH = os.path.join(ROOT_DIR, "src", "components", "FilterBar.tsx")
PUBLIC_IMAGES_DIR = os.path.join(ROOT_DIR, "public", "images", "devices")

UNAUTHORIZED_BRANDS = [
    "huawei", "amazfit", "noise", "boat", "polar", "suunto", 
    "coros", "withings", "fossil", "mobvoi", "ticwatch", 
    "ultrahuman", "circular", "movano", "kospet", "fire-boltt"
]

AUTHORIZED_BRANDS = [
    "Google/Fitbit", "Garmin", "Samsung", "Oura", "Whoop", 
    "RingConn", "Signal", "Apple", "Xiaomi"
]

results = {
    "unauthorized_brand_matches": [],
    "whoop_verified": False,
    "images_checked": [],
    "missing_images": [],
    "empty_images": [],
    "errors": []
}

def audit_unauthorized_brands():
    print("--- Audit 1: Unauthorized Brands Search ---")
    files_to_scan = [MD_PATH, TS_DATA_PATH, FILTER_BAR_PATH]
    
    for file_path in files_to_scan:
        if not os.path.exists(file_path):
            results["errors"].append(f"File not found: {file_path}")
            continue
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            for brand in UNAUTHORIZED_BRANDS:
                matches = re.findall(rf"\b{brand}\b", content, re.IGNORECASE)
                if matches:
                    results["unauthorized_brand_matches"].append({
                        "file": os.path.basename(file_path),
                        "brand": brand,
                        "count": len(matches)
                    })
    
    print(f"Unauthorized brand matches count: {len(results['unauthorized_brand_matches'])}")
    if results['unauthorized_brand_matches']:
        print("Matches found:", results['unauthorized_brand_matches'])
    else:
        print("PASS: 0 unauthorized brand matches found in documentation and codebase.")

def audit_whoop_inclusion():
    print("\n--- Audit 2: Whoop Inclusion Search ---")
    with open(TS_DATA_PATH, "r", encoding="utf-8") as f:
        ts_content = f.read()
    
    whoop_in_ts = "Whoop" in ts_content and "whoop-5-0" in ts_content
    
    with open(MD_PATH, "r", encoding="utf-8") as f:
        md_content = f.read()
    whoop_in_md = "Whoop" in md_content and "Whoop 5.0" in md_content
    
    with open(FILTER_BAR_PATH, "r", encoding="utf-8") as f:
        filter_content = f.read()
    whoop_in_filter = "{ label: 'Whoop', value: 'Whoop' }" in filter_content
    
    results["whoop_verified"] = whoop_in_ts and whoop_in_md and whoop_in_filter
    print(f"Whoop in TS data: {whoop_in_ts}")
    print(f"Whoop in MD doc: {whoop_in_md}")
    print(f"Whoop in FilterBar: {whoop_in_filter}")
    print(f"Whoop Verification Overall: {'PASS' if results['whoop_verified'] else 'FAIL'}")

def audit_image_assets():
    print("\n--- Audit 3: Image Asset Verification ---")
    with open(TS_DATA_PATH, "r", encoding="utf-8") as f:
        ts_content = f.read()
    
    # Extract imageUrls
    image_urls = re.findall(r"imageUrl:\s*'([^']+)'", ts_content)
    print(f"Total imageUrl references in dataset: {len(image_urls)}")
    
    for rel_path in image_urls:
        # e.g. /images/devices/google-pixel-watch-5.svg
        clean_path = rel_path.lstrip("/").replace("/", os.sep)
        full_path = os.path.join(ROOT_DIR, "public", clean_path)
        
        results["images_checked"].append(rel_path)
        if not os.path.exists(full_path):
            results["missing_images"].append(rel_path)
        else:
            size = os.path.getsize(full_path)
            if size == 0:
                results["empty_images"].append(rel_path)
    
    print(f"Missing images count: {len(results['missing_images'])}")
    print(f"Empty images count: {len(results['empty_images'])}")
    if not results['missing_images'] and not results['empty_images']:
        print("PASS: All referenced device images exist and are non-empty.")

if __name__ == "__main__":
    audit_unauthorized_brands()
    audit_whoop_inclusion()
    audit_image_assets()
    
    with open(os.path.join(os.path.dirname(__file__), "audit_output.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
