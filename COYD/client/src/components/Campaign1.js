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


const Campaign1 = () => {

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
    const goal = "시리아 난민"

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
                    시리아 내전에 의해 갈 곳을 잃은 난민 돕기
                  </h2>
                  <div class="text-muted fst-italic mb-2">
                    모금기간 2023.05.09-2023.06.23
                  </div>
                </header>

                <figure class="mb-4">
                  <img class="img-fluid rounded" src="img/cam1.jpg" alt="..." />
                </figure>

                <section class="mb-5">
                            <p class="fs-5 mb-4">레바논과 요르단 지역의 난민 실태 조사 결과, 난민촌 어린이들은 심각한 고독과 불안에 시달리고 있는 것으로 나타났습니다. 가족을 먹여 살리기 위해 가게나 공장에서 허드레 일하는 아이들을 제외하면 거의 대부분이 항시 집안에만 있다는 것입니다.</p>
                            <p class="fs-5 mb-4">특히 주목해야 하는 사실은 전체 응답 아동의 29퍼센트가 일주일에 집 밖으로 나가 보는 횟수가 한 번 이하라고 말했다는 것입니다.  여기서 말하는 집이란 텐트, 움막, 비좁은 아파트 등입니다.</p>
                            <p class="fs-5 mb-4">하지만 무엇보다도 전쟁이 무서운 이유는 한 세대의 어린이 전체가 아무런 정식 교육을 받지 못하고 자라고 있다는 것입니다. 요르단과 레바논으로 피난 온 학령기 시리아 아동 중 학교에 다니고 있는 아이는 그 절반도 되지 않습니다. 레바논의 경우는 올해 말을 기준으로 시리아 학령기 아동 중 학교에 가지 못하는 아이의 수가 20만 명에 이를 것으로 추산되기도 하였습니다.</p>
                            <h2 class="fw-bolder mb-4 mt-5">전쟁으로 인한 또 한 가지 문제</h2>
                            <p class="fs-5 mb-4"> 피난 중에 태어나는 신생아 상당수가 출생 신고조차 되어 있지 않다는 것입니다. 최근 유엔난민기구에서 레바논 지역 출생 신고 실태를 조사한 결과에 따르면 조사 대상 난민 신생아 781명 중, 77퍼센트가 출생 신고 및 출생증명서 발급을 받지 못한 것으로 나타났습니다. 요르단에 위치한 자타리 난민촌의 경우, 2013년 1월에서 10월 중순 사이 태어난 신생아 중 출생증명서를 발급받은 것은 68명에 불과하였습니다.</p>
                            <p class="fs-5 mb-4">시리아 난민 중 어린이만 110만 명이 넘습니다. 이제 이 부끄러운 수치는 단순히 신문의 헤드라인을 장식하는 것을 넘어서 행동의 바탕이 되어야 합니다.

세계 각국의 정부와 여러 구호단체가 위기에 신음하는 어린이들을 구하고자 최선을 다하고는 있지만, 최악의 상황을 벗어나기 위해서는 아직도 많은 노력이 필요합니다. </p>
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
                          시리아
                        </li>
                        <li>
                          시리아 내전
                        </li>
                        <li>
                          난민
                        </li>
                      </ul>
                    </div>
                    <div class="col-sm-6">
                      <ul class="list-unstyled mb-0">
                        <li>
                          튀르키에 지진
                        </li>
                        <li>
                          긴급구호
                        </li>
                        <li>
                          시리아 난민 사태
                        </li>
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
            <h4 style={{fontWeight: 'bold'}}>현재 보유량 : {balance} COY</h4>
            <p>기부하실 금액을 입력해주세요
              <br/><br/>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{width: '95%'}}
            />
            </p>
            <div className="justify-content-center mt-4">
            <Button variant="primary" onClick={donateOrg} style={{marginRight: '10%'}}>
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

export default Campaign1;