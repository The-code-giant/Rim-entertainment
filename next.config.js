module.exports = {
  mocha: {
    enableTimeouts: false,
    before_timeout: 320000,
  },
  webpack5: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    STRAPI_LOCAL_BASE_URL: process.env.STRAPI_LOCAL_BASE_URL,
    HEROKU_BASE_URL: process.env.HEROKU_BASE_URL,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    RINKEBY_API_KEY: process.env.RINKEBY_API_KEY,
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    RINKEBY_NODE_URL: process.env.RINKEBY_NODE_URL,
    RINKEBY_NODE_URL_WSS: process.env.RINKEBY_NODE_URL_WSS,
    INFURA_KEY: process.env.INFURA_KEY,
    INFURA_NODE_URL: process.INFURA_NODE_URL,
    METAMASK_MNEMONIC: process.env.METAMASK_MNEMONIC,
    OWNER_ADDRESS: process.env.OWNER_ADDRESS,
    RINKEBY_PROXY_ADDRESS: process.env.RINKEBY_PROXY_ADDRESS,
    MAIN_NET_PROXY_ADDRESS: process.env.MAIN_NET_PROXY_ADDRESS,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY,
    PINTA_JWT: process.env.PINTA_JWT,
  },
};
