import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def run_deep_check():
    filepath = r'c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.splitlines()

    report = {
        "tables": [],
        "callouts": [],
        "headers": [],
        "links": [],
        "devices_mentioned": [],
        "issues": []
    }

    # 1. Header Extraction & Numbering Verification
    header_pattern = re.compile(r'^(#{1,6})\s+(.*)')
    for idx, line in enumerate(lines, 1):
        m = header_pattern.match(line)
        if m:
            level = len(m.group(1))
            title = m.group(2)
            report["headers"].append({"line": idx, "level": level, "title": title})

    # Check header levels sequence
    for i in range(len(report["headers"]) - 1):
        curr = report["headers"][i]
        nxt = report["headers"][i+1]
        if nxt["level"] > curr["level"] + 1:
            report["issues"].append({
                "severity": "LOW",
                "type": "HEADER_LEVEL_JUMP",
                "line": nxt["line"],
                "detail": f"Header level jumped from H{curr['level']} ('{curr['title']}') to H{nxt['level']} ('{nxt['title']}')"
            })

    # 2. Section Numbering Audit
    section_nums = []
    for h in report["headers"]:
        if h["level"] == 2:
            num_match = re.search(r'(\d+(?:\.\d+)?)', h['title'])
            num = num_match.group(1) if num_match else "N/A"
            section_nums.append((h["line"], num, h["title"]))
    
    # 3. Callout Block Verification (GitHub Flavored Markdown Alerts)
    callout_alert_pattern = re.compile(r'^>\s*\[\!(IMPORTANT|WARNING|NOTE|TIP|CAUTION)\]')
    in_callout = False
    current_callout = None

    for idx, line in enumerate(lines, 1):
        m = callout_alert_pattern.match(line)
        if m:
            if in_callout and current_callout:
                report["callouts"].append(current_callout)
            in_callout = True
            current_callout = {
                "start_line": idx,
                "type": m.group(1),
                "lines_count": 1,
                "has_malformed_quote_lines": False
            }
        elif in_callout:
            if line.startswith('>'):
                current_callout["lines_count"] += 1
            elif line.strip() == '':
                in_callout = False
                report["callouts"].append(current_callout)
                current_callout = None
            else:
                current_callout["has_malformed_quote_lines"] = True
                report["issues"].append({
                    "severity": "MEDIUM",
                    "type": "CALLOUT_UNQUOTED_LINE",
                    "line": idx,
                    "detail": f"Line inside callouts block starting at L{current_callout['start_line']} missing '>' prefix: '{line}'"
                })
                in_callout = False
                report["callouts"].append(current_callout)
                current_callout = None
    if in_callout and current_callout:
        report["callouts"].append(current_callout)

    # 4. Table Structure & Column Alignment Verification
    in_table = False
    table_data = None

    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            if not in_table:
                in_table = True
                table_data = {
                    "start_line": idx,
                    "headers": cells,
                    "expected_cols": len(cells),
                    "rows": [],
                    "has_separator": False,
                    "aligned_cols": []
                }
            elif not table_data["has_separator"]:
                # Check separator row
                is_sep = all(re.match(r'^\s*:?-+:?\s*$', cell) for cell in cells)
                if is_sep:
                    table_data["has_separator"] = True
                    if len(cells) != table_data["expected_cols"]:
                        report["issues"].append({
                            "severity": "HIGH",
                            "type": "TABLE_SEPARATOR_COL_MISMATCH",
                            "line": idx,
                            "detail": f"Table separator has {len(cells)} cols, header has {table_data['expected_cols']}"
                        })
                    # capture alignments
                    for cell in cells:
                        if cell.startswith(':') and cell.endswith(':'):
                            table_data["aligned_cols"].append("center")
                        elif cell.endswith(':'):
                            table_data["aligned_cols"].append("right")
                        elif cell.startswith(':'):
                            table_data["aligned_cols"].append("left")
                        else:
                            table_data["aligned_cols"].append("default")
                else:
                    report["issues"].append({
                        "severity": "HIGH",
                        "type": "TABLE_MISSING_SEPARATOR",
                        "line": idx,
                        "detail": f"Second row of table starting at L{table_data['start_line']} is not a valid separator"
                    })
            else:
                if len(cells) != table_data["expected_cols"]:
                    report["issues"].append({
                        "severity": "HIGH",
                        "type": "TABLE_ROW_COL_MISMATCH",
                        "line": idx,
                        "detail": f"Table starting at L{table_data['start_line']}: Row at L{idx} has {len(cells)} cols, expected {table_data['expected_cols']}"
                    })
                table_data["rows"].append({"line": idx, "cells": cells})
        else:
            if in_table:
                in_table = False
                report["tables"].append(table_data)
                table_data = None
    if in_table and table_data:
        report["tables"].append(table_data)

    # 5. Link and Image Parser
    link_regex = re.compile(r'!?\[([^\]]*)\]\(([^)]+)\)')
    for idx, line in enumerate(lines, 1):
        for m in link_regex.finditer(line):
            alt_or_text, target = m.group(1), m.group(2)
            report["links"].append({"line": idx, "text": alt_or_text, "target": target})

    # 6. Extract H3 Device Names
    h3_regex = re.compile(r'^###\s+([^\n]+)')
    for idx, line in enumerate(lines, 1):
        m = h3_regex.match(line)
        if m:
            report["devices_mentioned"].append({"line": idx, "name": m.group(1)})

    # Output results
    print("=== SUMMARY OF DEEP MARKDOWN VERIFICATION ===")
    print(f"Total H2/H3/H4 Headers: {len(report['headers'])}")
    print(f"Total Callout Blocks: {len(report['callouts'])}")
    print(f"Total Markdown Tables: {len(report['tables'])}")
    print(f"Total Links Found: {len(report['links'])}")
    print(f"Total Devices in H3: {len(report['devices_mentioned'])}")
    print(f"Total Issues Found: {len(report['issues'])}")
    print("\n--- Section 2 H2 Headers ---")
    for line_no, num, title in section_nums:
        print(f"L{line_no}: [{num}] {title}")

    print("\n--- Tables Overview ---")
    for t_idx, t in enumerate(report["tables"], 1):
        print(f"Table {t_idx} (L{t['start_line']}): Header cols={t['expected_cols']}, Rows={len(t['rows'])}, Separator={t['has_separator']}")
        print(f"  Headers: {t['headers']}")
        print(f"  Alignments: {t['aligned_cols']}")

    print("\n--- Callouts Overview ---")
    callout_counts = {}
    for c in report["callouts"]:
        callout_counts[c["type"]] = callout_counts.get(c["type"], 0) + 1
    print(f"Callout type breakdown: {callout_counts}")

    print("\n--- Devices Listed in H3 ---")
    for d in report["devices_mentioned"]:
        print(f"L{d['line']}: {d['name']}")

    if report["issues"]:
        print("\n--- ISSUES ---")
        for iss in report["issues"]:
            print(f"[{iss['severity']}] {iss['type']} at L{iss['line']}: {iss['detail']}")

if __name__ == '__main__':
    run_deep_check()
