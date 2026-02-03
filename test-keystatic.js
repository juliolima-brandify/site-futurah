const { createReader } = require('@keystatic/core/reader');
const path = require('path');

// We can't easily import the config because it's TS, but we can try to require the compiled version if it exists
// or just mock a minimal test

async function test() {
    try {
        const config = require('./keystatic.config.ts').default; // This might fail if not using ts-node
        const reader = createReader(process.cwd(), config);
        const posts = await reader.collections.posts.all();
        console.log('Posts found:', posts.length);
        posts.forEach(p => console.log(' - Slug:', p.slug, 'Title:', p.entry.title));
    } catch (e) {
        console.error('Error during test:', e);
    }
}

test();
