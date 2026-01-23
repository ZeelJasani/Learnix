/** @type {import('next').NextConfig} */
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all hostnames
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // CORS headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },

  webpack: (config, { isServer, webpack }) => {
    // Add Prisma plugin only for server-side builds
    if (isServer) {
      try {
        config.plugins = [...config.plugins, new PrismaPlugin()]
      } catch (e) {
        console.warn('PrismaPlugin could not be added:', e?.message ?? e)
      }
    }

    // Prevent Next/webpack from scanning system directories on Windows
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/Application Data/**',
        '**/AppData/**',
        '**/Local Settings/**',
        '**/Cookies/**',
        '**/History/**',
        '**/Temporary Internet Files/**',
        '**/Windows/**',
        '**/System32/**',
        '**/Program Files/**',
        '**/Program Files (x86)**',
        '**/ProgramData/**',
        '**/Users/**',
        '**/C:/Users/**',
        '**/C:/Windows/**',
        '**/C:/Program Files/**',
        '**/C:/ProgramData/**'
      ]
    }

    // Provide safe fallbacks for Node built-ins in the browser bundle
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }

    // Fix for FlightClientEntryPlugin error - provide aliases for JSX runtimes on client
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          // Map package-relative paths that Next may request (with .js) to the exported modules
          'react/jsx-runtime.js': 'react/jsx-runtime',
          'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
          'react/jsx-runtime': 'react/jsx-runtime',
          'react/jsx-dev-runtime': 'react/jsx-dev-runtime'
        }
      }
    }

    // Keep plugins as-is to allow Next to generate required build artifacts

    return config
  },

  // Performance optimizations
  reactStrictMode: true,
  
  // Build optimizations
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Server external packages
  serverExternalPackages: ['@react-email/render', '@react-email/components', 'resend'],

  // Experimental features to fix build issues
  experimental: {
    optimizePackageImports: ['@prisma/client'],
    webpackBuildWorker: false
  },

  // Output configuration
  output: 'standalone',

  // Additional build optimizations
};

export default nextConfig;
