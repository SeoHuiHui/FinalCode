import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import moment from "moment"
import Button from 'react-bootstrap/Button';
import "./ProductDetail.scss"
import button from './button.css'
import COYToken from "../abi/COYToken.json";
import Web3 from "web3";
import Loading from './Loading';
import useWallet from '../security/useWallet';

const COY_ADDRESS = "0xE7E90F7f8986739950cA1FCBF09Fb2Be971B1673";
const COY_ABI = COYToken.abi;

const ProductDetail = (props) => {
  const { active } = useWallet();

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [product, setProduct] = useState(null);
  // useParams() 실행되면 파라미터 값을 가지고 있는 객체를 반환
  // product/1
  const { id } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
        const contract = new web3.eth.Contract(COY_ABI, COY_ADDRESS);
        setContract(contract);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask to connect to Ethereum network");
    }
  }

  useEffect(
    function () {
      const getAProduct = async () => {
        const res = await axios.get(`/api/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data.status === 201) {
          setProduct(res.data.data[0]);
        } else {
          console.log("error");
        }
      };
      getAProduct();
      connectWallet();
    },
    [id]
  ); // 빈 배열 넣어줘야 마운트 될 때 한번만 시행

  async function donateForTransaction() {
    contract.events
      .TxComplete({ filter: { buyer: accounts[0] } })
      .on("data", function (event) {
        // 이때의 event는 생성된 좀비의 정보 객체.
        let data = event.returnValues;
        console.log(
          "거래가 완료되었습니다.",
          data.buyer,
          data.seller,
          data.amount
        );
        updateDB(data.buyer);
      })
      .on("error", console.error);
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;
    const totalCost = gasPrice * gasLimit;
    const value = web3.utils
      .toBN(totalCost)
      .add(web3.utils.toBN(product.price));
    await contract.methods
      .donate(product.seller)
      .send({ from: accounts[0], value: product.price })
      .on("error", function (error) {
        console.error("Transaction Error: ", error);
        setLoading(false);
    });
  }

  async function updateDB(buyer) {
    const res = await axios.post("/api/updateProd", { buyer, id });
    if (res.data.status === 201) {
      setLoading(false);
      history("/");
    } else {
      console.log("error");
    }
  }

  async function buyProduct() {
    if (!active) alert("로그인 후 이용해주세요.");
    else {
      setLoading(true);
      await donateForTransaction();
    }
  }

  if (!product) return <div>로딩중입니다...</div>;
  return (
    <div className="inner">
      {loading ? <Loading /> : null}
      <div id="image-box">
        <img src={`/uploads/${product.img}`} alt="" />
      </div>
      <div id="profile-box">
        <ul>
          <li>책 이름: {product.title}</li>
          <li>가격: {product.price}</li>
          <li>등록일: {moment(product.date).format("DD-MM-YYYY")}</li>
          <li>상세설명: {product.description}</li>
          {product.password.length == 5 ? (
            <>
              <li>Book station 입고 여부: Yes </li>
              <button
                className="button"
                variant="primary"
                type="submit"
                onClick={buyProduct}
              >
                거래하기
              </button>
              <br />
            </>
          ) : (
            <li>Book station 입고 여부: No </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;