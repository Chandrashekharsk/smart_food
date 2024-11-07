import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home'; 
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { CreateRecipe } from './pages/CreateRecipe'; 
import Nav from './components/Nav';
import Details from './components/Details';
import {ToastContainer} from "react-toastify";
import GlobalState from './context';
import FavouriteRecipesList from "./pages/FavouriteRecipesList";
import Footer from "./components/Footer";
import { EditPost } from "./components/EditPost";
import LikedRecipesList from "./pages/LikedRecipesList";
import Contact from "./pages/Contact";


function App() {
  return (
    <>
      <div className='App'>
        
        <Router>
          <GlobalState>
          <Nav/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/liked-posts" element={<LikedRecipesList/>} />
            <Route path="/recipe-item/:id" element={<Details/>} />
            <Route path="/edit-post/:id" element={<EditPost/>} />
            <Route path="/create-recipe" element={<CreateRecipe/>} />
            <Route path="/favorites" element={<FavouriteRecipesList/>} />
          </Routes>
          <Footer/>
          <ToastContainer/>
          </GlobalState>
        </Router>
      </div>
    </>
  );
}

export default App;
