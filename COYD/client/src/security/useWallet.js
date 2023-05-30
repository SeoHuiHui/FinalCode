import {useWeb3React} from '@web3-react/core';
import {injected} from './Connectors';
import {useEffect} from 'react';
import { useNavigate } from "react-router-dom";

function useWallet() {
   const {account, activate, deactivate, active, library, chainId} = useWeb3React();
   const navigate = useNavigate();

   const connectWallet = async () => {
      try {
         await activate(injected, (error) => {
            console.log(error, 'err');
            // 크롬 익스텐션 없을 경우 오류 핸들링
            if ('/No Ethereum provider was found on window.ethereum/')
               throw new Error('Metamask 익스텐션을 설치해주세요');
         });
         const accounts = await window.ethereum.request({
            method: "eth_accounts",
           });
           if (accounts.length > 0) {
            localStorage.setItem("isConnected", accounts);
           }
           if (accounts.length === undefined) {
            localStorage.removeItem("isConnected");
           }
         
      } catch (err) {
         alert(err);
         window.open('https://metamask.io/download.html');
      }
   };

   const disconnectWallet = async () => {
      try {
         await deactivate();
         localStorage.removeItem("isConnected");
         console.log('로그아웃');
         navigate("/");
      } catch (err) {
         console.log(err);
      }
   };
   
   useEffect(() => {
      if (localStorage.getItem('isConnected') !== null) {
        connectWallet();
      }
     }, []);

   return {
      connectWallet,
      disconnectWallet,
      chainId,
      active,
      account,
      library
   };
}

export default useWallet;