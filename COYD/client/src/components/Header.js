import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useWallet from '../security/useWallet';
import ConnectButton from './ConnectButton';

const Header = () => {
  const {active} = useWallet();

    return (
      <>
        <Navbar variant="dark" style={{backgroundColor: "#1C3B0D"}}>
          <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/donate">Donate</Nav.Link>
            </Nav>
            {active && (
              <Nav className="me-right">
                <Nav.Link href="/myPage">MyPage</Nav.Link>
              </Nav>
            )}
            <ConnectButton />
          </Container>
        </Navbar>
      </>
    );
}

export default Header;