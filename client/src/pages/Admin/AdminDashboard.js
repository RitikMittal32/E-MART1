import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import './admin.css';
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
            <div className="col-md-9">
                <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-6">
            <img
              src="/images/Profile.png"
              alt="Admin"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
            />
            <div>
              <p className="text-2xl font-bold text-gray-800 uppercase">
                {auth?.user?.name}
              </p>
              <p className="text-gray-600">Email: {auth?.user?.email}</p>
              <p className="text-gray-600">Contact: +91 {auth?.user?.phone}</p>
              <p className="text-gray-600">Address: {auth?.user?.address}</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
