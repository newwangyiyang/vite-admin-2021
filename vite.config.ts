import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import viteSvgIcons from 'vite-plugin-svg-icons';
import { loadEnv } from './src/utils/viteBuild';

const pathResolve = (dir: string) => {
  return resolve(__dirname, ',', dir);
};
const { VITE_OPEN, VITE_PORT, VITE_PUBLIC_PATH, VITE_API_URL } = loadEnv();
// 定义别名
const alias: Record<string, string> = {
  '@': pathResolve('/src'),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSvgIcons({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/icons/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[name]',
    }),
  ],
  root: process.cwd(),
  resolve: {
    alias,
  },
  base: VITE_PUBLIC_PATH,
  server: {
    host: '0.0.0.0',
    port: VITE_PORT,
    open: VITE_OPEN,
    proxy: {
      [VITE_API_URL]: {
        target: `https://e.juejin.cn/`,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^\\${VITE_API_URL}`), ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
  },
});
