import React, { useContext } from "react";
import {
  AiFillFacebook,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { ImInstagram } from "react-icons/im";
import { GrLanguage } from "react-icons/gr";

import "./Footer.css";
import { ThemeContext } from "../../context/ThemeContext";
//===================================================================

export const Footer = () => {
  const { isLightMode } = useContext(ThemeContext);
  return (
    <div className={`footer ${isLightMode ? "light-mode" : ""}`}>
      <div className="footer-items">
        <span>Questions? Call 1-844-505-2993</span>
        <span>FAQ</span>
        <span>Cookie Preferences</span>

        <div className="languages">
          <GrLanguage className="language-icon" />
          <select name="language" id="">
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>
      </div>
      <div className="footer-items">
        <span>Help Center</span>
        <span>Corporate Information</span>
      </div>
      <div className="footer-items">
        <span>Terms of Use</span>
        <span>Privacy</span>
      </div>
      <div className="footer-items">
        <ul className="social-media-icons">
          <li>
            <a href="https://www.facebook.com">
              <AiFillFacebook className="icon facebook" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com">
              <ImInstagram className="icon instagram" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com">
              <AiOutlineTwitter className="icon twitter" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com">
              <AiFillYoutube className="icon youtube" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
