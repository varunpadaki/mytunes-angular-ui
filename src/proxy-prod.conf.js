const PROXY_CONFIG = [
    {
        context: [
            "/authmanagement",
            "/usermanagement",
            "/storemanagement",
            "/dashboardmanagement"
        ],
        target: "http://34.120.129.169",
        secure: false,
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;