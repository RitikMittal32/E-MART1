import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "../config/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import ReviewComponent from "../components/Form/ReviewForm";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState();
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      setLoading(false);
      setProductId(data?.product._id);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid p-0 sm:mt-[135px]">
        <div className="row product-details mb-4">
          <div className="col-md-6 primage">
            <img
              src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${product._id}`}
              className="h-48 w-48 object-contain"
              alt={product.name}
            />
          </div>
          <div className="col-md-6 product-details-info">
            <h1 className="text-center text-2xl">Product Details</h1>
            <hr />
            <h6>Name: {product.name}</h6>
            <h6>Description: {product.description}</h6>
            <h6>
              Price:{" "}
              {product?.price?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </h6>
            <h6>Category: {product?.category?.name}</h6>
            <button
              className={`btn btn-dark ms-1 ${auth.user ? "active" : ""}`}
              disabled={!auth.user}
              onClick={() => {
                if (!auth) {
                  toast.error("Please login to add items to cart");
                  return;
                }
                const existingProductIndex = cart.findIndex(
                  (item) => item._id === product._id
                );
                let updatedCart = [...cart];
                if (existingProductIndex >= 0) {
                  updatedCart[existingProductIndex].quantity += 1;
                } else {
                  updatedCart.push({ ...product, quantity: 1 });
                }
                setCart(updatedCart);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                toast.success("Item Added to cart");
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>

        <div className="row similar-products mt-10 mx-10 m-auto">
          <h1 className="text-2xl">Similar Products ➡️</h1>
          {relatedProducts.length < 1 && (
            <p className="text-center">No Similar Products found</p>
          )}
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${p._id}`}
                  className="h-48 object-contain flex justify-center items-center"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="text-blue-600 font-bold">
                      {p.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition">
                    <button onClick={() => navigate(`/product/${p.slug}`)}>
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="review-section m-auto mx-2">
          {loading ? (
            <p>Loading reviews...</p>
          ) : (
            <ReviewComponent productId={productId} product={product} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
