const API_URL = `https://snapshot-toolkit-backend.herokuapp.com/api/`;
// const API_URL = `https://api.snapshots-toolkit.com/`;
// const API_URL = `http://127.0.0.1:5050/api/`;
export type menuProps = {
    id: number
    menu: string,
    url: string,
    title: string,
}[];
export const MENU: menuProps = [
    {
        id: 0,
        menu: `Home`,
        url: `home`,
        title: 'Homepage',
    },
    {
        id: 1,
        menu: `Market`,
        url: `market`, //coming
        title: 'Market'
    },
    {
        id: 2,
        menu: `NFTs`,
        url: `tracker/nfts`, //`tracker/nfts`,
        title: 'NFT Tracker'
    },
    {
        id: 3,
        menu: `Tokens`,
        url: `coming`,
        title: 'TOKEN Tracker'
    },

    {
        id: 4,
        menu: `Calendar`,
        url: `coming`,
        title: 'Calendar Tracker'
    },
    {
        id: 5,
        menu: `Profile`,
        url: `profile`,
        title: 'Profile'
    },
    {
        id: 6,
        menu: `Admin`,
        url: `admin`,
        title: 'Admin'
    },
];

export const CLOUD_FLARE_URI = 'https://snapshot-toolkit.guardian02262.workers.dev?u=';
export const CORS_PROXY_SERVER = `https://corserrormodified.herokuapp.com`;

export const DATA_API = {
    GET_COLLECTIONS: `${API_URL}collection`,
    GET_TOP_TRENDS: `${API_URL}collection/getTopTrends`,
    TEST_API: `${API_URL}collection/test`,
    GET_COLLECTION_DETAIL: {
        COMMON: `${API_URL}collection`,
        DETAIL: `/detail/detail`,
        CHART: `/detail/chart`,
        LIST: `/detail/list`,
        LOWEST: `/detail/lowest`,
        LAST: `/detail/last`,
        MOVER: `/topMovers`,
        UPCOMING: `/upcoming`,
        COLLECTIONS: `/newCollecions`,

        SNIPER_ACTS_URL: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/hourly`,
        SNIPER_METRICS_URL: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/metrics` //https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/metrics?collection=primates
    },

    SIGN_IN: `https://snapshot-toolkit-backend.herokuapp.com/api/user/signin`,
    SIGN_OUT: `https://snapshot-toolkit-backend.herokuapp.com/api/user/signout`,
    GET_USER_INFO: `${API_URL}user/me`,

    TRACK_NFTS: {
        FETCH_TRACKS: `${API_URL}nft`,
        REGIST_TRACKS: `${API_URL}nft`,
        DELETE_TRACKS: `${API_URL}nft`,
    },

    MARKET_HYPE: {
        COMMON: `${API_URL}hype`,
        HYPER_DATA: `/getHypeData`,
        TICKERS: `/getTickers`,
        HIGHEST: `/getHighest`,
        LOWEST: `/getLowest`
    },

    SNIPER_API: {
        COMMON: `${API_URL}sniper`,
        PERCENT_CHANGE: `/percentChange`,
        ACTIVITIES: `/activities`,
        LAST_SOLD_ACTIVITY: `/lastSoldActivities`,
        INSERT_STATE: `/insertState`,
    },

    TOKEN_API: {
        COMMON: `${API_URL}token`,
        GET_NEW_TOKENS: `/getNewTokens`
    },

    LAUNCHPAD_API: {
        COMMON: `${API_URL}launchpad`,
        ADD_LAUNCHPAD: `/addLaunchpad`,
        GET_LAUNCHPAD: `/getLaunchpad`,
        DELETE_LAUNCHPAD: `/deleteLaunchpad`
    },

    WALLET_API: {
        COMMON: `${API_URL}wallet`,
        CHECK_ADMIN: `/checkAdmin`,
        GET_USER_WALLETS: `/getUserWallet`,
        ADD_USER_WALLET: `/addUserWallet`,
        VERIFY_USER_WALLET: `/verifyUserWallet`,
        DELETE_USER_WALLET: `/deleteUserWallet`,
        GET_WALLETS: `/getWallets`,
        ADD_WALLET: `/addWallet`,
        DELETE_WALLET: `/deleteWallet`
    },

    WHITEWALLET_API: {
        COMMON: `${API_URL}whitewallet`,
        GET_WALLETS: `/getWallets`,
        ADD_WALLET: `/addWallet`,
        DELETE_WALLET: `/deleteWallet`
    },

    WHITENFT_API: {
        COMMON: `${API_URL}whitenft`,
        GET_NFTS: `/getNfts`,
        ADD_NFT: `/addNft`,
        DELETE_NFT: `/deleteNft`
    },
}

export const DISCORD_AVATAR_URL = `https://cdn.discordapp.com/avatars`;
export const HYPERSPACE_UPCOMING_URL = `https://hyperspace.xyz/upcoming/collection`;

export const SNIPER_API = {
    PERCENT_CHANGE: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v2/percentChange`,
    COLLECTIONS: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/collections`,
    ACTIVITIES: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v2/activities`,
    LAST_SOLD_ACTIVITY: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/lastSoldActivities`,
    ACTIVITIES_PER_COLLECTION: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v2/activities`, //https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v2/activities?symbol=susanoo
    NFTS_PER_COLLECTION: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/shop`, // https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/shop?collection=susanoo&limit=20&sort=lth,
    COLLECTION_DETAIL: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/collectionDetail`, //https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/collectionDetail?collection=susanoo
    COLLECTION_STATE: `https://jpn698dhc9.execute-api.us-east-1.amazonaws.com/prod/v1/onChainStats?collection=` //https://api-mainnet.magiceden.io/collections/art_of_mob?edge_cache=true
}

export const MARKETPLACES = {
    magiceden: `https://magiceden.io/item-details/`,
    opensea: `https://opensea.io/assets/solana/`,
    solanart: `https://solanart.io/nft/`,
    solport: `https://solport.io/nft/`,
    coralcube: `https://coralcube.io/detail/`
}

export const CALENDAR = {
    weekDays: [
        `Monday`,
        `Tuesday`,
        `Wednesday`,
        `Thursday`,
        `Friday`,
        `Saturday`,
        `Sunday`
    ],
    weeksCount: 5
}

export const TIME_RANGE = 10000;
export const LIMIT_COLUMNS = 15;
export const LIMIT_PAGE_SIZE = 50;
export const TIME_INTERVAL = 2000;
export const TIME_INCREASE = 0.0000000001;

export const COLLECTION_ANALYSTIC_PERIOD = {
    ALL: 0,
    DAY: 24,
    WEEK: 7,
    MONTH: 30,
    HOUR: 60
}

export const MARKET_ANALYSTIC_PERIOD = {
    ALL: 0,
    MONTH: 30,
    WEEK: 7,
    DAY: 24,
    HOUR: 60,
}

export const TICKER_TYPE = {
    SALE: `sale`,
    LISTINGS: `listing`,
    UNLISTINGS: `delisting`,
}

export const ACTION_TYPE = {
    SALE: `execute_sale`,
    LISTING: `listing`,
    CANCEL_LISTING: `cancel_listing`,
    MINT: `mint`
}

export const SNIPER_ACTION_TYPE = {
    SALE: `execute_sale`,
    LISTING: `listing`,
    CANCEL_LISTING: `cancel_listing`,
    MINT: `mint`
}

export enum TrendsField {
    LIST = `list`,
    FLOOR = `floor`,
    VOLUME = `volume`
}

export const LAUNCHPAD_CONFIG = {
    NET_ERROR: -99,
    DB_ERROR: -98,
    NO_ADMIN_WALLET: -1,
    DUPLICATED_COLLECTION: 0,
    SUCCESS: 1
}

export const SIGN_KEY = 'SnapshotsToolkit';