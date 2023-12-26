import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server : {
        // port : 3004 ,
        proxy : {
            target: 'http://93.188.164.69:8081/api', // Replace with your backend server URL
            
        }
    }
});
