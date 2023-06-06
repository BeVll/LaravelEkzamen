import { useNavigate } from "react-router-dom";
import { IRegistration, IRegistrationResult } from "./types";
import * as yup from "yup";
import { useFormik } from "formik";
import classNames from "classnames";
import {formHttp} from "../../../http";
import { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { AuthUserActionType, IUser } from "../types";
import jwtDecode from "jwt-decode";

const RegistrationView = () => {

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const initValues: IRegistration = {
    email: "",
    image: undefined,
    name: "",
    lastName: "",
    phone: "",
    password: "",
    password_confirmation: ""

  };
  const [message, setMessage] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>();
  const [image, setImage] = useState<string>();

  const createSchema = yup.object({
    email: yup
      .string()
      .required("Enter name")
      .email("Wrong email"),

    password: yup.string().required("Enter password"),
    password_confirmation: yup.string().required("Confirm password").oneOf([yup.ref('password'), ""], 'Passwords must match'),
    image: yup.mixed().required("Choose image"),
    name: yup.string().required("Enter Firstname").min(2),
    lastName: yup.string().required("Enter Lastname").min(2),
    phone: yup.string().required("Enter Lastname").min(9),
  });

  const clickSelect = () => {
    const myElement = document.getElementById("selectedFile") as HTMLInputElement;
    myElement.click();
    console.log(myElement);
  }

  const changeImage = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files) {
      console.log("set");
      formik.setFieldValue("image", event.target.files[0]);
      values.image = event.target.files[0];
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  const onSubmitFormikData = async (values: IRegistration) => {
    try {
      setLoading(true);
      console.log("Send", values);

      const result = await formHttp.post<IRegistrationResult>("/auth/register", values);
    
      navigator("/login");
    }
    catch (error) {
      setMessage("Wrong data!");
      console.log("Error", error);
    }
  }

  const validateConfirmPassword = (pass: string, value: string) => {

    let error = "";
    if (pass && value) {
      if (pass !== value) {
        error = "Password not matched";
      }
    }
    return error;
  };

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
            <h1 className="text-center">Sign up</h1>

            <form onSubmit={handleSubmit}>
              {message && (
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
              <div className="mb-2">
                <input type="file" id="selectedFile" className='selectInp' name="img" accept="image/*" onChange={changeImage}></input>
                <input type="button" className='btn btn-primary btnSelect' value="Select image" onClick={clickSelect} />
                <img className='selectedImg' src={image} height={100}></img>
                {values.image === undefined ? (
                  <div className="img">Choose image</div>
                ):<></>}
              </div>
              
              <div className="mb-2">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
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
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Firstname
                </label>
                <input
                  type="text"
                  className={classNames("form-control", {
                    "is-invalid": errors.name && touched.name,
                  })}
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
                {errors.name && touched.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
              <div className="mb-2">
                <label htmlFor="lastName" className="form-label">
                  Lastname
                </label>
                <input
                  type="text"
                  className={classNames("form-control", {
                    "is-invalid": errors.lastName && touched.lastName,
                  })}
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && touched.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>
              <div className="mb-2">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className={classNames("form-control", {
                    "is-invalid": errors.phone && touched.phone,
                  })}
                  id="phone"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                />
                {errors.phone && touched.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>
              <div className="mb-2">
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
              <div className="mb-2">
                <label htmlFor="password_confirmation" className="form-label">
                  Password Confirmation
                </label>
                <input
                  type="password"
                  className={classNames("form-control", {
                    "is-invalid": errors.password_confirmation && touched.password_confirmation,
                  })}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={values.password_confirmation}
                  onChange={handleChange}

                />
                {errors.password_confirmation && touched.password_confirmation && (
                  <div className="invalid-feedback">{errors.password_confirmation}</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Sign up
              </button>
            </form>
          </div>
        </div>

      </>
    )
  );
};
export default RegistrationView;