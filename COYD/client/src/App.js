import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import ProductDetail from './components/ProductDetail';
import MyPage from './components/MyPage';
import DonatePage from "./components/DonatePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from "react-router-dom";
import Campaign1 from './components/Campaign1';
import Campaign2 from './components/Campaign2';
import Campaign3 from './components/Campaign3';

function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path = '/' element = {<Home />} />
      <Route path = '/register' element = {<Register />} />
      <Route path = '/donate' element = {<DonatePage />} />
      <Route path = '/product/:id' element = {<ProductDetail />} />
      <Route path = '/myPage' element = {<MyPage/>} />
      <Route path = '/campaign1' element = {<Campaign1/>} />
      <Route path = '/campaign2' element = {<Campaign2/>} />
      <Route path = '/campaign3' element = {<Campaign3/>} />
    </Routes>
    </>
  );
}

export default App;
