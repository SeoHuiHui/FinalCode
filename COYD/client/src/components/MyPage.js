import React, { useState, useEffect} from 'react';
import COYToken from "../abi/COYToken.json";
import Web3 from "web3";
import Card from 'react-bootstrap/Card';
import moment from "moment";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import button from './button.css'
import Container from 'react-bootstrap/Container';

const COY_ADDRESS = "0xE7E90F7f8986739950cA1FCBF09Fb2Be971B1673";
const COY_ABI = COYToken.abi;

const MyPage = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [sellData, setSellData] = useState([]);
  const [buyData, setBuyData] = useState([]);
  const [show, setShow] = useState(false);

  const getSellData = async () => {
    const res = await axios.get(`/api/sellData/${accounts}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.data.status === 201) {
      console.log("data get");
      setSellData(res.data.data)

    } else {
      console.log("error")
    }

  }

  const getBuyData = async () => {
    const res = await axios.get(`/api/buyData/${accounts}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.data.status === 201) {
      console.log("data get");
      setBuyData(res.data.data)

    } else {
      console.log("error")
    }

  }

  const dltProduct = async (id) => {
    console.log(id)
    const res = await axios.delete(`/api/${id}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (res.data.status === 201) {
      getSellData();
        setShow(true);
    } else {
        console.log("error")
    }
}

  useEffect(() => {
    getSellData();
    getBuyData();
  }, [accounts])

  useEffect(() => {
    connectWallet();
  }, [])

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
        const balance = await contract.methods.balanceOf(accounts[0]).call();
        setBalance(balance);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask to connect to Ethereum network");
    }
  }

  return (
    <Container
      className="mt-3"
      style={{ color: "#1C3B0D", backgroundColor: "white", }}
    >
      <div
        className="justify-content-center text-center"
        style={{ backgroundColor: "#1C3B0D", borderRadius: 10, color: "white", fontWeight: "Bold", padding: "1%"}}
      >
        MY COY Token: {balance} COY
      </div>
      <div>
        <h3 className="text-center mt-4" style={{ fontWeight: 'bold'}}>
          내가 판매한 책
        </h3>
        <div className="d-flex align-iteams-center mt-3"
        style={{flexWrap: 'wrap', gap: '12px', justifyContent: 'space-around'}}>
          {sellData.length > 0
            ? sellData.map((el, i) => {
                return (
                  <>
                    <Card style={{width: "18rem"}}>
                      <Card.Img
                        variant="top"
                        src={`/uploads/${el.img}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          textAlign: "center",
                          margin: "auto",
                        }}
                        className="mt-2"
                      />
                      <Card.Body className="text-center">
                        <Card.Title>
                          Title: {el.title}
                          <br></br>
                          Price: {el.price}
                          <br></br>
                          Date Added : {moment(el.date).format("DD-MM-YYYY")}
                          <br />
                          Description: {el.description}
                          <br />
                          {el.password.length == 4 && (
                            <>
                            <>Password: {el.password}</>
                            <Button
                                variant="danger"
                                onClick={() => dltProduct(el.id)}
                                className="col-lg-6 text-center"
                              >
                                Delete
                              </Button>
                              </>
                          )}
                        </Card.Title>
                        {el.buyer ? (
                          <text style={{color: 'red'}}>이미 판매된 물품입니다.</text>
                        ): (<></>)}
                      </Card.Body>
                    </Card>
                  </>
                );
              })
            : ""}
        </div>
      </div>
      <div>
        <hr style={{border: '1px dotted'}}/>
        <h3 className="text-center mt-4" style={{ fontWeight: 'bold' }}>
          내가 구매한 책
        </h3>
        <div className="d-flex align-iteams-center mt-3"
        style={{flexWrap: 'wrap', gap: '12px', justifyContent: 'space-around'}}>
          {buyData.length > 0
            ? buyData.map((el, i) => {
                return (
                  <>
                    <Card style={{ width: "18rem" }}>
                      <Card.Img
                        variant="top"
                        src={`/uploads/${el.img}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          textAlign: "center",
                          margin: "auto",
                        }}
                        className="mt-2"
                      />
                      <Card.Body className="text-center">
                        <Card.Title>
                          Title: {el.title}
                          <br></br>
                          Price: {el.price}
                          <br></br>
                          Date Added : {moment(el.date).format("DD-MM-YYYY")}
                          <br />
                          Description: {el.description}
                          <br />
                          {el.password.length == 5 && (
                            <div>Password: {el.password}</div>
                          )}
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </>
                );
              })
            : ""}
        </div>
      </div>
      <div
        className="justify-content-center text-center mt-3"
        style={{ backgroundColor: "#1C3B0D", borderRadius: 10, color: "#E3D697", text: "Bold", padding: "1%"}}
      >
        현재 로그인 된 지갑: {accounts.length > 0 ? accounts[0] : "Not connected"}
      </div>
    </Container>
  );
};

export default MyPage;