import path from 'path';

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      cesium: path.resolve(__dirname, 'node_modules/cesium'),
    };

    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      include: path.resolve(__dirname, 'node_modules/cesium'),
      use: [
        {
          loader: 'strip-pragma-loader',
          options: {
            pragmas: {
              debug: false,
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
