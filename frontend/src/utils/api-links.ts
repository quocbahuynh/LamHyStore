// const authUrl = 'https://quochuynhwebsite.website';
const authUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://quochuynhwebsite.website";
const domain =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://www.lamhystore.com";
const apiLinks = {
  domain: {
    domain: `${domain}`,
  },

  social: {
    facebook: "https://www.facebook.com/lamhy.store",
    instagam: "https://www.instagram.com/lamhy.store",
    zalo: "https://zalo.me/0789126368",
  },

  homepage: {
    menu: `${authUrl}/api/page/menu-all`,
    bestseller: `${authUrl}/api/page/bestseller-all`,
    branding: `${authUrl}/api/page/branding-all`,
    sections: `${authUrl}/api/page/sections-all`,
    banners: `${authUrl}/api/page/banner-all`,
    productGroup: `${authUrl}/api/section/getSlug`,
    product: `${authUrl}/api/product/id`,
    searchProduct: `${authUrl}/api/product/search`,
    productsByCategory: `${authUrl}/api/product/category`,
    banner: `${authUrl}/api/homepage/banner-photo`,
  },
  livestream: {
    products: `${authUrl}/api/livestream/products`,
    info: `${authUrl}/api/homepage/display`,
    productPinId: `${authUrl}/api/livestream/id`,
    livestreamList: `${authUrl}/api/livestream`,
    addNewLiveStream: `${authUrl}/api/livestream`,
    liveById: `${authUrl}/api/livestream/id`,
    liveBySlug: `${authUrl}/api/livestream/slug`,
    updateById: `${authUrl}/api/livestream`,
    deleteById: `${authUrl}/api/livestream/id`,
  },

  authentication: {
    register: `${authUrl}/api/authentication/register`,
    login: `${authUrl}/api/authentication/login`,
    profile: `${authUrl}/api/authentication/profile`,
    orders: `${authUrl}/api/authentication/order-history`,
    delete: `${authUrl}/api/authentication/delete-staff`,
    checkaccount: `${authUrl}/api/authentication/check-account`,
    updateaccount: `${authUrl}/api/authentication/update-password`,
  },

  admin: {
    sectionUpdatePosition: `${authUrl}/api/section/update-positions`,
    pageUpdatePosition: `${authUrl}/api/page/update-positions`,
    pageAdd: `${authUrl}/api/page/add`,
    menuDelete: `${authUrl}/api/page/delete`,
    subMenuAdd: `${authUrl}/api/section/add-menu`,
    sectionBestSellerUpdated: `${authUrl}/api/section/update-bestseller`,
    sectionBestSellerAdd: `${authUrl}/api/section/add-bestseller`,
    sectionBrandingUpdated: `${authUrl}/api/section/update-branding`,
    sectionBrandingAdd: `${authUrl}/api/section/add-branding`,
    sectionUpdated: `${authUrl}/api/section/update`,
    sectionGetList: `${authUrl}/api/page/sections-all`,
    sectionDeleted: `${authUrl}/api/section/remove`,
    login: `${authUrl}/api/authentication/loginForStaffOrAdmin`,
    bannerAdd: `${authUrl}/api/section/add-banner`,
    bannerGetList: `${authUrl}/api/page/banner-all`,
    bannerUpdate: `${authUrl}/api/homepage/banner-photo`,
    staffList: `${authUrl}/api/authentication/staff-admin`,
  },

  product: {
    getListIds: `${authUrl}/api/product/list-ids?`,
    productDetail: `${authUrl}/api/product/id`,
    search: `${authUrl}/api/product/search`,
    categories: `${authUrl}/api/product/categories`,
    categoryId: `${authUrl}/api/product/category`,
  },

  order: {
    addOrderToSheet: `${authUrl}/api/gom-order/add-order-to-sheet?id=`,
    createOrderCOD: `${authUrl}/api/order/create-oder-cod`,
    createOrderVNPAY: `${authUrl}/api/order/create-order`,
    gomOrderGetAll: `${authUrl}/api/gom-order`,
    gomOrderById: `${authUrl}/api/gom-order`,
    gomOrderBySlug: `${authUrl}/api/gom-order/slug`,
    createGomOrder: `${authUrl}/api/gom-order`,
    deleteById: `${authUrl}/api/gom-order`,
    updateById: `${authUrl}/api/gom-order`,
  },

  section: {
    addSectionList: `${authUrl}/api/Section/AddSectionList`,
    addSection: `${authUrl}/api/Section/AddSection`,
    getFull: `${authUrl}/api/Section/GetFullSectionLists`,
    getSectionListDetail: `${authUrl}/api/Section/GetSectionListDetail`,
    getSectionDetail: `${authUrl}/api/Section/GetSectionById`,
    getSectionDetailBySlug: `${authUrl}/api/Section/GetSectionBySlug`,
    updateSection: `${authUrl}/api/Section/UpdateSection`,
    updateSectionList: `${authUrl}/api/Section/UpdateSectionList`,
    deleteSectionList: `${authUrl}/api/Section/DeleteSectionList`,
    deleteSection: `${authUrl}/api/Section/DeleteSection`,
  },

  menu: {
    createMenu: `${authUrl}/api/homepage/menu`,
    getList: `${authUrl}/api/homepage/menu`,
    deleteMenu: `${authUrl}/api/homepage/menu/id`,
    getMenuDetail: `${authUrl}/api/homepage/menu`,
    addItemToMenu: `${authUrl}/api/homepage/menu/add/menu-item`,
    deleteMenuItem: `${authUrl}/api/homepage/menu-item/id`,
    updateMenu: `${authUrl}/api/homepage/menu/id`,
  },

  staff: {
    listStaff: `${authUrl}/api/authentication/staff-admin`,
    createStaff: `${authUrl}/api/authentication/register`,
    deleteStaffById: `${authUrl}/api/authentication/delete-staff`,
  },

  branches: {
    getFull: `${authUrl}/api/homepage/branches`,
  },
};

export default apiLinks;
