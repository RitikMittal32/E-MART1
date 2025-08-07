import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "../config/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import ReviewComponent from "../components/Form/ReviewForm";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart"; // Import useCart
import toast from "react-hot-toast"; // Import toast

const ProductDetails = () => {
  const params = useParams();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [productId, setProductId] = useState(); 
  const [cart, setCart] = useCart(); // Destructure cart and setCart from useCart

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
        <div className="row product-details">
          <div className="col-md-6 primage">
            <img
              src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
            />
          </div>
          <div className="col-md-6 product-details-info">
            <h1 className="text-center">Product Details</h1>
            <hr />
            <h6>Name : {product.name}</h6>
            <h6>Description : {product.description}</h6>
            <h6>
              Price :
              {product?.price?.toLocaleString("en-IN", {
                style: "currency",                  
                currency: "INR",
              })}
            </h6>
            <h6>Category : {product?.category?.name}</h6>
            <button
  className="btn btn-dark ms-1"
  onClick={() => {
    const existingProductIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart = [...cart];

    if (existingProductIndex >= 0) {
      // If the product is already in the cart, increase its quantity
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      // Otherwise, add the product with a quantity of 1
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
        <hr />
        <div className="row similar-products">
          <h4>Similar Products ➡️</h4>
          {relatedProducts.length < 1 && (
            <p className="text-center">No Similar Products found</p>
          )}
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="review-section"> 
          <h1>Review Section</h1>
          <div>
            {loading ? (
              <p>Loading reviews...</p>
            ) : (
              <ReviewComponent productId={productId} product={product}/>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
