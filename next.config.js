/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        nodemailer: false,
        zlib: false,
        https: false,
        http: false,
        path: false,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        os: false,
        tls: false,
        querystring: false,
       };
 
     config.plugins.push(
       new webpack.IgnorePlugin({
         checkResource(resource, context) {
           // If I am including something from my backend directory, I am sure that this shouldn't be included in my frontend bundle
           if (resource.includes('/app/api/') && !context.includes('node_modules')) {
             return true;
           }
           return false;
         },
       }),
     );
    }
    

    return config;
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  },
  experimental: {
    serverComponentsExternalPackages: ['@tremor/react']
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
