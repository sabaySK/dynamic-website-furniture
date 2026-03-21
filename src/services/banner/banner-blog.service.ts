import bannerService from "./banner.service";

export const fetchBlogBanners = async () => {
  return bannerService.fetchBannersForPosition("blog");
};

export default {
  fetchBlogBanners,
};

