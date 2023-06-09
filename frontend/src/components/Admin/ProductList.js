import React, { useEffect } from "react";
import "./ProductList.css";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import {
  clearError,
  getAdminProducts,
  deleteProduct,
} from "../../redux/actions/productActions";
import { DELETE_PRODUCT_RESET } from "../../redux/constants/productConstants";
import { Edit, Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import SideBar from "./Sidebar";

const ProductList = ({userRole}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useNavigate();

  const { error, products } = useSelector((state) => state.products);
  const { user } = useSelector(state => state.user)

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  // console.log("User PRODUCTS", user);
  // console.log("User PRODUCTS", user._id);

  let Userproducts = [];
  // let userProducts = products.find(({user}) => user = "64094f095886f436f9d2c9e9");
  products.forEach((element) => {
    //here id is your own id by which you want to compare against the json object
    if (element.user == user._id) {
      Userproducts.push(element);
    }
  });

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
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
      alert.success("Product Deleted Successfully");
      history("/admin/dashboard");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProducts());
  }, [dispatch, alert, error, deleteError, history, isDeleted]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 100,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
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
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <Edit />
            </Link>

            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
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

  Userproducts &&
  Userproducts.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });

    console.log("productlist",userRole)
  return (
    <>
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <SideBar userRole={userRole}/>
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>

          <DataGrid
            rows={rows}
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

export default ProductList;
