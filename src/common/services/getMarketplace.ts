import { MARKETPLACES } from "src/common/config";

export const getMarketplace = (mart: string) => {
    let result = MARKETPLACES.magiceden
    if (mart) {
        if (mart.toLowerCase().includes(`magic`)) {
            result = MARKETPLACES.magiceden
        }

        if (mart.toLowerCase().includes(`me`)) {
            result = `/images/icons/magiceden.png`;
        }

        if (mart.toLowerCase().includes(`port`)) {
            result = MARKETPLACES.solport
        }

        if (mart.toLowerCase().includes(`art`)) {
            result = MARKETPLACES.solanart
        }

        if (mart.toLowerCase().includes(`open`)) {
            result = MARKETPLACES.opensea
        }

        if (mart.toLowerCase().includes(`coral`)) {
            result = MARKETPLACES.coralcube
        }
    }
    return result;
}

export const getMarketplaceImage = (mart: string) => {
    let result = ``;
    if (mart) {
        if (mart.toLowerCase().includes(`magic`)) {
            result = `/images/icons/magiceden.png`;
        }

        if (mart.toLowerCase().includes(`me`)) {
            result = `/images/icons/magiceden.png`;
        }

        if (mart.toLowerCase().includes(`port`)) {
            result = `/images/icons/solport.svg`;
        }

        if (mart.toLowerCase().includes(`art`)) {
            result = `/images/icons/solanart.svg`;
        }

        if (mart.toLowerCase().includes(`open`)) {
            result = `/images/icons/opensea.svg`;
        }

        if (mart.toLowerCase().includes(`coral`)) {
            result = `/images/icons/coralcube.svg`;
        }
    }
    return result;
}