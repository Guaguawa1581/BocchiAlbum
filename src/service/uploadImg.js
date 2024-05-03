import axios from "axios";
const uploadImg = async (file, isProfile = false) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    let postUrl = `${process.env.REACT_APP_API_URL}/api/image`;
    if (isProfile) {
      postUrl = `${process.env.REACT_APP_API_URL}/api/image/profile`;
    }
    const res = await axios.post(postUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return {
      success: true,
      url: res.data.imgUrl,
      public_id: res.data.public_id
    };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.message
    };
  }
};
export default uploadImg;
