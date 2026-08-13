import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

md_path = r"c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md"

with open(md_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in report: {len(lines)}")

# 1. Price checks
price_mentions = []
for i, line in enumerate(lines, 1):
    prices = re.findall(r"\$\d+(?:\.\d+)?", line)
    if prices:
        price_mentions.append((i, line.strip(), prices))

print(f"\nFound {len(price_mentions)} lines with price mentions:")
for idx, text, pr in price_mentions:
    print(f"  Line {idx}: {pr} -> {text}")

# 2. Check callouts line by line
print("\nCallout details:")
for i, line in enumerate(lines, 1):
    if line.strip().startswith("> [!"):
        print(f"  Line {i}: {line.strip()}")

# 3. Check markdown headings
print("\nHeadings detail:")
for i, line in enumerate(lines, 1):
    if line.strip().startswith("#"):
        print(f"  Line {i}: {line.strip()}")

