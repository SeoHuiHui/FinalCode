import styled from 'styled-components';
import useWallet from '../security/useWallet';
import React from 'react';

const metamaskIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png?20220831120339';
const ButtonWrapper = styled.div`
   button {
      width: 80%;
      border: 2px solid #1C3B0D;
      border-radius: 8px;
      margin: 20%;
      background-color: white;
      :hover {
         background-color: #E3D697;
      }
      line-height: 0;
      h1 {
         font-weight: bold;
         font-size: 12px;
      }
   }
`;
function ConnectButton() {
   const {connectWallet, active, disconnectWallet} = useWallet();

   return (
         <ButtonWrapper>
            {!active ? (
               <button onClick={connectWallet} type='button'>
                  <img width={20} src={metamaskIcon} alt='icon' />
                  <h1>MetaMask 연결</h1>
               </button>
            ) : (
               <button onClick={disconnectWallet}>
                  <img width={20} src={metamaskIcon} alt='icon' />
                  <h1>MetaMask 해제</h1>
               </button>
            )}
         </ButtonWrapper>
   );
}

export default ConnectButton;