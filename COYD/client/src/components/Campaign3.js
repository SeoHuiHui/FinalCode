import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import button from './button.css'
import COYToken from "../abi/COYToken.json";
import Web3 from "web3";
import Loading from './Loading';
import useWallet from '../security/useWallet';
import Modal from './Modal';

const COY_ADDRESS = "0xE7E90F7f8986739950cA1FCBF09Fb2Be971B1673";
const COY_ABI = COYToken.abi;
const ethers = require('ethers');


const Campaign3 = () => {

  const {active} = useWallet();

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [burned, setBurned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  async function connectWallet() {
      if (window.ethereum) {
        try {
          const goalByte = ethers.utils.formatBytes32String(goal)
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);
          const contract = new web3.eth.Contract(COY_ABI, COY_ADDRESS);
          setContract(contract);
          const balance = await contract.methods.balanceOf(accounts[0]).call();
          setBalance(balance);
          const burned = await contract.methods.burnedTokens(goalByte).call();
          setBurned(burned);
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Please install MetaMask to connect to Ethereum network");
      }
    }

    const openModal = () => {
      setModalVisible(true)
    };
    const closeModal = () => {
      setModalVisible(false)
    };
    const goal = "아프리카 기아"

    async function burnTokens() {
      contract.events
        .Burned({ filter: { account: accounts[0] } })
        .on("data", function (event) {
          // 이때의 event는 생성된 좀비의 정보 객체.
          let data = event.returnValues;
          console.log(
            "거래가 완료되었습니다.",
            data.account,
            data.amount,
            data.goal
          );
          setLoading(false);
          alert(`${amount}만큼 ${goal}에 기부되었습니다.`)
        })
        .on("error", console.error);
      const goalByte = ethers.utils.formatBytes32String(goal)
      await contract.methods
          .burn(amount, goalByte).send({ from: accounts[0] })
          .on("error", function (error) {
              console.error("Transaction Error: ", error);
              setLoading(false);
          });
      const balance = await contract.methods.balanceOf(accounts[0]).call();
      setBalance(balance);
      const burned = await contract.methods.burnedTokens(goalByte).call();
      setBurned(burned);
      console.log(goal, burned);
    }

  const connDonate = () => {
      if (!active) {
          alert("로그인 후 이용해주세요.");
          return;
        }
      else {
        openModal();
      }
  };

  const donateOrg = () => {
      if(amount===0) alert("기부하실 금액을 적어주세요.");
      else{
          closeModal();
          setLoading(true);
          burnTokens();
      }
  }

  useEffect(() => {
      connectWallet();
    }, []);

//Organization DB 연결 후, 해당 Organization에서 Token 기부 (소각)
//해당 Organization에 기부한 Token 양 Update
//해당 유저 기부한 Token 양 Update

    return (
      <>
        {loading ? <Loading /> : null}
        <div class="container mt-5">
          <div class="row">
            <div class="col-lg-8">
              <article>
                <header class="mb-4">
                  <h2 class="fw-bolder mb-1">
                    아프리카 기아들에게 도움을 손길을 주세요
                  </h2>
                  <div class="text-muted fst-italic mb-2">
                    모금기간 2023.05.09-2023.06.23
                  </div>
                </header>

                <figure class="mb-4">
                  <img class="img-fluid rounded" src="img/cam3.jpg" alt="..." />
                </figure>

                <section class="mb-5">
                  <p class="fs-5 mb-4"> </p>
                  <p class="fs-5 mb-4">
                    유엔 식량농업기구(FAO)는 분쟁, 기후 위기, 세계 경제 침체에
                    대처해 오면서 아프리카에서 기아를 줄이기 위해 노력해 왔지만
                    기아 인구는 계속 증가하고 있다고 밝혔습니다.{" "}
                  </p>
                  <p class="fs-5 mb-4">
                    유엔 통계에 따르면 2021년에 아프리카의 약 2억 7,800만 명이
                    굶주림에 빠졌으며, 이는 2019년 이후 5,000만 명이 증가한
                    수치입니다.{" "}
                  </p>
                  <p class="fs-5 mb-4">
                    {" "}
                    현재 추세에 따르면 2030년에는 기아 인구가 약 3억 1천만 명을
                    넘어설 것으로 예상됩니다.{" "}
                  </p>
                  <h2 class="fw-bolder mb-4 mt-5">
                    이들에게 우리는 어떤 도움을 줄 수 있을까요?
                  </h2>
                  <p class="fs-5 mb-4">
                    {" "}
                    이러한 영양실조에 시달리고 있는 아프리카 기아들에게 직접적인
                    도움을 줄 수 있습니다. 단 돈 2만원이면 에티오피아 어린이
                    30명에게 고단백 영양식을 선물할 수 있다고 합니다.
                  </p>
                  <p class="fs-5 mb-4">
                    {" "}
                    당신의 기부금으로 아프리카 기아들에게 꿈과 희망을 줄 수
                    있습니다. 후원자님의 사랑으로 영양가 있는 식사를 한 아이들은
                    생존 문제를 넘어 더 큰 꿈을 꾸게 될 것 입니다.
                  </p>
                </section>
              </article>

              <section class="mb-5">
                <div class="card bg-light">
                  <div class="card-body">
                    <form class="mb-4">
                      <textarea
                        class="form-control"
                        rows="3"
                        placeholder="Join the discussion and leave a comment!"
                      ></textarea>
                    </form>
                  </div>
                </div>
              </section>
            </div>

            <div class="col-lg-4">
              <div class="card mb-4">
                <div class="card-header">Categories</div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-sm-6">
                      <ul class="list-unstyled mb-0">
                        <li>아프리카</li>
                        <li>아프리카 기아</li>
                        <li>기아 인구</li>
                      </ul>
                    </div>
                    <div class="col-sm-6">
                      <ul class="list-unstyled mb-0">
                        <li>세계기아지수</li>
                        <li>식량위기</li>
                        <li>긴급구호</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card mb-4">
                <div class="card-header">현재까지 모금된 금액</div>
                <div class="card-body">{burned} COY</div>
                <div class="card-body">목표금액 10000 COY</div>
              </div>

              <button
                className="button"
                type="submit"
                onClick={connDonate}
                style={{ width: "100%" }}
              >
                후원하기
              </button>
            </div>
          </div>
          {modalVisible && (
            <Modal
              className="justify-content-center text-center"
              visible={modalVisible}
              closable={true}
              maskClosable={true}
              onClose={closeModal}
            >
              <h4 style={{ fontWeight: "bold" }}>
                현재 보유량 : {balance} COY
              </h4>
              <p>
                기부하실 금액을 입력해주세요
                <br />
                <br />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: "95%" }}
                />
              </p>
              <div className="justify-content-center mt-4">
                <Button
                  variant="primary"
                  onClick={donateOrg}
                  style={{ marginRight: "10%" }}
                >
                  기부하기
                </Button>
                <Button variant="dark" onClick={closeModal}>
                  닫기
                </Button>
              </div>
            </Modal>
          )}
        </div>
      </>
    );
};

export default Campaign3;