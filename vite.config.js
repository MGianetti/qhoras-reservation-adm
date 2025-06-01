import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';
import { lingui } from '@lingui/vite-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [
        react({
            plugins: [['@lingui/swc-plugin', {}]]
        }),
        lingui()
    ],
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src/')
        }
    }
});
