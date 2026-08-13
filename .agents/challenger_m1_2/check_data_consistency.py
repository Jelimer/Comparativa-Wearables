import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def check_consistency():
    filepath = r'c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # List of devices in text sections
    text_devices = [
        "Pixel Watch 5",
        "Fitbit Sense 2",
        "Fitbit Charge 6",
        "Fitbit Air",
        "Garmin Epix Pro",
        "Garmin CIRQA",
        "Galaxy Watch Ultra 2",
        "Galaxy Watch 9",
        "Galaxy Ring",
        "Whoop 5.0",
        "Whoop MG",
        "Oura Ring 5",
        "Oura Ring 4",
        "Signal Ring",
        "RingConn Gen 2",
        "Apple Watch Series 10",
        "Apple Watch Ultra 3",
        "Xiaomi Smart Band 9",
        "Xiaomi Smart Band 10 Pro"
    ]

    # Extract all table rows from Table 1, Table 2, Table 3, Table 4
    tables_found = re.findall(r'\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n((?:\|[^\n]+\|\n?)+)', content)

    print(f"Total markdown tables extracted: {len(tables_found)}")

    table_devices = []
    for idx, table_body in enumerate(tables_found, 1):
        print(f"\n--- Processing Table {idx} ---")
        rows = table_body.strip().splitlines()
        for row in rows:
            cells = [c.strip() for c in row.split('|')[1:-1]]
            device_cell = cells[0]
            print(f"  Cell 0: {device_cell[:40]}")
            table_devices.append(device_cell)

    # Check if all text devices are represented in tables
    missing_in_tables = []
    for d in text_devices:
        found = any(d.lower() in td.lower() for td in table_devices)
        if not found:
            missing_in_tables.append(d)

    print("\n--- CONSISTENCY RESULT ---")
    if missing_in_tables:
        print(f"Devices in text missing from tables: {missing_in_tables}")
    else:
        print("ALL text devices are represented in comparison tables!")

if __name__ == '__main__':
    check_consistency()
