import re
import sys

def check_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    issues = []
    
    # 1. Header Hierarchy Check
    prev_header_level = 0
    header_regex = re.compile(r'^(#{1,6})\s+(.*)')
    for idx, line in enumerate(lines, 1):
        m = header_regex.match(line)
        if m:
            level = len(m.group(1))
            if level > prev_header_level + 1 and prev_header_level != 0:
                issues.append(f"Line {idx}: Header level jump from H{prev_header_level} to H{level} ('{m.group(2)}')")
            prev_header_level = level

    # 2. Table Column Alignment & Pipe Count Check
    in_table = False
    table_start = 0
    col_count = 0
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('|') and stripped.endswith('|'):
            # Split pipes, accounting for leading/trailing empty strings
            pipes = stripped.split('|')
            # remove first and last empty elements caused by leading/trailing |
            cells = pipes[1:-1]
            num_cols = len(cells)

            if not in_table:
                in_table = True
                table_start = idx
                col_count = num_cols
            else:
                # check separator row or normal row
                is_separator = all(re.match(r'^\s*:?-+:?\s*$', cell) for cell in cells)
                if num_cols != col_count:
                    issues.append(f"Line {idx} (Table starting at L{table_start}): Column count mismatch. Expected {col_count}, got {num_cols}. Line: {stripped[:50]}...")
        else:
            if in_table:
                in_table = False

    # 3. Callout Block Structure Check
    callout_regex = re.compile(r'^>\s*\[\!(IMPORTANT|WARNING|NOTE|TIP|CAUTION)\]')
    in_callout = False
    callout_start = 0
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if callout_regex.match(stripped):
            if in_callout:
                # Nested or consecutive callouts without blank line?
                pass
            in_callout = True
            callout_start = idx
        elif in_callout:
            if stripped.startswith('>'):
                pass
            elif stripped == '':
                in_callout = False
            else:
                # Line in callout doesn't start with '>'
                issues.append(f"Line {idx}: Callout block starting at line {callout_start} has line without '>' prefix: '{stripped}'")

    # 4. Link & Image Syntax Check
    link_regex = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
    malformed_link_regex = re.compile(r'\[([^\]]+)\]\s*\(([^)]+)\)') # space between bracket and paren
    unclosed_bracket = re.compile(r'\[[^\]]*$')
    
    for idx, line in enumerate(lines, 1):
        # check unclosed bold/italic count (even number of double asterisks and single asterisks if not in code block)
        # Note: double asterisks ** inside a line should be even
        # double asterisks:
        clean_line = re.sub(r'`[^`]+`', '', line) # remove inline code
        if clean_line.count('**') % 2 != 0:
            issues.append(f"Line {idx}: Odd number of double asterisks (**): '{line.strip()}'")
            
        if malformed_link_regex.search(line):
            issues.append(f"Line {idx}: Space between link text and URL")

        # check markdown link formatting
        for match in link_regex.finditer(line):
            text, url = match.group(1), match.group(2)
            if not url:
                issues.append(f"Line {idx}: Empty URL in link [{text}]()")

    # 5. Brand authorization check
    # Authorized: Google/Fitbit, Garmin, Samsung, Oura, Whoop, RingConn, Signal Ring, Apple, Xiaomi
    # Competitor check
    unauthorized_brands = ['amazfit', 'coros', 'huawei', 'withings', 'fitbit charge 5', 'fitbit luxe', 'whoop 4.0', 'oura ring 3'] 
    # note: whoop 4.0 or previous generation mentions might be context, but let's check non-authorized brands
    strict_unauthorized = ['amazfit', 'coros', 'huawei', 'withings', 'suunto', 'polar', 'mobvoi', 'ticwatch', 'fossil']
    for idx, line in enumerate(lines, 1):
        line_lower = line.lower()
        for brand in strict_unauthorized:
            if brand in line_lower:
                issues.append(f"Line {idx}: Unauthorized brand mentioned: '{brand}' in line '{line.strip()}'")

    print(f"Total issues found: {len(issues)}")
    for issue in issues:
        print(f"- {issue}")

if __name__ == '__main__':
    check_markdown(r'c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md')
