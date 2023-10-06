// import .env variables
require('dotenv').config();

module.exports = {
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  encryptionKey: process.env.ENCRYPTION_KEY,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  frontEncSecret: process.env.FRONT_ENC_SECRET,
  ipfsBaseUrl: process.env.IPFS_BASE_URL,
  ipfsConfig: {
    host: process.env.IPFS_HOST,
    port: process.env.IPFS_PORT,
    protocol: process.env.IPFS_PROTOCOL,
    headers: {
      authorization: 'Basic ' + Buffer.from(process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_API_KEY).toString('base64')
    }
  },
  adminUrl: process.env.ADMIN_URL,
  emailAdd: process.env.EMAIL,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  mailgunPrivateKey: process.env.MAILGUN_PRIVATE_KEY,
  bnbProviderAddress: process.env.BNB_PROVIDER_ADDRESS,
  ethProviderAddress: process.env.ETHEREUM_PROVIDER_ADDRESS,
  mailgunDomain: process.env.MAILGUN_DOMAIN,

  USDtoBNBLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=USD&convert=BNB',
  USDtoMYNTLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=USD&convert=NRG',
  BNBtoUSDLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=BNB&convert=USD',
  WBNBtoUSDLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=WBNB&convert=USD',
  MYNTtoUSDLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=NRG&convert=USD',
  WBNBtoBNBLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=WBNB&convert=BNB',
  MYNTtoBNBLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=NRG&convert=BNB',
  BNBtoWBNBLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=BNB&convert=WBNB',
  USDtoETHLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=USD&convert=ETH',
  ETHtoUSDLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=ETH&convert=USD',
  WETHtoUSDLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=WETH&convert=USD',
  WETHtoETHLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=WETH&convert=ETH',
  ETHtoWETHLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=ETH&convert=WETH',
  MYNTtoETHLink: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=NRG&convert=ETH',
  priceConversionHeaders: {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY,
    }
  },

  appName: process.env.APP_NAME,
  myntistContractAddressBNB: process.env.NFT_CONTRACT_ADDRESS,
  myntContractAddressBNB: process.env.MYNT_CONTRACT_ADDRESS,
  myntistERC721BNB: process.env.BNB_CONTRACT_ADDRESS_721,
  myntistERC1155BNB: process.env.BNB_CONTRACT_ADDRESS_1155,

  myntistContractAddressETH: process.env.ETH_CONTRACT_ADDRESS,
  myntistERC721AddressETH: process.env.ETH_CONTRACT_ADDRESS_721,
  myntistERC1155AddressETH: process.env.ETH_CONTRACT_ADDRESS_1155,

  fundraiserMarketplace: process.env.FUNDRAISER_MARKETPLACE_CONTRACT_ADDRESS,
  fundraiserMintCaller: process.env.FUNDRAISER_MINT_CALLER_ADDRESS,

  baseUrl: process.env.BASE_URL,
  frontBaseUrl: process.env.FRONT_BASE_URL,
  walletAccount: process.env.WALLET_ACCOUNT,
  walletPK: process.env.WALLET_PRIVATE_KEY,
  tokenNameToValue: {
    'MYNT': 1,
    'WBNB': 2,
    'WETH': 2
  },
  extendAuctionTimeBy: 10, // in minutes
  adminPasswordKey: process.env.ADMIN_PASSWORD_KEY,
  paypalMode: process.env.PAYPAL_MODE,
  supportedTypes: ['ai', 'bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'ps', 'psd', 'svg', 'tif', 'tiff', 'mp3', 'ogg', 'wav', 'arj', '7z',
    'deb', 'pkg', 'rar', 'rpm', 'tar.gz', 'gz', 'z', 'zip', 'bin', 'dmg', 'iso', 'toast', 'vcd', 'csv', 'dat', 'db', 'dbf', 'log', 'mdb', 'sav', 'sql', 'tar', 'xml', 'email', 'eml',
    'emlx', 'msg', 'oft', 'ost', 'pst', 'vcf', 'apk', 'bat', 'com', 'exe', 'gadget', 'jar', 'msi', 'wsf', 'key', 'odp', 'pps', 'ppt', 'pptx',
    'asp', 'aspx', 'cer', 'crt', 'cfm', 'css', 'html', 'htm', 'js', 'jsp', 'part', 'php', 'rss', 'xhtml', 'key', 'odp', 'pps', 'ppt', 'pptx', 'fnt', 'fon', 'otf', 'ttf',
    'c', 'cgi', 'pl', 'class', 'cpp', 'cs', 'h', 'java', 'py', 'sh', 'swift', 'vb', 'ods', 'xls', 'xlsm', 'xlsx', 'bak', 'cab', 'cfg', 'cpl', 'cur', 'dll',
    'dmp', 'drv', 'icns', 'ini', 'lnk', 'sys', 'tmp', '3g2', '3gp', 'm4v', 'mkv', 'mov', 'mp4',
    'doc', 'docx', 'odt', 'pdf', 'rtf', 'tex', 'txt', 'wpd'],
  // compress images API key
  tinifyAPIKey: process.env.TINIFY_API_KEY,
  // static assets CDN links
  nftImgPlaceholder: `${process.env.CDN_BASE_URL}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`,
  colLogoPlaceholder: `${process.env.CDN_BASE_URL}v1652166289/hex-nft/assets/logo-placeholder_jsvyst.jpg`,
  colFeaturedPlaceholder: `${process.env.CDN_BASE_URL}v1652166289/hex-nft/assets/feature-placeholder_xqd6qk.svg`,
  userDefaultImage: `${process.env.CDN_BASE_URL}v1652166289/hex-nft/assets/image-placeholder_qva6dx.png`,
  categoryDefaultImage: `${process.env.CDN_BASE_URL}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`,
  gamificationPlaceholder: `${process.env.CDN_BASE_URL}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`,

  fundraiserNFT: {
    name: `${process.env.APP_NAME} Founder Series NFT`,
    image: `${process.env.CDN_BASE_URL}v1657101680/hex-nft/assets/fundraiser-nfts/fundraiser-nft-1_qgwfgl.png`,
    description: 'Founder series NFT release is to cultivate an initial community of high quality early access founders to act as an initial community for Myntist',
    totalQuantity: 2222
  },

  myntMaxDecimals: 100000000,
  BToMB: 0.000001, // 1 Byte (B) = 0.000001 Megabytes (MB) 
  fileSizeLimit: 100, // file size can be upto 100 MB only

  blockChains: [
    {
      chainName: 'Binance SmartChain Testnet',
      symbol: 'BNB',
      chainId: 97,
      chainIdHex: "0x61",
      myntistContractAddress: process.env.NFT_CONTRACT_ADDRESS,
      myntistERC721Address: process.env.BNB_CONTRACT_ADDRESS_721,
      myntistERC1155Address: process.env.BNB_CONTRACT_ADDRESS_1155,
      providerAddress: process.env.BNB_PROVIDER_ADDRESS
    },
    {
      chainName: 'Goerli',
      symbol: 'ETH',
      chainId: 5,
      chainIdHex: "0x5",
      myntistContractAddress: process.env.ETH_CONTRACT_ADDRESS,
      myntistERC721Address: process.env.ETH_CONTRACT_ADDRESS_721,
      myntistERC1155Address: process.env.ETH_CONTRACT_ADDRESS_1155,
      providerAddress: process.env.ETHEREUM_PROVIDER_ADDRESS
    }
  ],

  gamificationNFTMediaTypes: [
    {
      name: "images",
      mediaType: 1,
      types: ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'svg'],
    },
    {
      name: "videos",
      mediaType: 14,
      types: ['3g2', '3gp', 'm4v', 'mkv', 'mov', 'mp4'],
    },
  ],

  notifications: [
    {
      type: 1,
      name: 'feedback'
    },
    {
      type: 2,
      name: 'bid-placed'
    },
    {
      type: 3,
      name: 'offer-placed'
    },
    {
      type: 4,
      name: 'bid-accepted'
    },
    {
      type: 5,
      name: 'offer-accepted'
    },
    {
      type: 6,
      name: 'buy-nft'
    },
    {
      type: 7,
      name: 'report-response'
    },
    {
      type: 8,
      name: 'nft-reports-admin',
    },
    {
      type: 9,
      name: 'contact-us-admin',
    }
  ],

  openAIBaseUrls: {
    url: 'https://staging-nft.myntist.com/users/',
    imageUrl: 'https://staging-nft.myntist.com/image/',
  }
}
