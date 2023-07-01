import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateCategory from './components/category/create/CreateCategory';
import ViewCategories from './components/category/view/ViewCategories';
import EditCategory from './components/category/edit/EditCategory';
import { Provider } from "react-redux";
import { store } from "./store";
import jwtDecode from "jwt-decode";
import { AuthUserActionType, IUser } from "./components/auth/types";
import {http} from "./http";
import LoginView from './components/auth/login/LoginView';
import RegistrationView from './components/auth/registration/RegistrationView';
import ViewProducts from './components/product/view/ViewProducts';
import CreateProduct from './components/product/create/CreateProduct';
import EditProduct from './components/product/edit/EditProduct';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (localStorage.token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
  const user = jwtDecode(localStorage.token) as IUser;
  store.dispatch({
    type: AuthUserActionType.LOGIN_USER, payload: {
      email: user.email,
      name: user.name,
      image: user.image
    } as IUser
  });
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ViewCategories />} />
          <Route path="Addcategory" element={<CreateCategory />} />
          <Route path="Editcategory" element={<EditCategory />} />
          <Route path="login" element={<LoginView />} />
          <Route path="register" element={<RegistrationView />} />
          <Route path="products" element={<ViewProducts />} />
          <Route path="Addproduct" element={<CreateProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
