export const usePhotoProduct = (product: any) => {
  const productImages = product?.images ?? product?.Images ?? null;
  return !productImages || productImages.length === 0
    ? "/assets/images/product_default.png"
    : productImages[0];
};
