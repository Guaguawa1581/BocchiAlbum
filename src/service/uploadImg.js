import axios from "axios";
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
    return {
      success: true,
      url: res.data.imgUrl
    };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.message
    };
  }
};
export default uploadImg;
