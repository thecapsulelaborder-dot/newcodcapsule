const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');

// Analyze only from `return (` inside App to the end of return
let startIndex = lines.findIndex(l => l.includes('return (') && l.trim() === 'return (');
let endIndex = lines.length - 1;

// Let's find where the return statement ends (the last closing div and paren)
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes(');') && lines[i].includes('}')) {
        endIndex = i;
        break;
    }
}

console.log(`Analyzing JSX from line ${startIndex + 1} to line ${endIndex + 1}`);

const jsxLines = lines.slice(startIndex, endIndex + 1);
let stack = [];

// Better tag regex that matches standard JSX tags but skips TypeScript generics
// Known JSX tags in our code
const knownJSXTags = [
    'div', 'span', 'p', 'button', 'ul', 'li', 'footer', 'header', 'form', 'label', 'textarea', 'input', 'a', 
    'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'OrderInquiryModal', 'ClientCabinet', 'AdminPanel', 
    'OrderTrackPortal', 'PaymentMethods', 'AnimatePresence', 'motion.div', 'Sparkles', 'Copy', 'Search', 'Trash2', 
    'Sliders', 'QrCode', 'Menu', 'ChevronRight', 'ChevronDown', 'Info', 'Check', 'X', 'ShoppingBag', 'img',
    'Facebook', 'Send', 'Linkedin', 'Instagram', 'Phone', 'Mail', 'Sparkles'
];

for (let r = 0; r < jsxLines.length; r++) {
    let line = jsxLines[r];
    let absLineNum = startIndex + r + 1;
    let trimmed = line.trim();
    
    // Ignore comments
    if (trimmed.startsWith('//') || trimmed.startsWith('{/*') || trimmed.startsWith('/*')) continue;
    
    // Extract actual JSX tags (opening and closing)
    let tagRegex = /<\/?([a-zA-Z0-9_\-\.]+)(?:\s+[^>]*?)?(\/?)>/g;
    let match;
    while ((match = tagRegex.exec(line)) !== null) {
        let fullMatch = match[0];
        let tagName = match[1];
        let isClosing = fullMatch.startsWith('</');
        let isSelfClosing = fullMatch.endsWith('/>') || match[2] === '/';
        
        // Ensure it's a known tag and not a TS generic (or check lowercase + known uppercase components)
        if (!knownJSXTags.includes(tagName)) {
            continue;
        }
        
        if (isSelfClosing) {
            continue;
        }
        
        if (isClosing) {
            if (stack.length > 0) {
                let last = stack.pop();
                if (last.name !== tagName) {
                    console.log(`Line ${absLineNum}: Mismatch! Opened <${last.name}> on line ${last.line}, closed with </${tagName}>. Row: "${trimmed}"`);
                    // Put it back
                    stack.push(last);
                }
            } else {
                console.log(`Line ${absLineNum}: Unmatched closing tag </${tagName}>. Row: "${trimmed}"`);
            }
        } else {
            stack.push({ name: tagName, line: absLineNum, text: trimmed });
        }
    }
}

console.log('\nUnclosed tags remaining in JSX stack:', stack.length);
stack.forEach(t => {
    console.log(`- <${t.name}> opened on line ${t.line}: "${t.text}"`);
});
