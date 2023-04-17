import React, { useRef, useState, useEffect } from 'react';
import "./SignupSeller.css";
import { Link, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError, register } from "../../redux/actions/userActions";
import { useAlert } from "react-alert"
import Loader from "../layout/Loader/Loader"

const SignupSeller = () => {

      const { loading, error, isAuthenticated } = useSelector((state) => state.user)
      const dispatch = useDispatch();
      const history = useNavigate();

      const [user, setUser] = useState({
            name: "",
            email: "",
            password: "",
            role:"seller"
      });

      const alert = useAlert();
      const { name, email, password,role } = user;

      const [avatar, setAvatar] = useState("/Profile.png");
      const [avatarPreview, setAvatarPreview] = useState("/Profile.png");


      const registerSubmit = (e) => {
            e.preventDefault();

            const myForm = new FormData();
            myForm.set("name", name);
            myForm.set("email", email);
            myForm.set("password", password);
            myForm.set("avatar", avatar);
            myForm.set("role", role);
            dispatch(register(myForm))
            // console.log('User',user)
      }

      const registerDataChange = (e) => {
            if (e.target.name === "avatar") {
                  const reader = new FileReader();

                  reader.onload = () => {
                        if (reader.readyState === 2) {
                              setAvatarPreview(reader.result);
                              setAvatar(reader.result);
                        }
                  };

                  reader.readAsDataURL(e.target.files[0]);
            } else {
                  setUser({ ...user, [e.target.name]: e.target.value });
            }
      };

      const redirect = window.location.search
            ? "/" + window.location.search.split("=")[1]
            : "/account";

      useEffect(() => {
            if (error) {
                  alert.error(error);
                  dispatch(clearError());
            }

            if (isAuthenticated) {
                  history(redirect);
            }
      }, [dispatch, error, alert, history, isAuthenticated, redirect]);
      

      return (
            <>
                  {loading ? <Loader /> : (
                        <div className="LoginSignUpContainer">
                              <div className="LoginSignUpBox">
                                <h2 style={{textAlign:"center"}}>WELCOME! BECOME A SELLER</h2>
                                    <form
                                          className="signupSection"
                                          encType="multipart/form-data"
                                          onSubmit={registerSubmit}
                                    >
                                          <div className="signUpName">
                                                <FaceIcon />
                                                <input
                                                      type="text"
                                                      placeholder="Name"
                                                      required
                                                      name="name"
                                                      value={name}
                                                      onChange={registerDataChange}
                                                />
                                          </div>
                                          <div className="signUpEmail">
                                                <MailOutlineIcon />
                                                <input
                                                      type="email"
                                                      placeholder="Email"
                                                      required
                                                      name="email"
                                                      value={email}
                                                      onChange={registerDataChange}
                                                />
                                          </div>
                                          <div className="signUpPassword">
                                                <LockOpenIcon />
                                                <input
                                                      type="password"
                                                      placeholder="Password"
                                                      required
                                                      name="password"
                                                      value={password}
                                                      onChange={registerDataChange}
                                                />
                                          </div>

                                          <div id="registerImage">
                                                <img src={avatarPreview} alt="Avatar Preview" />
                                                <input
                                                      type="file"
                                                      name="avatar"
                                                      accept="image/*"
                                                      onChange={registerDataChange}
                                                />
                                          </div>
                                          <input type="submit" value="Register" className="signUpBtn" />
                                    </form>
                              </div>
                        </div>
                  )}
            </>
      )
}

export default SignupSeller;