import { useEffect, useState } from "react";
import { api } from "./api";
import { MOCK_PRODUCTS, TESTIMONIALS } from "../mock";

export function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/products", { params: category ? { category } : {} })
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          let filtered = MOCK_PRODUCTS;
          if (category) {
            filtered = MOCK_PRODUCTS.filter(p => p.category === category);
          }
          setProducts(filtered);
          setError(null);
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { products, loading, error };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then((res) => !cancelled && setProduct(res.data))
      .catch(() => {
        if (!cancelled) {
          const mockProduct = MOCK_PRODUCTS.find(p => p.slug === slug);
          if (mockProduct) {
            setProduct(mockProduct);
            setError(null);
          } else {
            setError(new Error("Product not found"));
          }
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, error };
}

export function useTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    api
      .get("/testimonials")
      .then((r) => !cancelled && setItems(r.data))
      .catch(() => !cancelled && setItems(TESTIMONIALS))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);
  return { items, loading };
}

export async function startCheckout(productIds) {
  const res = await api.post("/checkout", { product_ids: productIds });
  return res.data;
}

export async function startBinanceCheckout(productIds) {
  const res = await api.post("/payments/binance/create-order", { product_ids: productIds });
  return res.data;
}
