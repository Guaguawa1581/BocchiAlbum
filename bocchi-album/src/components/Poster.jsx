import React, { useState } from "react";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import ReactModal from "react-modal";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { stateLoading, dataRefresh } from "../service/redux/actions";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { yellow } from "@mui/material/colors";
import InputField from "./InputField";
import ImageDrop from "./ImageDrop";

ReactModal.setAppElement("#root");

const Poster = () => {
  const dispatch = useDispatch();
  // modal控制
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setPostImg(null);
    setPostImgFile(null);
    setIsPostImgErr(false);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  // 接收 image
  const [postImg, setPostImg] = useState(null);
  const [postImgFile, setPostImgFile] = useState(null);
  const [isPostImgErr, setIsPostImgErr] = useState(false);
  const imgHandler = (data) => {
    if (data !== null) {
      // 標記有更新profile、更改縮圖、state檔案

      setPostImgFile(data);
      setIsPostImgErr(false);
      setPostImg(URL.createObjectURL(data));
    }
  };

  // API
  const uploadImg = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data.imgUrl;
    } catch (error) {
      message.error(error.response.data.error);
      return;
    }
  };

  // form 相關
  const postValidate = yup.object({
    title: yup
      .string()
      .max(20, "TITLE cannot exceed 20 characters")
      .required("TITLE is required !"),
    is_public: yup.boolean().required("The option to make public is required !")
  });

  const postHandler = async (values) => {
    try {
      dispatch(stateLoading(true));
      if (!postImgFile) {
        setIsPostImgErr(true);
        message.error("Image is required !");
        return;
      } else {
        setIsPostImgErr(false);
      }
      const imgUrl = await uploadImg(postImgFile);
      const formData = {
        title: values.title,
        is_public: values.is_public ? 1 : 0,
        image_url: imgUrl
      };

      const postRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/card`,
        formData
      );
      if (postRes.data.success) {
        closeModal();
        dispatch(stateLoading(false));
        dispatch(dataRefresh(true));
        message.success("Posted successfully !");
        return;
      }
    } catch (err) {
      console.error(err);
      dispatch(stateLoading(false));
      if (err.response.status === 404) {
        message.error(`Posted failed: ${err.message}`, 5);
      } else {
        message.error(
          `Posted failed: ${
            err.response.data.message || err.response.statusText
          }`,
          5
        );
      }
    }
  };

  return (
    <div id="poster">
      <CSSTransition in={!showModal} classNames="post_btn_box" timeout={300}>
        <div className="post_btn_box">
          <div className="post_btn" onClick={openModal}>
            <AddIcon />
          </div>
        </div>
      </CSSTransition>

      <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        portalClassName="poster_modal"
        overlayClassName="modal_overlay"
        className="modal_content"
        closeTimeoutMS={300}
        ariaHideApp={false} // 避免警告提示
      >
        <div className="modal_inner">
          <div className="form_header">
            <h1>NEW POST</h1>
            <div>
              <CloseIcon
                onClick={() => {
                  closeModal();
                }}
              />
            </div>
          </div>
          <div className="form_container">
            <Formik
              initialValues={{
                title: "",
                is_public: 1
              }}
              validationSchema={postValidate}
              onSubmit={postHandler}
            >
              <Form className="w-100 ">
                <div className="w-100">
                  <InputField
                    label="TITLE"
                    type="text"
                    placeholder="Title..."
                    name="title"
                  />
                </div>

                <div className="mt-3">
                  <ImageDrop
                    label={
                      <>
                        <span>UPLOAD</span>
                        <br />
                        <span>IMAGE</span>
                      </>
                    }
                    getFile={imgHandler}
                    imgSrc={postImg}
                    errorHint={isPostImgErr}
                  />
                </div>
                <div className="public_check w-100">
                  <Field type="checkbox" name="is_public">
                    {({ field }) => (
                      <FormControlLabel
                        label="Public"
                        control={
                          <Checkbox
                            {...field}
                            value={field.value === 1 ? true : false}
                            sx={{
                              color: yellow["A400"],
                              "&.Mui-checked": {
                                color: yellow[500]
                              }
                            }}
                          />
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="submit_btn">
                  <button type="submit">POST !</button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Poster;
