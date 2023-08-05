import React from "react";
import { Link } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
const Footer = () => {
  return (
    <div id="footer">
      <h3>BOCCHI ALBUM !</h3>
      <div className="links">
        <Link to="https://github.com/Guaguawa1581">
          <GitHubIcon />
        </Link>
      </div>
      <p>
        This website is for personal works only and Does NOT serve commercial
        purposes.
      </p>
    </div>
  );
};

export default Footer;
