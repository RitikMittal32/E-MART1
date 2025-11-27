import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "../config/axiosConfig";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="category mb-10" style={{marginTop: "180px"}}>
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="w-full px-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {products?.map((p) => (
      <div
        className="card bg-white border border-gray-200 rounded-lg shadow-lg p-4"
        key={p._id}
      >
        <img
          src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${p._id}`}
          className="h-48 object-contain flex justify-center items-center"
          alt={p.name}
        />
        <div className="card-body mt-3">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-lg font-semibold">{p.name}</h5>
            <h5 className="text-blue-600 font-bold">
              {p.price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </h5>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {p.description.substring(0, 60)}...
          </p>
          <div className="flex justify-between items-center">
            <button
              className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition"
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

      </div>
    </Layout>
  );
};

export default CategoryProduct;
