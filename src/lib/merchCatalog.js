/**
 * Merch catalog. The public site never talks to Stripe.
 * Alan owns the account. A buy button appears only when checkout
 * is released AND the product has an https://buy.stripe.com or
 * https://checkout.stripe.com payment link.
 */

const STRIPE_CHECKOUT_HOSTS = new Set(["buy.stripe.com", "checkout.stripe.com"]);

/**
 * @param {unknown} url
 */
export function isStripePaymentUrl(url) {
  if (typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" && STRIPE_CHECKOUT_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * @param {{ holdCheckout?: boolean } | null | undefined} catalog
 * @param {{ paymentUrl?: string } | null | undefined} product
 */
export function merchIsPurchasable(catalog, product) {
  if (catalog?.holdCheckout !== false) return false;
  return isStripePaymentUrl(product?.paymentUrl);
}

/**
 * @param {number | null | undefined} priceCents
 */
export function formatMerchPrice(priceCents) {
  if (typeof priceCents !== "number" || !Number.isFinite(priceCents)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceCents / 100);
}
