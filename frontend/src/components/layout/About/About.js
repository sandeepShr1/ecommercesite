import React from "react";
import "./aboutSection.css";
import { LinkedIn, GitHub } from "@mui/icons-material"
import { Typography, Avatar } from "@mui/material";
import { Link } from "react-router-dom"
import Profile from "../../../images/Profile.png"
const About = () => {

      return (
            <div className="aboutSection">
                  <div></div>
                  <div className="aboutSectionGradient"></div>
                  <div className="aboutSectionContainer">
                        <Typography component="h1">About Us</Typography>

                        <div>
                              <div>
                                    <Avatar
                                          style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                                          src={Profile}
                                          alt="Founder"
                                    />
                                    <h3 >Rajkumar Sapkota</h3>

                                    <span>
                                          I am very delightful to complete this MERN website. I learned so many things, thanks to <Link to="#" target="blank">6 Pack Programmer</Link>.
                                    </span>
                              </div>
                              <div className="aboutSectionContainer2">
                                    <Typography component="h2">My Links</Typography>
                                    <a
                                          href="#"
                                          target="blank"
                                    >
                                          <GitHub className="youtubeSvgIcon" />
                                    </a>

                                    <a href="#" target="blank">
                                          <LinkedIn className="instagramSvgIcon" />
                                    </a>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default About;