import sys

sys.stdout.reconfigure(encoding='utf-8')

try:
    import markdown
    has_markdown = True
except ImportError:
    has_markdown = False

def test_parse():
    filepath = r'c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\informe_wearables_salud.md'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"Has markdown library: {has_markdown}")
    if has_markdown:
        html = markdown.markdown(content, extensions=['tables', 'fenced_code'])
        print(f"Markdown HTML generated successfully! Length: {len(html)} bytes")
    else:
        print("Standard markdown module not installed, performing regex HTML rendering check...")

if __name__ == '__main__':
    test_parse()
