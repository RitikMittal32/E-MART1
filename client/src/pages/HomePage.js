import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "../config/axiosConfig";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { sliderImage } from "../components/data/Image";
import { Icons } from "../components/data/Icon";
import { HeroBanner } from "./HeroBanner";
import { Carousel } from "./Carousel";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPageIndex = (currentPageIndex + 1) % sliderImage.length;
      setCurrentPageIndex(nextPageIndex);
    }, 5000); // Change the interval time as desired

    return () => clearInterval(interval);
  }, [currentPageIndex]);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImage.length);
      }, 3000); // Change slide every 3 seconds
      return () => clearInterval(interval);
    }
  }, [autoPlay, sliderImage.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImage.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliderImage.length) % sliderImage.length);
  };

  const setSlide = (index) => {
    setCurrentIndex(index);
  };

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevIndex) =>
        prevIndex === Icons.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Adjust the interval time (in milliseconds) as needed

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [Icons.length]);

  // const handlePrev = () => {
  //   setCurrent((prevIndex) =>
  //     prevIndex === 0 ? Icons.length - 1 : prevIndex - 1
  //   );
  // };

  // const handleNext = () => {
  //   setCurrent((prevIndex) =>
  //     prevIndex === Icons.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  return (
    <Layout title={"ALL Products - Best offers "}>
      <div className="container-fluid m-0 p-0 overflow-hidden">
      <div className="homepage">
        <HeroBanner />
      </div>
      <div className="home-page">
       <div className="filters-home">
        <div className="filters">
          <div className="category-filter">
          <h4 className="text-center mt-0">Category</h4>
          <div className="categories">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          </div>
          {/* price filter */}
          <div className="price-filter">
          <h4 className="text-center mt-0">Price</h4>
          <div>
            
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              <div className="prices">
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
              </div>
            </Radio.Group>
          </div>
          </div>
          </div>
          <div className="reset">
          <div className="reset-button">
            <button
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
          </div>
          </div>
        <div className="div">
        <div className="products-details">
          <h1 className="text-center mt-0 text-base">PRODUCTS</h1>
          <div className="w-full product">
            {products?.map((p) => (
              <div className="mt-4" key={p._id}>
                <div
                      className="btns btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                <div className="main-card d-flex">
                <div className="main-card-photo">
                <img
                  src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                </div>
                <div className="verticle-line"></div>
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                  </div>
                  <div className="card-texts">
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  </div>
                  <div className="card-name-prices  flex justify-evenly" style={{width :"150px"}}>

                  <h5 className="card-title card-price mr-4">
                  {p.price.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                    </h5>

                    <button

  onClick={() => {
    const existingProductIndex = cart.findIndex((item) => item._id === p._id);
    let updatedCart = [...cart];

    if (existingProductIndex >= 0) {
      // If the product is already in the cart, increase its quantity
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      // Otherwise, add the product with a quantity of 1
      updatedCart.push({ ...p, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item Added to cart");
  }}
>
<img className="cart-icons" src="./icons/cart.png"   alt="cart"/> 
</button>

                  </div>
                </div>
                </div>
                </div>
              </div>
            ))}
            
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
      {/* <div className="slider">
      <div className="icons-slider">
        {Icons.map((item) => {
          return( 
            <div className="icons">
              <img src={`${item.imgs}`} alt="logo" />
            </div>
        )})}
      </div>
      </div> */}
      <div className="slider">
        <Carousel Icons={Icons}/>
      </div>
      </div>
    </Layout>
  );
};

export default HomePage;
