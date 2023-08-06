import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Compressor from "compressorjs";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
const ProfilePictureUpload = ({
  getError,
  getFile,
  imgSrc,
  errorHint,
  ...props
}) => {
  const [selectedImage, setSelectedImage] = useState(imgSrc || null);
  const [errorMessage, setErrorMessage] = useState("");

  //讓geterror可以是選填的
  const handleGetError = useCallback(
    (error) => {
      if (getError) {
        getError(error);
      }
    },
    [getError]
  );

  // 確保內外圖片一致
  useEffect(() => {
    setSelectedImage(imgSrc);
  }, [imgSrc]);
  useEffect(() => {
    if (errorHint) setErrorMessage(true);
  }, [errorHint]);

  // 壓縮圖片
  const compressImg = useCallback((file) => {
    if (file.type === "image/gif") {
      return file;
    }

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-unused-vars
      const compressored = new Compressor(file, {
        quality: 0.6,
        success(result) {
          // 壓縮完成後再進行 resolve
          resolve(result);
        },
        error(err) {
          reject(err);
        }
      });
    });
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      // console.log("fuiyoh", acceptedFiles, "haiya", rejectedFiles);
      if (acceptedFiles.length === 0) {
        const rejectedFile = rejectedFiles[0];
        setErrorMessage(rejectedFile.errors[0].code);
        //失敗
        // getFile(null);
        handleGetError(rejectedFile.errors);
        return;
      }

      const oldFile = acceptedFiles[0];

      // 一般用途
      if (props.type !== "avatar") {
        try {
          const compressedFile = await compressImg(oldFile);

          //成功

          getFile(compressedFile);
          setErrorMessage("");
          handleGetError(null);
          return;
        } catch (err) {
          setErrorMessage(err.message);
          handleGetError(err.message);
          //失敗
          // getFile(null);
          return;
        }
      }

      // avatar
      const reader = new FileReader();
      reader.onload = (e) => {
        // 將圖片裁切成正方形
        const image = new Image();
        image.src = e.target.result;

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const maxSize = Math.min(image.width, image.height);

          canvas.width = maxSize;
          canvas.height = maxSize;

          const x = (image.width - maxSize) / 2;
          const y = (image.height - maxSize) / 2;

          context.drawImage(
            image,
            x,
            y,
            maxSize,
            maxSize,
            0,
            0,
            maxSize,
            maxSize
          );

          canvas.toBlob((blob) => {
            const croppedFile = new File([blob], oldFile.name, {
              type: oldFile.type
            });
            setErrorMessage("");
            //成功

            getFile(croppedFile);
          }, oldFile.type);
        };
      };
      reader.readAsDataURL(oldFile);
    },
    [compressImg, props.type, getFile, handleGetError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"]
    },
    maxSize: 10 * 1024 * 1024
  });

  return (
    <div className="drop_box">
      <div
        {...getRootProps()}
        className={`dropzone ${props.type === "avatar" ? "avatar_type" : ""} ${
          errorMessage ? "error_hint" : ""
        }`}
      >
        <span className="avatar_icon">
          <CenterFocusWeakIcon />
        </span>
        <div className="dropzone_inner">
          <input {...getInputProps()} />
          {selectedImage ? (
            <img src={selectedImage} alt="Profile" className="preview_image" />
          ) : (
            <>
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p className="text-center">{props.label}</p>
              )}
            </>
          )}
        </div>
      </div>
      <p className={`error_meg ${props.type === "avatar" ? "avatar_err" : ""}`}>
        {errorMessage}
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
