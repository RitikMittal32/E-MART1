import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "../../config/axiosConfig";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="mt-36 px-6 max-w-[1400px] mx-auto mb-2">

        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-12 md:col-span-3">
            <AdminMenu />
          </div>

          <div className="col-span-12 md:col-span-9">
            <h1 className="text-2xl font-bold text-center mb-6">All Products</h1>

            <div className="max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {products?.map((p) => (
                  <Link
                    key={p._id}
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="block"
                  >
                    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-3">
                      
                      <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                   
                      <div className="mt-3">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {p.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {p.description}
                        </p>
                        <p className="text-green-600 font-bold text-lg mt-2">
                          ₹ {p.price}
                        </p>
                      </div>

                    </div>
                  </Link>
                ))}

              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Products;
