const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '../.env');
    const content = fs.readFileSync(envPath);

    // Helper to find pattern in buffer
    function findKey(buffer, encoding) {
        const keyName = 'APPWRITE_API_KEY=';
        let pattern;
        if (encoding === 'utf16le') {
            pattern = Buffer.from(keyName, 'utf16le');
        } else {
            pattern = Buffer.from(keyName, 'utf8');
        }

        const index = buffer.indexOf(pattern);
        if (index !== -1) {
            console.log(`Found key with ${encoding} encoding at index ${index}`);
            let end = buffer.indexOf(encoding === 'utf16le' ? Buffer.from('\n', 'utf16le') : Buffer.from('\n'), index);
            if (end === -1) end = buffer.length;

            const line = buffer.slice(index + pattern.length, end);
            console.log('KEY VALUE:', line.toString(encoding));
            return true;
        }
        return false;
    }

    if (!findKey(content, 'utf8')) {
        findKey(content, 'utf16le');
    }
} catch (err) {
    console.error('Error reading .env:', err);
}
