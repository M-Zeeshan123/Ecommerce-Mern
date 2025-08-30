import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import ListList from "./pages/listList/ListList";
import List from "./pages/list/List";
import NewList from "./pages/newList/NewList";

function App() {
  const admin = (() => {
    try {
      const persistRoot = localStorage.getItem("persist:root");
      if (!persistRoot) return false;
      
      const user = JSON.parse(persistRoot).user;
      if (!user) return false;
      
      const currentUser = JSON.parse(user).currentUser;
      if (!currentUser) return false;

      // Check both authentication and admin status
      return currentUser.isAdmin === true && currentUser.accessToken;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  })();

  // Redirect to login if not authenticated
  if (!admin && window.location.pathname !== "/login") {
    return <Router><Redirect to="/login" /></Router>;
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          {admin ? <Redirect to="/" /> : <Login />}
        </Route>
        
        {!admin ? (
          <Redirect to="/login" />
        ) : (
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/products">
                  <ProductList />
                </Route>
                <Route exact path="/product/:productId">
                  <Product />
                </Route>
                <Route exact path="/newproduct">
                  <NewProduct />
                </Route>
                <Route exact path="/users">
                  <UserList />
                </Route>
                <Redirect to="/" />
              </Switch>
            </div>
          </>
        )}
      </Switch>
    </Router>
  );
}

export default App;
