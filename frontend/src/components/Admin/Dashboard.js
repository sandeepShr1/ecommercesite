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

const Dashboard = () => {
  const { products } = useSelector((state) => state.products);
  const { orderList } = useSelector((state) => state.orderList);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getOrderList());
    dispatch(getAllUsers());
  }, [dispatch]);

  let Userproducts = [];
  // let userProducts = products.find(({user}) => user = "64094f095886f436f9d2c9e9");
  products.forEach((element) => {
    //here id is your own id by which you want to compare against the json object
    if (element.user == user._id) {
      Userproducts.push(element);
    }
  });
  //MERGE:
  let mergedArray = [];
  orderList.map((item1) => {
//     console.log("ITEM", item1);
    item1.orderItems.map((order) => {
      // console.log("INSIDE LOOP", order);
      Userproducts.map((product) => {
      //   console.log("INSIDE LOOP 1", product);

        if (order.product === product._id) {
          mergedArray.push(item1);
        }
      });
    });
  });

//   console.log("MERGED", mergedArray);

  let totalAmount = 0;
  mergedArray &&
  mergedArray.forEach((item) => (totalAmount += item.totalPrice));

  let totalProductAmount = 0;
  Userproducts &&
    Userproducts.forEach((item) => (totalProductAmount += item.price));

  // let outOfStock = 0;
  // Userproducts && Userproducts.forEach((item) => {
  //       if (item.stock === 0) {
  //             outOfStock += 1;
  //       }
  // })

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

  // const doughnutState = {
  //       labels: ["Out of Stock", "InStock"],
  //       datasets: [
  //             {
  //                   backgroundColor: ["#00A6B4", "#6800B4"],
  //                   hoverBackgroundColor: ["#4B5000", "#35014F"],
  //                   data: [outOfStock, products.length - outOfStock],
  //             },
  //       ],
  // };

//   console.log("Userproducts", Userproducts);
  console.log("userOrderList", user);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboardContainer">
        <Typography variant="h1">Dashboard</Typography>
        {user.role === "seller" ?<> <div className="dashboardSummary">
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
            {user.role === "admin" ? (
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
        </div></>:<></>}
        {/* <div className="doughnutChart">
                              <Doughnut data={doughnutState} />
                        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
