import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="row contactus container-fluid m-0 p-0">
        <div className="col-md-6 ">
          <img
            src="/about.svg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
          Welcome to EMART, your ultimate destination for a seamless and delightful shopping experience! At EMART, we believe in bringing the world to your fingertips, offering an extensive range of products that cater to your every need.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
