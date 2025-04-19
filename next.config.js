/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 重複したAPIエンドポイントの問題を解決するための設定
  async rewrites() {
    return [
      {
        source: '/api/security-events',
        destination: '/api/security-events.ts',
      },
      {
        source: '/api/alerts',
        destination: '/api/alerts.ts',
      },
      // 二重APIパスのリダイレクト
      {
        source: '/api/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
