import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Register from "./components/Register/register"
import Login from "./components/Login/login"
import Products from './components/Products/Products'
import NewProducts from './components/Products/NewProducts'
import './App.css'


const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/newproducts" element={<NewProducts/>} />
      <Route path="*" element={ <h2>Sitio en Construccion</h2> } />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App