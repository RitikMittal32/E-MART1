import { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "../config/axiosConfig";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price * item.quantity;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  
  const decreaseQuantity = (productId) => {
    const updatedCart = cart
      .map((item) => {
        if (item._id === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Remove items with quantity 0
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  
  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className=" cart-page container-fluid" style={{marginTop: "100px", marginBottom:"10px"}}>
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="" >
  <div className="row">
    <div className="col-md-7 m-0 p-0 overflow-x-hidden"
            style={{
              height: "100vh",
              overflowY: "auto",
              display: "flex",  
              flexDirection: "column",
            }}>
{cart?.length > 0 ? (
  <>
    {cart.map((p, idx) => (
      <div
        key={p._id || idx}
        className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white border border-gray-200 shadow-sm rounded-xl p-2 my-1 hover:shadow-md transition mx-2"
      >
        <div className="w-32 h-32 flex items-center justify-center">
          <img
            src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${p._id}`}
            alt={p?.name || "Product image"}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold text-gray-800">
            {p?.name || "Unnamed Product"}
          </h2>
          <p className="text-sm text-gray-600">
            {p?.description
              ? p.description.substring(0, 60) + "..."
              : "No description available"}
          </p>
          <p className="mt-1 font-medium text-gray-700">₹{p?.price ?? 0}</p>

          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => decreaseQuantity(p._id)}
            >
              −
            </button>
            <span className="px-4 py-1 rounded-lg bg-gray-100 text-gray-800">
              {p?.quantity ?? 1}
            </span>
            <button
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => increaseQuantity(p._id)}
            >
              +
            </button>
            <button
              className="text-red-600 hover:text-red-800 text-lg font-medium"
              onClick={() => removeCartItem(p._id)}
            >
              🗑 Remove
            </button>
          </div>
        </div>
      </div>
    ))}
  </>
) : (
<>
</>
)}




</div>

            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default CartPage;
