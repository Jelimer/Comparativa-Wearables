const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\jelim\\.gemini\\antigravity\\scratch\\comparativa-wearables\\informe_wearables_salud.md', 'utf-8');
const lines = content.split(/\r?\n/);

console.log(`Read ${lines.length} lines.`);

// Check 1: Trailing whitespace or invalid characters
let trailingWsCount = 0;
let tabCount = 0;

lines.forEach((line, idx) => {
    if (/\s+$/.test(line)) trailingWsCount++;
    if (/\t/.test(line)) tabCount++;
});

console.log(`Lines with trailing whitespace: ${trailingWsCount}`);
console.log(`Lines with tab characters: ${tabCount}`);

// Check 2: Unclosed block elements
let calloutOpen = false;
let inTable = false;
let inList = false;

lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Check header spacing (space after #)
    if (/^#+/.test(line) && !/^#+\s/.test(line)) {
        console.warn(`L${lineNum}: Header missing space after #: ${line}`);
    }

    // Check table row pipe closing
    if (line.trim().startsWith('|') && !line.trim().endsWith('|')) {
        console.warn(`L${lineNum}: Table row does not end with pipe '|': ${line}`);
    }

    // Check callout syntax
    if (/^>\s*\[!/.test(line) && !/^>\s*\[!(IMPORTANT|WARNING|NOTE|TIP|CAUTION)\]/.test(line)) {
        console.warn(`L${lineNum}: Invalid GitHub callout type: ${line}`);
    }
});

console.log("Validation complete.");
