import { useFormik } from "formik";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { ICategory, ICategoryResponse, IProductCreate } from "./types";
import * as yup from "yup";
import classNames from "classnames";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { AuthUserActionType, IAuthUser } from "../../auth/types";
import { useDispatch, useSelector } from "react-redux";
import {formHttp, http} from "../../../http";

const CreateProduct = () => {

    const navigator = useNavigate();
    const [image, setImage] = useState<string>();
    const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
    const [isLoading, setLoading] = useState<boolean>();
    const [list, setCategories] = useState<ICategory[]>([]);
    useEffect(() => {
        if (isAuth == false) {
            navigator("/login");
        }
        else{
            setLoading(true);
            try{
                http.get<ICategory[]>(
                    `/categoriesAll`, {
                })
                    .then((res) => {
                        if(res != undefined){
                            setLoading(false);
                            console.log(res.data);
                            setCategories(res.data);
                        }
                        
                    })
            }
            catch(error){
                console.log("Error", error);
            }
        }
    }, []);

    const initValues: IProductCreate = {
        name: "",
        image: new File(["fs"], "", {
            type: "text/plain"
        }),
        description: "",
        status: true,
        priority: 0,
        price: 0,
        discountPrice: undefined,
        category_id: 0
    };

    const createSchema = yup.object({
        name: yup.string().required("Input name"),
        image: yup.mixed().required("Choose image"),
        description: yup.string().required("Input description"),
    });


    const onSubmitFormikData = (values: IProductCreate) => {
        console.log(values);
        setLoading(true);
        formHttp.post("/products", values).then(() => {
            navigator("/");
            navigator(0);
        });

    }

    const clickSelect = () => {

        const myElement = document.getElementById("selectedFile") as HTMLInputElement;
        myElement.click();
        console.log(myElement);
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: createSchema,
        onSubmit: onSubmitFormikData
    });

    const changeImage = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files);
        if (event.target.files) {
            console.log("set");
            formik.setFieldValue("image", event.target.files[0]);
            values.image = event.target.files[0];
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    const { values, errors, touched, handleSubmit, handleChange } = formik;

    return (
        isLoading ? (
            <div className="loader-container">
                <div className="spinner"></div>
            </div>
        ) : (
            <div className='pageList'>
                <div className='ListColumn'>
                    <div className='tableHeader'>
                        <h2>Add product</h2>

                        <Link to="/products" className='btn btn-success'>

                            <i className='fa fa-2x fa-chevron-circle-left '></i>
                            <span>Back</span>
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className={classNames("form-control", { "is-invalid": errors.name && touched.name })}
                                id="name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />
                            {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}

                        </div>
                        <div className="mb-3">
                            <input type="file" id="selectedFile" className='selectInp' name="img" accept="image/*" onChange={changeImage}></input>
                            <input type="button" className='btn btn-primary btnSelect' value="Select image" onClick={clickSelect} />
                            <img className='selectedImg' src={image} height={100}></img>
                            {errors.image && touched.image && <div className="invalid-feedback">Choose a image</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Prority</label>
                            <input
                                type="text"
                                className={classNames("form-control", { "is-invalid": errors.priority && touched.priority })}
                                id="priority"
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                            />
                            {errors.priority && touched.priority && <div className="invalid-feedback">{errors.priority}</div>}

                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Price</label>
                            <input
                                type="text"
                                className={classNames("form-control", { "is-invalid": errors.price && touched.price })}
                                id="price"
                                name="price"
                                value={values.price}
                                onChange={handleChange}
                            />
                            {errors.price && touched.price && <div className="invalid-feedback">{errors.price}</div>}

                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Discount Price</label>
                            <input
                                type="text"
                                className={classNames("form-control", { "is-invalid": errors.discountPrice && touched.discountPrice })}
                                id="discountPrice"
                                name="discountPrice"
                                value={values.discountPrice}
                                onChange={handleChange}
                            />
                            {errors.discountPrice && touched.discountPrice && <div className="invalid-feedback">{errors.discountPrice}</div>}

                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Category</label>
                            <select className="form-select" aria-label="Default select example" id="category_id" name="category_id" value={values.category_id} onChange={handleChange}>
                                <option >None</option>
                                {list.map(item => {
                                    return (
                                        <option value={item.id}>{item.id} - {item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                className={classNames("form-control", { "is-invalid": errors.description && touched.description })}
                                placeholder="Вкажіть опис"
                                id="description"
                                name="description"
                                style={{ height: "100px" }}
                                value={values.description}
                                onChange={handleChange}
                            ></textarea>
                            {errors.description && touched.description && <div className="invalid-feedback">{errors.description}</div>}

                        </div>

                        <button type="submit" className="btn btn-primary">
                            Add
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};
export default CreateProduct;