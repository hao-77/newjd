import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import type { IncomingMessage } from 'node:http'

/** 前端 SPA 路由（与后端 API 路径冲突时，浏览器访问应返回 index.html） */
const SPA_ONLY_PATHS = new Set(['/admin', '/admin/users', '/complaint'])

function spaHtmlBypass(req: IncomingMessage) {
  const accept = req.headers.accept || ''
  if (!accept.includes('text/html')) return undefined

  const path = (req.url || '').split('?')[0]
  if (SPA_ONLY_PATHS.has(path)) {
    return '/index.html'
  }
  return undefined
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://8.134.98.200:10010'

  const proxyCommon = { target: apiTarget, changeOrigin: true }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': proxyCommon,
        '/user': proxyCommon,
        '/ai': proxyCommon,
        '/session': proxyCommon,
        '/admin': {
          ...proxyCommon,
          bypass: spaHtmlBypass,
        },
        '/complaint': {
          ...proxyCommon,
          bypass: spaHtmlBypass,
        },
      },
    },
  }
})
