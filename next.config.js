module.exports = {
  webpack5: true,
  mocha: {
    enableTimeouts: false,
    before_timeout: 320000
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    HEROKU_BASE_URL: process.env.HEROKU_BASE_URL,
    RINKEBY_API_KEY: process.env.RINKEBY_API_KEY,
    RINKEBY_NODE_URL: process.env.RINKEBY_NODE_URL
  },
  
};
