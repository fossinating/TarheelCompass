/** @type {import('next').NextConfig} */
const nodeExternals = require('webpack-node-externals');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})


const nextConfig = {
  webpack: (config, { isServer, webpack, nextRuntime }) => {
    console.log(isServer, ", ", nextRuntime, nextRuntime === "edge")
    if (nextRuntime !== "nodejs") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        request: false,
        zlib: false,
        https: false,
        http: false,
        path: false,
        child_process: false,
        os: false,
        querystring: false,
        crypto: false
      };
    }
    if (nextRuntime === "edge") {

      /*config.externals.push({
        "fs": "fs",
        "path": "path",
        "crypto": "crypto",
        "http": "http",
        "https": "https",
        "zlib": "zlib",
        "net": "net",
        "dns": "dns",
        "child_process": "child_process",
        "os": "os",
        "tls": "tls",
      })*/
    }
    if (typeof nextRuntime === "undefined") {
      /*config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };*/ 

      //config.plugins.push(new webpack.IgnorePlugin(/^(elastic-apm-node|bunyan)$/));
      /*config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^fs$/ }));
      config.plugins.push(
        new webpack.IgnorePlugin({
          checkResource(resource, context) {
            // If I am including something from my backend directory, I am sure that this shouldn't be included in my frontend bundle
            if ((resource.includes('/api/') || resource.includes("/backend_lib/")) && !context.includes('node_modules')) {
              return true;
            }
            return false;
          },
        }),
      );*/
    }
    

    return config;
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@tremor/react']
  },
  reactStrictMode: true,
};
//console.log('Custom Webpack Configuration Applied:', nextConfig);

module.exports = nextConfig;
