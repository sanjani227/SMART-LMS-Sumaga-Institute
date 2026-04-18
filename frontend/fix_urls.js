const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace "http://localhost:3000/some/path"  -> `${process.env.NEXT_PUBLIC_API_URL}/some/path`
    content = content.replace(/"http:\/\/localhost:3000([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
    
    // Replace 'http://localhost:3000/some/path'  -> `${process.env.NEXT_PUBLIC_API_URL}/some/path`
    content = content.replace(/'http:\/\/localhost:3000([^']*)'/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
    
    // Replace `http://localhost:3000/some/path`  -> `${process.env.NEXT_PUBLIC_API_URL}/some/path`
    content = content.replace(/`http:\/\/localhost:3000\//g, '`${process.env.NEXT_PUBLIC_API_URL}/');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${changedCount} files.`);
