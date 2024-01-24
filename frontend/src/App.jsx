import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ItemListContainer from "./components/ItemListContainer/ItemListContainer"
import ItemDetailContainer from "./components/ItemDetailContainer/ItemDetailContainer"
import Register from "./components/Register/register"
import Login from "./components/Login/login"
import NewProducts from './components/Products/NewProducts'
import NavBar from "./components/NavBar/NavBar"
import { CartProvider } from "./context/ContextCart"
import './App.css'


const App = () => {
  return (
    <>
      <BrowserRouter>
        <CartProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<ItemListContainer />} />
            <Route path="/products" element={<ItemListContainer />} />
            <Route path="/products/:category" element={<ItemListContainer />} />
            <Route path="/item/:idItem" element={<ItemDetailContainer />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/newproducts" element={<NewProducts />} />
            <Route path="*" element={<h2>Sitio en Construccion</h2>} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </>
  )
}

export default App
