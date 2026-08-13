import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

md_path = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md"
ts_path = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\src\data\wearables.ts"

with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

md_lines = md_content.splitlines()

print("--- CHECKING PRICES IN MARKDOWN ---")
target_prices = {
    "Signal Ring": ["$399 USD", "$399"],
    "Pixel Watch 5": ["$399 USD (41mm) / $429 USD (45mm)", "$399", "$429"],
    "Galaxy Watch Ultra 2": ["$699 USD", "$699"],
    "Galaxy Watch 9": ["$379.99 USD", "$379.99"],
    "Fitbit Air": ["$99.99 USD", "$99.99"]
}

for dev, expected in target_prices.items():
    print(f"\nDevice: {dev}")
    matches = [(idx+1, line) for idx, line in enumerate(md_lines) if dev.lower() in line.lower()]
    for idx, m in matches:
        print(f"  Line {idx}: {m}")

print("\n--- CHECKING FOR OUTDATED PRICES IN MARKDOWN ---")
outdated_patterns = [
    (r"\$299", "Signal Ring old price $299"),
    (r"\$349", "Pixel Watch old price $349"),
    (r"\$649", "Galaxy Watch Ultra old price $649"),
    (r"\$129", "Fitbit Air old price $129"),
]

for pat, desc in outdated_patterns:
    found = False
    for idx, line in enumerate(md_lines, 1):
        # We need to exclude false positives like Oura Ring 5 ($349 USD) or RingConn Gen 2 (~$299)
        if re.search(pat, line):
            print(f"Found pattern '{pat}' ({desc}) at line {idx}: {line}")
            found = True
    if not found:
        print(f"No outdated pattern '{pat}' ({desc}) found.")

print("\n--- CHECKING BRAND EXCLUSION ---")
# Authorized brands: Google/Fitbit, Garmin, Samsung, Oura, Whoop, RingConn, Signal Ring, Apple, Xiaomi
# Forbidden brands: Ultrahuman, Circular, Withings, Amazfit, Huawei, Coros, Polar, Movano, Suunto
forbidden_brands = [
    "ultrahuman", "circular", "withings", "amazfit", "huawei", "coros", "polar", "movano", "suunto"
]

forbidden_found = False
for fb in forbidden_brands:
    for idx, line in enumerate(md_lines, 1):
        if fb in line.lower():
            print(f"WARNING: Forbidden brand reference '{fb}' found at line {idx}: {line}")
            forbidden_found = True

if not forbidden_found:
    print("[PASS] No forbidden competitor brands found in Markdown.")

print("\n--- CHECKING CALLOUT FORMATTING ---")
callout_types = ["> [!IMPORTANT]", "> [!WARNING]", "> [!NOTE]", "> [!TIP]"]
callout_count = 0
invalid_callouts = 0
for idx, line in enumerate(md_lines, 1):
    if line.strip().startswith("> [!"):
        callout_count += 1
        valid = any(line.strip().startswith(ct) for ct in callout_types)
        if not valid:
            print(f"Invalid callout format at line {idx}: {line}")
            invalid_callouts += 1

if invalid_callouts == 0:
    print(f"[PASS] All {callout_count} GitHub Callouts have valid syntax ({callout_types}).")

print("\n--- CHECKING TABLE ALIGNMENT & SYNTAX ---")
table_lines = [line for idx, line in enumerate(md_lines, 1) if "|" in line]

current_table = []
table_num = 0
for idx, line in enumerate(md_lines, 1):
    if line.strip().startswith("|"):
        current_table.append((idx, line.strip()))
    else:
        if current_table:
            table_num += 1
            print(f"\nAnalyzing Table {table_num} (lines {current_table[0][0]}-{current_table[-1][0]}):")
            col_counts = [row[1].count("|") for row in current_table]
            if len(set(col_counts)) == 1:
                print(f"  [PASS] All {len(current_table)} rows have identical column delimiter count ({col_counts[0]} pipes -> {col_counts[0]-1} columns)")
            else:
                print(f"  [FAIL] Column mismatch! Row pipe counts: {col_counts}")
                for row_idx, row_str in current_table:
                    print(f"    Line {row_idx} ({row_str.count('|')} pipes): {row_str}")
            current_table = []

if current_table:
    table_num += 1
    print(f"\nAnalyzing Table {table_num} (lines {current_table[0][0]}-{current_table[-1][0]}):")
    col_counts = [row[1].count("|") for row in current_table]
    if len(set(col_counts)) == 1:
        print(f"  [PASS] All {len(current_table)} rows have identical column delimiter count ({col_counts[0]} pipes -> {col_counts[0]-1} columns)")
    else:
        print(f"  [FAIL] Column mismatch! Row pipe counts: {col_counts}")

print("\n--- CHECKING WEARABLES.TS MATCHING ---")
if os.path.exists(ts_path):
    with open(ts_path, "r", encoding="utf-8") as f:
        ts_content = f.read()
    
    print("Checking TS for prices:")
    ts_price_checks = {
        "signal-ring": (399, "Signal Ring price 399"),
        "google-pixel-watch-5": (399, "Pixel Watch 5 base price 399"),
        "samsung-galaxy-watch-ultra-2": (699, "Galaxy Watch Ultra 2 price 699"),
        "samsung-galaxy-watch-9": (379.99, "Galaxy Watch 9 price 379.99"),
        "fitbit-air": (99.99, "Fitbit Air price 99.99")
    }
    
    for dev_id, (exp_price, label) in ts_price_checks.items():
        if dev_id in ts_content:
            # find price near dev_id
            dev_block = ts_content.split(dev_id)[1].split("}")[0]
            price_match = re.search(r"priceUsd:\s*([\d\.]+)", dev_block)
            if price_match:
                val = float(price_match.group(1))
                if val == exp_price:
                    print(f"  [PASS] TS {dev_id} priceUsd: {val}")
                else:
                    print(f"  [FAIL] TS {dev_id} priceUsd is {val}, expected {exp_price}")
            else:
                print(f"  [WARN] TS {dev_id} found but priceUsd pattern not matched")
        else:
            print(f"  [INFO/WARN] TS does not contain ID '{dev_id}'")
