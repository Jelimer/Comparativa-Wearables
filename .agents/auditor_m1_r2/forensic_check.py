import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

md_path = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md"

with open(md_path, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.splitlines()

print("==================================================")
print("     FORENSIC INTEGRITY AUDIT - ITERATION 2      ")
print("==================================================")

print("\n--- 1. CHECKING ITERATION 2 PRICE ADJUSTMENTS ---")
price_checks = [
    ("Signal Ring", r"\$399\s*USD", ["Section 4", "Table 3", "TCO Table"]),
    ("Pixel Watch 5", r"\$399\s*USD\s*\(41mm\)\s*\/\s*\$429\s*USD\s*\(45mm\)", ["Table 1", "TCO Table"]),
    ("Galaxy Watch Ultra 2", r"\$699\s*USD", ["Table 1", "TCO Table"]),
    ("Galaxy Watch 9", r"\$379\.99\s*USD", ["Section 3", "Table 1"]),
    ("Fitbit Air", r"\$99\.99\s*USD", ["Table 2"])
]

all_prices_correct = True
for device, pattern, locations in price_checks:
    matches = [(idx+1, line.strip()) for idx, line in enumerate(lines) if re.search(pattern, line)]
    print(f"\n[Device] {device} (Expected pattern: {pattern})")
    if matches:
        print(f"  Found {len(matches)} match(es):")
        for line_num, line_str in matches:
            print(f"    Line {line_num}: {line_str}")
    else:
        print(f"  [FAIL] Pattern not found!")
        all_prices_correct = False

print("\n--- 2. CHECKING MATH AND DEPENDENT CALCULATIONS ---")
math_checks = [
    ("Pixel Watch 5 + Oura Ring 5 hardware", "$399 + $349 = $748 USD"),
    ("Pixel Watch 5 + Oura Ring 5 total 3-year cost", "~$964 USD"),
    ("Galaxy Watch Ultra 2 + Galaxy Ring hardware", "$699 + $399 = $1098 USD"),
    ("Galaxy Watch Ultra 2 + Galaxy Ring total 3-year cost", "~$1098 USD"),
    ("Garmin Epix Pro + Garmin CIRQA hardware", "$899 + $199 = $1098 USD")
]

all_math_correct = True
for label, expected_str in math_checks:
    matches = [(idx+1, line.strip()) for idx, line in enumerate(lines) if expected_str in line]
    if matches:
        print(f"  [PASS] {label}: Found '{expected_str}' at line {matches[0][0]}")
    else:
        print(f"  [FAIL] {label}: String '{expected_str}' NOT FOUND!")
        all_math_correct = False

print("\n--- 3. CHECKING BRAND EXCLUSIONS ---")
authorized_brands = [
    "Google", "Fitbit", "Garmin", "Samsung", "Oura", "Whoop", "RingConn", "Signal Ring", "Signal", "Apple", "Xiaomi"
]

# Prohibited brands list
prohibited_brands = [
    "huawei", "amazfit", "ultrahuman", "circular", "withings", "coros", "polar", "movano", 
    "suunto", "fossil", "ticwatch", "mobvoi", "whoop" # Whoop IS authorized
]
# Remove authorized from prohibited
prohibited_brands.remove("whoop")

violations_brand = []
for p_brand in prohibited_brands:
    for idx, line in enumerate(lines, 1):
        # check whole word match
        if re.search(r"\b" + re.escape(p_brand) + r"\b", line, re.IGNORECASE):
            violations_brand.append((idx, p_brand, line.strip()))

if violations_brand:
    print(f"  [FAIL] Found {len(violations_brand)} unauthorized brand reference(s):")
    for line_num, b, l in violations_brand:
        print(f"    Line {line_num} [{b}]: {l}")
else:
    print("  [PASS] Zero unauthorized brand references found.")

print("\n--- 4. CHECKING GITHUB CALLOUTS FORMATTING ---")
callout_pattern = re.compile(r"^\s*>\s*\[!(IMPORTANT|WARNING|NOTE|TIP)\]")
total_callouts = 0
invalid_callouts = []
for idx, line in enumerate(lines, 1):
    if "> [" in line or ">  [" in line:
        total_callouts += 1
        if not callout_pattern.match(line):
            invalid_callouts.append((idx, line.strip()))

if invalid_callouts:
    print(f"  [FAIL] Found {len(invalid_callouts)} invalid callout syntax lines:")
    for line_num, l in invalid_callouts:
        print(f"    Line {line_num}: {l}")
else:
    print(f"  [PASS] All {total_callouts} callout alerts have valid syntax.")

print("\n--- 5. CHECKING TABLE SYNTAX & ALIGNMENT ---")
tables = []
current = []
for idx, line in enumerate(lines, 1):
    if line.strip().startswith("|"):
        current.append((idx, line.strip()))
    else:
        if current:
            tables.append(current)
            current = []
if current:
    tables.append(current)

table_errors = False
for t_idx, t in enumerate(tables, 1):
    pipe_counts = [row[1].count("|") for row in t]
    if len(set(pipe_counts)) != 1:
        print(f"  [FAIL] Table {t_idx} (lines {t[0][0]}-{t[-1][0]}) has inconsistent column count: {pipe_counts}")
        table_errors = True
    else:
        print(f"  [PASS] Table {t_idx} (lines {t[0][0]}-{t[-1][0]}): {len(t)} rows, {pipe_counts[0]-1} columns.")

print("\n--- SUMMARY OF FORENSIC CHECKS ---")
print(f"Price Adjustments: {'PASS' if all_prices_correct else 'FAIL'}")
print(f"Math & Calculations: {'PASS' if all_math_correct else 'FAIL'}")
print(f"Brand Exclusions: {'PASS' if len(violations_brand) == 0 else 'FAIL'}")
print(f"GitHub Callouts: {'PASS' if len(invalid_callouts) == 0 else 'FAIL'}")
print(f"Table Formatting: {'PASS' if not table_errors else 'FAIL'}")

