import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "../../config/axiosConfig";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="Your Orders">
      <div className="container mx-auto mt-36 px-4 max-h-[80vh] overflow-y-auto pb-10">

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <UserMenu />
          </div>

          <div className="col-span-12 md:col-span-9">
            <h1 className="text-2xl font-bold text-center mb-6">
              Your Orders
            </h1>

      
            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-2">
              {orders.map((o, i) => (
                <div
                  key={o._id}
                  className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="py-2 px-4 text-left">#</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Buyer</th>
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Payment</th>
                          <th className="py-2 px-4 text-left">Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">{i + 1}</td>
                          <td className="py-2 px-4">{o.status}</td>
                          <td className="py-2 px-4">{o.buyer?.name}</td>
                          <td className="py-2 px-4">
                            {moment(o.createdAt).fromNow()}
                          </td>
                          <td className="py-2 px-4 font-medium">
                            {o.payment.success ? (
                              <span className="text-green-600">Success</span>
                            ) : (
                              <span className="text-red-600">Failed</span>
                            )}
                          </td>
                          <td className="py-2 px-4">{o.products.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

              
                 <div className="overflow-x-auto mt-2">
                    <div className="flex gap-4 w-max">
                      {o.products.map((p) => (
                        <div
                          key={p._id}
                          className="bg-gray-50 border rounded-lg p-4 flex gap-4 hover:bg-gray-100 transition"
                        >
                          <img
                            src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${p._id}`}
                            alt={p.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />

                          <div>
                            <p className="font-semibold text-gray-800">
                              {p.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {p.description.substring(0, 40)}...
                            </p>
                            <p className="text-green-600 font-bold mt-1">
                              ₹ {p.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

               </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
