import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom"
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import moment from "moment"
import Alert from 'react-bootstrap/Alert';
import useWallet from '../security/useWallet';
import button from './button.css';
import Carousel from 'react-bootstrap/Carousel';
import ListGroup from 'react-bootstrap/ListGroup';
import "./Home.scss"

const Home = () => {

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const { active } = useWallet();

  const columnsPerRow = 4;

const getProductData = async () => {
    const res = await axios.get("/api/getdata", {
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (res.data.status === 201) {
        console.log("data get");
        setData(res.data.data)
    } else {
        console.log("error")
    }        
}

useEffect(() => {
  getProductData()
}, [])

return (
  <>
    {show ? (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        Product Delete
      </Alert>
    ) : (
      ""
    )}

    <header class="py-2 mb-4" style={{ backgroundColor: "#1C3B0D", color: "#E3D697" }}>
      <div class="container px-5">
        <div class="row gx-5 align-items-center justify-content-center">
          <div class="col-lg-8 col-xl-7 col-xxl-6">
            <div class="my-5 text-center text-xl-start">
              <h1 class="display-5 fw-bolder mb-2">COYD</h1>
              <h1 class="display-5 fw-bolder mb-2">
                Blockchain donation
              </h1>
              <p class="lead fw-normal text-white-50 mb-4">
                보다 믿을 수 있는 기부문화에 앞장서는 블록체인 기부 플랫폼
              </p>
              <div class="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                <a class="btn btn-outline-light btn-lg px-4" href="#Campaign">
                  Campaign
                </a>
                <a class="btn btn-outline-light btn-lg px-4" href="#Book">
                  Book
                </a>
                {active && (
                  <div class="btn btn-light btn-lg px-4">
                    <NavLink
                      to="/register"
                      className="text-decoration-none text-dark"
                    >
                      Upload Book
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
            <img
              class="img-fluid rounded-3 my-5"
              src="img/logo.png"
              alt="..."
            />
          </div>
        </div>
      </div>
    </header>
    <div className="container mt-2">
      <section id="Book">
        <div class="text-center">
          <h2 class="fw-bolder">기증된 책</h2>
          <p class="lead fw-normal text-muted mb-5">
            업로드된 책을 보고 필요한 책이 있다면 입고여부를 확인하고
            거래하세요.
          </p>
        </div>
        <div className="image-list-container">
          {data.length > 0
            ? data.map((el, i) => {
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
                          marginTop: "5%"
                        }}
                      />

                      <Card.Body className="text-center">
                        <Card.Title>Title: {el.title} </Card.Title>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>Price: {el.price}</ListGroup.Item>
                          <ListGroup.Item>
                            {" "}
                            {el.password.length == 5 ? (
                              <div>입고 완료</div>
                            ) : (
                              <div>입고 대기중</div>
                            )}
                          </ListGroup.Item>
                        </ListGroup>
                        <button className="button">
                          <NavLink
                            to={`/product/${el.id}`}
                            className="text-decoration-none text-light"
                          >
                            description
                          </NavLink>
                        </button>
                        {/* <Button variant="danger" onClick={() => dltProduct(el.id)} className='col-lg-6 text-center'>Delete</Button> */}
                      </Card.Body>
                    </Card>
                  </>
                );
              })
            : ""}
        </div>
      </section>
    </div>
      <section className="mt-5" id="Campaign">
        <div className="div1">
          <div class="text-center container pt-3 pb-5">
            <h2 class="fw-bolder">캠페인</h2>
            <p class="lead fw-normal text-muted mb-5">
              당신의 도움이 필요한 곳에 도움의 손길을 건네세요.{" "}
            </p>
            <div id="campaign-image">
              <Carousel>
                <Carousel.Item>
                  <NavLink to="/campaign1">
                    <img src="img/cam1.jpg" alt="시리아 난민" />
                  </NavLink>
                  <Carousel.Caption>
                    {/* <h3>시리아 난민</h3> */}
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <NavLink to="/campaign2">
                    <img src="img/cam2.jpg" alt="강릉 산불" />
                  </NavLink>

                  <Carousel.Caption>
                    {/* <h3>강릉 산불</h3> */}
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <NavLink to="/campaign3">
                    <img src="img/cam3.jpg" alt="아프리카 기아" />
                  </NavLink>

                  <Carousel.Caption>
                    {/* <h3>아프리카 기아</h3> */}
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </section>
  </>
);
}

export default Home;