import bannerService from "./banner.service";

export const fetchAboutBanners = async () => {
  return bannerService.fetchBannersForPosition("about");
};

export default {
  fetchAboutBanners,
};

