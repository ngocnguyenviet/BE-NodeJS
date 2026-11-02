import { app } from './app.js';

const port = 3000;

app.listen(port, '127.0.0.1', (error) => {
    if (error) {
        console.error('HTTP server failed:', error);
        process.exitCode = 1;
        return;
    }
    console.log(`Blue Moon API listening at http://127.0.0.1:${port}`);
});
