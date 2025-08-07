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
            <div className="design p-3">
              <div className="uk-image">
                <img src="/images/uk.png" alt="UK" />
              </div>
              <div className="admind">
              <h4> Name : {auth?.user?.name}</h4>
              <h4> Email : {auth?.user?.email}</h4>
              <h4> Contact : +91 {auth?.user?.phone}</h4>
              <h4> Nationality : INDIAN</h4>
              {/* <h1>BJP JINDABAD</h1> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
