import { useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
import moment from "moment";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
  ]);

  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="All Orders Data">
      <div className="mt-36 px-4 max-w-[1400px] mx-auto mb-2">

        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-12 md:col-span-3">
            <AdminMenu />
          </div>

        
          <div className="col-span-12 md:col-span-9">
            <h1 className="text-2xl font-bold text-center mb-6">All Orders</h1>

            <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-2">

              {orders.map((o, i) => (
                <div
                  key={o._id}
                  className="bg-white border rounded-xl shadow-sm p-2"
                >
                
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">#</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Buyer</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Payment</th>
                          <th className="px-4 py-2 text-left">Qty</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3">{i + 1}</td>

                          <td className="px-4 py-3">
                            <Select
                              bordered
                              className="w-36"
                              defaultValue={o.status}
                              onChange={(value) => handleChange(o._id, value)}
                            >
                              {status.map((s, idx) => (
                                <Option key={idx} value={s}>
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </td>

                          <td className="px-4 py-3">{o.buyer?.name}</td>
                          <td className="px-4 py-3">{moment(o.createdAt).fromNow()}</td>

                          <td className="px-4 py-3 font-medium">
                            {o.payment.success ? (
                              <span className="text-green-600">Success</span>
                            ) : (
                              <span className="text-red-600">Failed</span>
                            )}
                          </td>

                          <td className="px-4 py-3">{o.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                 
                  <div className="overflow-x-auto mt-2 pb-2">
                    <div className="flex gap-4 w-max">

                      {o.products.map((p) => (
                        <div
                          key={p._id}
                          className="min-w-[260px] bg-gray-50 border rounded-lg p-4 flex gap-4 hover:bg-gray-100 transition"
                        >
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            alt={p.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />

                          <div>
                            <h4 className="font-semibold">{p.name}</h4>
                            <p className="text-sm text-gray-500">
                              {p.description.substring(0, 40)}...
                            </p>
                            <p className="font-bold text-green-600 mt-1">
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

export default AdminOrders;
