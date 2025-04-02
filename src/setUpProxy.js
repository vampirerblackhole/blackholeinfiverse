import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    '/proxy',
    createProxyMiddleware({
      target: 'https://storage.cloud.google.com',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': '', // Remove '/proxy' from the path
      },
    })
  );
};
