import path from 'path'

/**
 * @type {import('vite').UserConfig}
 */
const config = {
    resolve: {
        alias: {
            'filing': path.join(__dirname, "../../dist/esm"),
        }
    }
}
export default config;