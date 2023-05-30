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


const Campaign2 = () => {

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
    const goal = "강릉 산불피해"

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
                    강릉 산불로 피해를 입은 이재민 돕기
                  </h2>
                  <div class="text-muted fst-italic mb-2">
                    모금기간 2023.05.09-2023.06.23
                  </div>
                </header>

                <figure class="mb-4">
                  <img class="img-fluid rounded" src="img/cam2.jpg" alt="..." />
                </figure>

                <section class="mb-5">
                  <p class="fs-5 mb-4">
                    강릉시는 지난 4월 발생한 산불에 대한 1차 재해조사 결과 모두
                    15개 분야에서 389억 원의 재산 피해가 난 것으로 집계됐다고
                    밝혔습니다.
                  </p>
                  <p class="fs-5 mb-4">
                    {" "}
                    피해 면적은 축구장 530배에 달하는 379ha로 집계됐으며, 주택과
                    숙박업소 등 건물 260여 동이 불에 탔습니다. 1명이 숨지고
                    26명이 다쳤으며 집을 잃은 이재민은 480여 명으로
                    조사됐습니다.
                  </p>
                  <p class="fs-5 mb-4">
                    {" "}
                    이번 산불로 삶의 터전을 잃은 이재민들은 임시대피소에서
                    생활하고 있습니다. 16일 오전 기준으로 집계된 이재민은 총
                    171가구 389명으로 대부분의 이재민은 산불이 발생한 지 엿새가
                    지난 지금도 임시대피소 텐트에서 불편한 생활을 이어가고
                    있습니다.
                  </p>
                  <h2 class="fw-bolder mb-4 mt-5">
                    이재민들의 일상이 되돌아 올 수 있도록
                  </h2>
                  <p class="fs-5 mb-4">
                    갑작스러운 재난으로 어려움을 겪고 있는 이재민과 지역사회에
                    많은 관심과 함께 필요한 생활비를 지원하는데 도움을 주세요.
                  </p>
                  <p class="fs-5 mb-4">
                    모금된 후원금은 식료품, 생필품과 같은 긴급물품 지원 등 산불
                    피해를 입은 이재민들이 일상을 회복하는 데에 필요한 지원비로
                    사용될 예정입니다.
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
                        <li>
                          강릉
                        </li>
                        <li>
                          산불
                        </li>
                        <li>
                          이재민
                        </li>
                      </ul>
                    </div>
                    <div class="col-sm-6">
                      <ul class="list-unstyled mb-0">
                        <li>  
                          생계비 지원
                        </li>
                        <li>
                          긴급구호
                        </li>
                        <li>
                          2023/04/11
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card mb-4">
                <div class="card-header">현재까지 모금된 금액</div>
                <div class="card-body">{burned} COY</div>
                <div class="card-body">목표금액 1000 COY</div>
              </div>

              <button className="button" type="submit" onClick={connDonate} style={{width:"100%"}}>
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

export default Campaign2;