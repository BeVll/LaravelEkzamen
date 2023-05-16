const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/categories",
    "/bot",
];

module.exports = function (app:any) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://bevl.com/api',
        secure: false
    });

    app.use(appProxy);
};
