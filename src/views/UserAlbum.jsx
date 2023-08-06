import React, { useEffect, useState, useCallback } from "react";
import Masonry from "react-masonry-css";
import { useSelector, useDispatch } from "react-redux";
import { dataRefresh, stateLoading } from "../service/redux/actions";
import { message, Modal } from "antd";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import axios from "axios";
import Cookies from "js-cookie";
import ImageCard from "../components/ImageCard";
import EndPic from "../images/cyberchosisBocchi.gif";

const UserAlbum = () => {
  const dispatch = useDispatch();
  // 顯示設定
  const breakpointColumnsObj = {
    default: 4, // 預設情況下，每行顯示4個圖片
    1400: 3, // 螢幕寬度小於1400px時，每行顯示3個圖片
    992: 2,
    768: 1
  };

  // data
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEndPage, setIsEndPage] = useState(null);
  const getDataAlbum = async (page) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/card/album?page=${page}&limit=20`,
        { headers: { Authorization: Cookies.get("bocchi") } }
      );

      if (res.data.success && page === 1) {
        setDataList(res.data.cardData);
        setLoading(false);
      } else if (res.data.success && page > 1) {
        setDataList((prevDataList) => [...prevDataList, ...res.data.cardData]);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setIsEndPage(true);
      if (err.response.status === 404) {
        message.error(`Error: ${err.message}`, 5);
      } else {
        message.warning(
          `Error: ${err.response.data.message || err.response.statusText}`,
          5
        );
      }
    }
  };
  useEffect(() => {
    if (currentPage === 1) {
      getDataAlbum(1);
    } else {
      getDataAlbum(currentPage);
    }
  }, [currentPage]);

  // 監聽是否滑到底
  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (isBottom && !loading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };
    if (!isEndPage) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, isEndPage]);

  // 從redux中提取user資料
  const userInfo = useSelector((state) => state.user);

  // del card
  const [delModelOpen, setDelModelOpen] = useState(false);
  const [tempCard, setTempCard] = useState(null);
  const openDelModel = (card) => {
    setTempCard(card);
    setDelModelOpen(true);
  };
  const closeDelModel = () => {
    setTempCard(null);
    setDelModelOpen(false);
  };
  const handleDeleteCard = async (cardData) => {
    await delData(cardData.card_id);
    // 更新list
    const updatedList = dataList.filter(
      (card) => card.card_id !== cardData.card_id
    );
    setDataList(updatedList);
    setTempCard(null);
    setDelModelOpen(false);
  };
  const delData = async (id) => {
    try {
      dispatch(stateLoading(true));
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/card/card_id=${id}`
      );

      dispatch(stateLoading(false));
      if (res.data.success) {
        message.success("Deleted card successfully", 3);
      } else {
        message.error(`Deleted failed: ${res.data.message}`);
        return;
      }
    } catch (err) {
      dispatch(stateLoading(false));
      if (err.response.status === 404) {
        message.error(`Error: ${err.message}`, 5);
        return;
      } else {
        message.error(
          `Error: ${err.response.data.message || err.response.statusText}`,
          5
        );
        return;
      }
    }
  };
  // redux 重整
  const refreshPage = useCallback(
    async (needsRefresh) => {
      if (needsRefresh) {
        if (currentPage === 1) {
          await getDataAlbum(1);
        } else {
          setCurrentPage(1);
        }
        setIsEndPage(false);
        window.scrollTo(0, 0);
        dispatch(dataRefresh(false));
      }
    },
    [currentPage, setCurrentPage, setIsEndPage, dispatch]
  );

  const reduxDataOperation = useSelector((state) => state.data);
  const needsRefresh = reduxDataOperation.needsRefresh;

  // 使用 useEffect 觸發 refreshPage 函式
  useEffect(() => {
    refreshPage(needsRefresh);
  }, [needsRefresh, refreshPage]);

  return (
    <>
      <div id="album_page">
        <div className="page_banner bg-danger text-white">
          This is {userInfo.userData && userInfo.userData.username} Album
        </div>
        {dataList.length === 0 && (
          <div className="pt-4 fs-2 fw-bold text-center">
            There is nothing here <span className="mx-1">: (</span>
          </div>
        )}
        <div className="card_container container">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="cards_masonry_grid"
            columnClassName="cards_masonry_grid_column"
          >
            {/* 在這裡插入您的圖片元素 */}
            {dataList.length > 0 &&
              dataList.map((data, index) => (
                <ImageCard
                  cardData={data}
                  key={data.card_id}
                  onDelete={openDelModel}
                />
              ))}
          </Masonry>
          {loading && <div>Loading more...</div>}
          {!loading && isEndPage && dataList.length >= 20 && (
            <div className="end_card">
              <h1>This is END</h1>
              <div className="img_box">
                <img src={EndPic} alt="" />
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        className="del_modal"
        // width={300}
        centered
        open={delModelOpen}
        onCancel={closeDelModel}
        footer={
          <div className="modal_btns">
            <button onClick={closeDelModel}>Cancel</button>
            <button
              onClick={() => {
                handleDeleteCard(tempCard);
              }}
            >
              Delete
            </button>
          </div>
        }
      >
        <div className="modal_text">
          <span>
            <ReportGmailerrorredIcon sx={{ fontSize: 80 }} />
          </span>
          <h2>Sure to delete ?</h2>
          <p>
            Title： <span>{tempCard && tempCard.title}</span>
          </p>
          <span>( Posts will not be able to reply )</span>
        </div>
      </Modal>
    </>
  );
};

export default UserAlbum;
