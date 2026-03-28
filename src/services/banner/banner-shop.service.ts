import bannerService from "./banner.service";

export const fetchShopBanners = async () => {
  return bannerService.fetchBannersForPosition("shop");
};

export default {
  fetchShopBanners,
};

