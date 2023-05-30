import React, { useState, useEffect }  from 'react';
import Button from 'react-bootstrap/Button';
import COYToken from "../abi/COYToken.json";
import Web3 from "web3";
import useWallet from '../security/useWallet';
import Loading from './Loading';
import Modal from './Modal';
import Container from 'react-bootstrap/esm/Container';
import "./Home.scss";
import "./button.css";

const COY_ADDRESS = "0xE7E90F7f8986739950cA1FCBF09Fb2Be971B1673";
const COY_ABI = COYToken.abi;

const DonatePage = () => {

  const {active} = useWallet();

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true)
  };
  const closeModal = () => {
    setModalVisible(false)
  };

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

  async function justDonate(){
    contract.events
          .Donated({ filter: { donater: accounts[0] } })
          .on("data", function (event) {
            // 이때의 event는 생성된 좀비의 정보 객체.
            let data = event.returnValues;
            console.log(
              "거래가 완료되었습니다.",
              data.donater,
              data.amount
            );
            setLoading(false);
          })
          .on("error", console.error);
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;
    const totalCost = gasPrice * gasLimit;
    const value = web3.utils.toBN(totalCost).add(web3.utils.toBN(amount));
    await contract.methods
      .justDonate().send({ from: accounts[0], value: amount })
      .on("error", function (error) {
        console.error("Transaction Error: ", error);
        setLoading(false);
    });
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    setBalance(balance);
  }

  const getCOYToken = () => {
    if(amount==0) alert("기부하실 금액을 적어주세요.");
    else {
      closeModal();
      setLoading(true);
      justDonate();
    }
};

useEffect(function(){
  connectWallet();
}, [])

const connDonate = () => {
  if (!active) {
      alert("로그인 후 이용해주세요.");
      return;
    }
  else {
    openModal();
  }
};

    return (
      <Container className="mt-2 p-3"
      style={{ color: "#1C3B0D", backgroundColor: "#E3D697", borderRadius: 10}}>
        {loading ? <Loading/> : null}
        <h3 className="text-center mt-4" style={{ padding: 8, fontWeight: 'bold'}}>
          COY Token이 바꿔나갈 세상을 아시나요?
        </h3>
        <Button variant="dark" type="submit" onClick={connDonate}>
          COY Token 구매하기
        </Button>
        <section class="showcase m-3">
            <div class="container-fluid p-0" id = "donation-image">
                <div class="row g-0" >
                    <div class="col-lg-6 order-lg-2 text-white showcase-img"><img  src="img/don1.jpg" alt="..." /></div>
                    <div class="col-lg-6 order-lg-1 my-auto showcase-text">
                        <h2>믿을 수 있는 기부</h2>
                        <p class="lead mb-0">COYD는 블록체인을 활용한 기부 시스템입니다.</p>
                        <p class="lead mb-0"> COYD에 모인 기부금은 모두 블록체인에 의해 기록되고 관리되어 기부한 여러분들이 기부 과정과 내역을 직접 확인할 수 있습니다.</p>
                        <p class="lead mb-0">SMART CONTRACT에 의해서만 모금, 사용되는 과정을 통해 여러분과 신뢰 관계를 만들어 가겠습니다.</p>
                    </div>
                </div>
                <div class="row g-0">
                    <div class="col-lg-6 text-white showcase-img" ><img  src="img/don2.jpg" alt="..." /></div>
                    <div class="col-lg-6 my-auto showcase-text">
                        <h2>보다 쉬운 기부</h2>
                        <p class="lead mb-0">여러분들은 책을 통해 기부할 수 있습니다!</p>
                        <p class="lead mb-0"> 저희의 최종 목표는 활발한 기부 문화를 형성하고자 함에 있습니다. 기부 의지를 보다 쉽게 다질 수 있는, '현금' 뿐만 아니라 '중고 책 거래' 방식으로 기부를 가능케 함으로써 기부 시장을 활성화하고자 합니다.</p>
                    </div>
                </div>
                <div class="row g-0">
                    <div class="col-lg-6 order-lg-2 text-white showcase-img" ><img  src="img/don3.jpg" alt="..." /></div>
                    <div class="col-lg-6 order-lg-1 my-auto showcase-text">
                        <h2>관심 분야에 더 많은 기부 지분 투표</h2>
                        <p class="lead mb-0">여러분은 각자의 관심 분야에 더 많은 기부 지분을 행사할 수 있습니다.</p>
                        <p class="lead mb-0">여러분은 기부 증서의 의미로 발급된 COY Token을 발급받게 되고, 이 토큰을 사용하여 기부하고 싶은 분야를 선택하여 의견을 낼 수 있습니다.</p>
                        <p class="lead mb-0">기부에 대한 여러분의 주장이 활발한 기부시장을 형성하는 데 앞장설거에요!</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="testimonials text-center">
            <div class="container">
                <h2 class="mb-5">COYD를 만든 사람들</h2>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="testimonial-item mx-auto mb-5 mb-lg-0">
                            <img class="img-fluid rounded-circle mb-3" src="img/kim.png" alt="..." />
                            <h5>김예빈</h5>
                            <p class="font-weight-light mb-0">"공학으로 세상을 바꾸고 싶었습니다."</p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="testimonial-item mx-auto mb-5 mb-lg-0">
                            <img class="img-fluid rounded-circle mb-3" src="img/oh.png" alt="..." />
                            <h5>오서의</h5>
                            <p class="font-weight-light mb-0">"COYD가 만들어나갈 기부 문화의 한 페이지가 되고 싶지 않으신가요?"</p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="testimonial-item mx-auto mb-5 mb-lg-0">
                            <img class="img-fluid rounded-circle mb-3" src="img/choi.jpg" alt="..." />
                            <h5>최서희</h5>
                            <p class="font-weight-light mb-0">"블록체인으로 기부해야 기부 효율이 올라가는 편입니다."</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {modalVisible && (
            <Modal
              className="justify-content-center text-center"
              visible={modalVisible}
              closable={true}
              maskClosable={true}
              onClose={closeModal}
            >
              <h4 style={{fontWeight: 'bold'}}>현재 보유량 : {balance} COY</h4>
              <p>구매하실 COY Token 수량을 입력해주세요
                <br/><br/>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{width: '95%'}}
              />
              </p>
              <div className="justify-content-center mt-4">
              <Button variant="primary" onClick={getCOYToken} style={{marginRight: '10%'}}>
                충전하기
              </Button>
              <Button variant="dark" onClick={closeModal}>
                닫기
              </Button>
              </div>
            </Modal>
          )}
      </Container>
    );
};

export default DonatePage;