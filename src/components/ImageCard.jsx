import React, { useState } from "react";
import {
  Comment as CommentIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";
import { yellow } from "@mui/material/colors";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { message } from "antd";
import axios from "axios";
import Time from "./TimeToNow";
import fakeAvatar from "../images/squareTsuchinokoGif.gif";

const ImageCard = ({ cardData, headerOptions = true, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPublic, setIsPublic] = useState(Boolean(cardData.is_public));

  // 更新API
  const updateCardData = async (data, cardId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/card/card_id=${cardId}`,
        data
      );

      if (res.data.success) {
        return message.success("Update card successfully");
      } else {
        message.error(`Updated failed: ${res.data.message}`);
        return;
      }
    } catch (err) {
      if (err.response.status === 404) {
        message.error(`Updated failed: ${err.message}`);
        return;
      } else {
        message.error(`Updated failed: ${err.response.data.message}`);
        return;
      }
    }
  };

  const publicHandler = async () => {
    setIsPublic(!isPublic);
    setAnchorEl(null);
    const cardId = cardData.card_id;
    const newIsPublic = !isPublic;
    const newData = {
      is_public: newIsPublic ? 1 : 0
    };
    await updateCardData(newData, cardId);
  };

  const handleDelete = () => {
    onDelete(cardData);
    setAnchorEl(null);
  };
  const handleMenuClose = () => {
    // if (isPublic !== Boolean(cardData.is_public)) {
    //   console.log("isPublic Change");
    // }
    setAnchorEl(null);
  };
  return (
    <div className="image_cards">
      <div className={`box ${isPublic ? "" : "not_public"}`}>
        <div className="card_header">
          <div className="avatar">
            <Avatar
              sx={{ width: 56, height: 56 }}
              src={cardData && cardData.avatar ? cardData.avatar : fakeAvatar}
            />
          </div>
          <div className="info">
            <div>
              <div className="title">
                <span>{cardData && cardData.title}</span>
              </div>
              {headerOptions && (
                <div className="card_header_options ">
                  <IconButton
                    aria-label="more"
                    aria-controls="card-menu"
                    aria-haspopup="true"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="card-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: yellow[50],
                              "&.Mui-checked": {
                                color: yellow[500]
                              }
                            }}
                            checked={isPublic}
                            onChange={publicHandler}
                          />
                        }
                        labelPlacement="start"
                        label="Public"
                      />
                    </MenuItem>
                    <Divider />

                    <MenuItem onClick={handleDelete}>
                      <span className="text-danger  fw-bold">Delete</span>
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
            <div className="author">
              <span>@</span>
              <span>{cardData && cardData.username}</span>
              <span>&ensp;‧&ensp;</span>
              <Time timestamp={cardData && cardData.created_at} />
            </div>
          </div>
        </div>
        <div className="card_body">
          <div className="card_img">
            <img src={cardData && cardData.image_url} alt="" loading="lazy" />
          </div>
          {/* <div className="options">
            <div>
              <span>
                <CommentIcon sx={{ fontSize: 16 }} />
              </span>
              <span>Comments</span>
            </div>
            <div>
              <span>
                <FavoriteBorderIcon sx={{ fontSize: 16 }} />
              </span>
              <span>Like</span>
            </div>
            <div>
              <span>
                <ShareIcon sx={{ fontSize: 16 }} />
              </span>
              <span>Share</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
