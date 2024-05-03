/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import Masonry from "react-masonry-css";
import axios from "axios";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsDataNeedRefresh,
  selectIsDataNeedRefresh
} from "../service/globalData";
import ImageCard from "../components/ImageCard";
import EndPic from "../images/cyberchosisBocchi.gif";
const HomePage = () => {
  const dispatch = useDispatch();
  // 顯示設定
  const breakpointColumnsObj = {
    default: 4, // 預設情況下，每行顯示4個圖片
    1400: 3,
    992: 2, // 螢幕寬度小於1100px時，每行顯示2個圖片
    768: 1 // 螢幕寬度小於700px時，每行顯示1個圖片
  };
  // data
  const IsDataNeedRefresh = useSelector(selectIsDataNeedRefresh);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 追蹤目前已經載入的頁數
  const [isEndPage, setIsEndPage] = useState(false);

  const getData = async (page) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/card?page=${page}&limit=20`
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
      if (err.response) {
        if (err.response.status === 404) {
          message.error(`Error: ${err.message}`, 5);
        } else {
          message.warning(
            `Error: ${err.response.data.message || err.response.statusText}`,
            5
          );
        }
      } else {
        message.warning(`Error: ${err.message}`, 5);
      }
    }
  };
  useEffect(() => {
    if (currentPage === 1) {
      getData(1);
    } else {
      getData(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    // 監聽是否滑到底
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50;

      if (isBottom && !loading) {
        setCurrentPage((prevPage) => prevPage + 1); // 滾動到底部時，將頁數增加 1，觸發載入更多資料
      }
    };
    if (!isEndPage) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, isEndPage]);
  // 監聽 loading 的變化，避免在載入資料時重複觸發載入事件

  // 使用 useCallback 確保 refreshPage 函式不會在每次渲染時都重新創建
  const refreshPage = useCallback(
    async (page) => {
      if (page === 1) {
        await getData(1);
      } else {
        setCurrentPage(1);
      }
      setIsEndPage(false);
      window.scrollTo(0, 0);
      dispatch(setIsDataNeedRefresh(false));
    },
    [setCurrentPage, setIsEndPage, dispatch]
  );

  // 使用 useEffect 觸發 refreshPage 函式
  useEffect(() => {
    if (IsDataNeedRefresh) {
      refreshPage(currentPage);
    }
  }, [IsDataNeedRefresh, currentPage]);

  return (
    <div id="home_page">
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
                headerOptions={false}
              />
            ))}
        </Masonry>
        {loading && (
          <div className="fw-2 fw-bold text-center">Loading . . .</div>
        )}
        {!loading && isEndPage && (
          <div className="end_card">
            <h1>This is END</h1>
            <div className="img_box">
              <img src={EndPic} alt="" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
