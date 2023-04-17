import React, { useEffect } from "react";
import "./ProductList.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderList,
  clearError,
  deleteOrder,
} from "../../redux/actions/orderAction";
import { DELETE_ORDERS_RESET } from "../../redux/constants/orderConstants";
import { useAlert } from "react-alert";
import { DataGrid } from "@mui/x-data-grid";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import SideBar from "./Sidebar";
import { getAdminProducts } from "../../redux/actions/productActions";

const OrderList = ({ userRole }) => {
  const { orderList, error } = useSelector((state) => state.orderList);
  const { products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { user } = useSelector((state) => state.user);

  let Userproducts = [];
  // let userProducts = products.find(({user}) => user = "64094f095886f436f9d2c9e9");
  products.forEach((element) => {
    //here id is your own id by which you want to compare against the json object
    if (element.user === user._id) {
      Userproducts.push(element);
    }
  });

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearError());
    }
    if (isDeleted) {
      console.log(isDeleted);
      alert.success("Order Deleted Successfully");
      history("/admin/orders");
      dispatch({ type: DELETE_ORDERS_RESET });
    }

    dispatch(getOrderList());
    dispatch(getAdminProducts());
  }, [dispatch, alert, error, deleteError, isDeleted, history]);


  //MERGE:
  let mergedArray = [];
  const newProd = [];

  // orderList.map((item1) => {

  //   item1?.orderItems.map((order) => {
  //     Userproducts.map((product) => {

  //       if (order.product === product._id) {
  //         newProd.push(order);
  //         console.log(newProd, "inside")
  //       }
  //     });

  //   });
  //   console.log(newProd, "ouside")
  //   mergedArray.push({ ...item1, orderItems: newProd })
  // });

  // console.log("MERGED", mergedArray);

  let newarrayorder = [];
  let obj = {}
  orderList?.map((orderlist) => {
    let newlist = [];
    orderlist?.orderItems?.map((order) => {
      Userproducts.map((product) => {
        if (order.product === product._id) {
          newlist.push(order);
        }
      })
    })
    obj = { ...orderlist, orderItems: newlist }
    newarrayorder.push(obj);
  });

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "nameItem",
      headerName: "Name",
      type: "text",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "size",
      headerName: "Size",
      type: "text",
      minWidth: 100,
      flex: 0.3,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 100,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 200,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <Edit />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  // newarrayorder.forEach((item) => {
  //   item.orderItems.map((item1) => { });
  // });
  console.log(newarrayorder)

  newarrayorder &&
    newarrayorder.filter(n => n.orderItems.length > 0).forEach((item) => {
      rows.push({
        nameItem: item.orderItems.map((item1) => {
          return item1.name;
        }),
        itemsQty: item?.orderItems?.reduce((a, c) => a + (Number(c.quantity)), 0),
        id: item._id,
        status: item.orderStatus,
        size: item.orderItems.map((item1) => {
          return item1.size;
        }),
        amount: item?.orderItems?.reduce((a, c) => a + (Number(c.price) * Number(c.quantity)), 0),
      });
    });


  return (
    <>
      <MetaData title={`ALL Orders - Admin`} />

      <div className="dashboard">
        <SideBar userRole={userRole} />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL Orders</h1>

          <DataGrid
            rows={rows || []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </>
  );
};

export default OrderList;
