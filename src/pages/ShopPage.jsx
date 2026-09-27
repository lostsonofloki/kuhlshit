import { Link } from "react-router-dom";
import SmartImage from "../components/SmartImage";
import SEO from "../components/SEO";
import { SHOP_SEO } from "../constants/seoDefaults";
import catalog from "../data/merch.json";
import { formatMerchPrice, merchIsPurchasable } from "../lib/merchCatalog";
import "./ShopPage.css";

/** Not mounted in App.jsx until Alan's Stripe account exists. Do not add a /shop route before then. */

export default function ShopPage() {
  const products = Array.isArray(catalog.products) ? catalog.products : [];
  const checkoutHeld = catalog.holdCheckout !== false;

  return (
    <>
      <SEO {...SHOP_SEO} />
      <div className="shop-page">
        <div className="page-header">
          <h1>Shop</h1>
          <p>
            {checkoutHeld
              ? "Shirts and albums will sell here. Checkout is off until Alan's Stripe account is ready."
              : "Shirts and albums from kuhlshit.com."}
          </p>
        </div>

        {products.length > 0 ? (
          <ul className="shop-grid">
            {products.map((product) => {
              const forSale = merchIsPurchasable(catalog, product);
              const price = formatMerchPrice(product.priceCents);
              return (
                <li key={product.id} className="shop-card">
                  <SmartImage
                    src={product.imageUrl}
                    alt={product.imageAlt || product.name}
                    width="640"
                    height="640"
                    className="shop-card-image"
                  />
                  <div className="shop-card-body">
                    <h2>{product.name}</h2>
                    {price ? <p className="shop-price">{price}</p> : null}
                    {product.summary ? <p>{product.summary}</p> : null}
                    {forSale ? (
                      <a
                        className="btn btn-primary"
                        href={product.paymentUrl}
                        rel="noopener noreferrer"
                      >
                        Buy
                      </a>
                    ) : (
                      <p className="shop-hold">Not for sale yet</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="shop-empty">Nothing is listed yet.</p>
        )}

        <div className="back-link-container">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
