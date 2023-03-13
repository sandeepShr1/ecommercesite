import React, { useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Chart from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../../redux/actions/productActions";
import { getOrderList } from "../../redux/actions/orderAction";
import { getAllUsers } from "../../redux/actions/userActions";
import { parse, stringify, toJSON, fromJSON } from "flatted";

const Dashboard = ({ userRole }) => {
  const { products } = useSelector((state) => state.products);
  const { orderList } = useSelector((state) => state.orderList);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);
  console.log("user.role", userRole);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getOrderList());
    dispatch(getAllUsers());
  }, [dispatch]);

  let Userproducts = [];
  products.forEach((element) => {
    if (element.user == user._id) {
      Userproducts.push(element);
    }
  });

  //MERGE:
  let mergedArray = [];
  orderList.map((item1) => {
    item1.orderItems.map((order) => {
      Userproducts.map((product) => {
        if (order.product === product._id) {
          mergedArray.push(item1);
        }
      });
    });
  });

  let totalAmount = 0;
  mergedArray &&
    mergedArray.forEach((item) => (totalAmount += item.totalPrice));

  let totalProductAmount = 0;
  Userproducts &&
    Userproducts.forEach((item) => (totalProductAmount += item.price));

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };
  return (
    <div className="dashboard">
      <Sidebar userRole={userRole} />

      <div className="dashboardContainer">
        <Typography variant="h1">Dashboard</Typography>
        {userRole === "seller" ? (
          <>
            {" "}
            <div className="dashboardSummary">
              <div>
                <p>Total Investment Amount: रू {totalProductAmount}</p>
              </div>
              <div>
                <p>Total Order Amount : रू {totalAmount}</p>
              </div>
              <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                  <p>Products</p>
                  <p>{Userproducts && Userproducts.length}</p>
                </Link>
                {userRole === "admin" ? (
                  <Link to="/admin/users">
                    <p>Users</p>
                    <p>{users && users.length}</p>
                  </Link>
                ) : (
                  <></>
                )}

                <Link to="/admin/orders">
                  <p>Orders</p>
                  <p>{mergedArray && mergedArray.length}</p>
                </Link>
              </div>
            </div>
            <div className="lineChart">
              <Line data={lineState} />
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="dashboardSummary">
              <div className="dashboardSummaryBox2">
                <Link to="/admin/users">
                  <p>Users</p>
                  <p>{users && users.length}</p>
                </Link>
              </div>
            </div>
            {/* <div className="lineChart">
                <Line data={lineState} />
              </div> */}
          </>
        )}
        {/* <div className="doughnutChart">
                              <Doughnut data={doughnutState} />
                        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
