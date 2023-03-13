import React, { useEffect } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  ExpandMore,
  PostAdd,
  Add,
  ListAlt,
  ImportExport,
  Dashboard,
  People,
  RateReview,
} from "@mui/icons-material";
import logo from "../../images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/userActions";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);

  // const dispatch = useDispatch()
  // useEffect(() => {
  //       dispatch(getAllUsers())
  // }, [dispatch]);

  // console.log("USER",user.role)
  return (
    <div className="sidebar">
      <Link to="/">
        <h2>SARAZ</h2>
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <Dashboard /> Dashboard
        </p>
      </Link>
      {user.role !== "seller" ? (
        <></>
      ) : (
        <>
          <div className="p">
            <TreeView
              defaultCollapseIcon={<ExpandMore />}
              defaultExpandIcon={<ImportExport />}
            >
              <TreeItem nodeId="1" label="Products">
                <Link to="/admin/products">
                  <TreeItem nodeId="2" label="All" icon={<PostAdd />} />
                </Link>

                <Link to="/admin/product">
                  <TreeItem nodeId="3" label="Create" icon={<Add />} />
                </Link>
              </TreeItem>
            </TreeView>
          </div>
        </>
      )}

      {user.role !== "seller" ? (
        <></>
      ) : (
        <>
          <Link to="/admin/orders">
            <p>
              <ListAlt />
              Orders
            </p>
          </Link>
        </>
      )}

      {
        (user.role = "admin" ? (
          <Link to="/admin/users">
            <p>
              <People /> Users
            </p>
          </Link>
        ) : (
          <></>
        ))
      }
      {user.role !== "seller" ? (
        <></>
      ) : (
        <>
          {" "}
          <Link to="/admin/reviews">
            <p>
              <RateReview />
              Reviews
            </p>
          </Link>
        </>
      )}
      {user.role !== "seller" ? (
        <></>
      ) : (
        <>
          <div className="p">
            <TreeView
              defaultCollapseIcon={<ExpandMore />}
              defaultExpandIcon={<ImportExport />}
            >
              <TreeItem nodeId="1" label="Banners">
                <Link to="/admin/banners">
                  <TreeItem nodeId="2" label="All" icon={<PostAdd />} />
                </Link>

                <Link to="/admin/banner">
                  <TreeItem nodeId="3" label="Create" icon={<Add />} />
                </Link>
              </TreeItem>
            </TreeView>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
