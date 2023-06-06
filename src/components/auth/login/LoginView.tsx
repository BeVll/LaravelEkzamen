import { Link, useNavigate } from "react-router-dom";
import { ILogin, ILoginResult } from "./types";
import * as yup from "yup";
import { useFormik } from "formik";
import classNames from "classnames";
import {http} from "../../../http";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AuthUserActionType, IUser } from "../types";
import jwtDecode from "jwt-decode";

const LoginView = () => {

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const initValues: ILogin = {
    email: "",
    password: "",
  };
  const [message, setMessage] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>();

  const createSchema = yup.object({
    email: yup
      .string()
      .required("Enter name")
      .email("Wrong email"),
    password: yup.string().required("Enter description"),
  });

  const onSubmitFormikData = async (values: ILogin) => {
    try {
      setLoading(true);
      console.log("Send", values);
      const result = await http.post<ILoginResult>("/auth/login", values);
      const { access_token } = result.data;
      const user = jwtDecode(access_token) as IUser;
      localStorage.token = access_token;
      setMessage("");
      setLoading(false);
      http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
      dispatch({
        type: AuthUserActionType.LOGIN_USER, payload: {
          email: user.email,
          name: user.name
        } as IUser
      });
      navigator("/");
    }
    catch (error) {
      setLoading(false);
      setMessage("Wrong data!");
      console.log("Error", error);
    }
  }

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: createSchema,
    onSubmit: onSubmitFormikData,
  });

  const { values, errors, touched, handleSubmit, handleChange } = formik;

  return (

    isLoading ? (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    ) : (
      <>
        <div className="loginBG">
        </div>
        <div className="loginPage">
          <div className="block">
            <h1 className="text-center">Log in</h1>

            <form onSubmit={handleSubmit}>
              {message && (
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className={classNames("form-control", {
                    "is-invalid": errors.email && touched.email,
                  })}
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email && touched.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={classNames("form-control", {
                    "is-invalid": errors.password && touched.password,
                  })}
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary me-3">
                Login
              </button>
              <Link to="/register" className="btn btn-secondary">
                Sign up
              </Link>
            </form>
          </div>
        </div>

      </>
    )
  );
};
export default LoginView;