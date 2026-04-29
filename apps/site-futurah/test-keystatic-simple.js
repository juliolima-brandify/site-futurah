const { createReader } = require('@keystatic/core/reader');
const path = require('path');
const fs = require('fs');

// Mock a minimal config if we can't import the real one easily
// But we want the REAL one to see how it's configured.
// Since it's TS, we can try to read it as text and extract what we need or just use it if node-register is available.
// In this environment, let's just use the reader with the raw path.

async function test() {
    try {
        const config = {
            storage: { kind: 'local' },
            collections: {
                posts: {
                    path: 'content/posts/*',
                    format: { contentField: 'content' },
                    schema: {}, // Schema doesn't matter for reading raw if we know the field
                }
            }
        };
        const reader = createReader(process.cwd(), config);
        const post = await reader.collections.posts.read('ola-mundo-da-ia');
        if (post) {
            console.log('Post found!');
            if (post.content) {
                const content = await post.content();
                console.log('Content type:', typeof content);
                console.log('Content structure:', JSON.stringify(content).substring(0, 200));
            }
        } else {
            console.log('Post NOT found');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
