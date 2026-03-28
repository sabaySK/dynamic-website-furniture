import bannerService from "./banner.service";

export const fetchContactBanners = async () => {
  return bannerService.fetchBannersForPosition("contact");
};

export default {
  fetchContactBanners,
};

