import bannerService from "./banner.service";

export const fetchHomeBanners = async () => {
  return bannerService.fetchBannersForPosition("home");
};

export default {
  fetchHomeBanners,
};

