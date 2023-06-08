import { useFormik } from "formik";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IProductEdit, ICategory } from "./types";
import * as yup from "yup";
import classNames from "classnames";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { AuthUserActionType, IAuthUser } from "../../auth/types";
import { useDispatch, useSelector } from "react-redux";
import { APP_ENV } from "../../../env";
import { http, formHttp } from "../../../http";

const EditProduct = () => {

    const navigator = useNavigate();
    const [image, setImage] = useState<string>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setLoading] = useState<boolean>();
    const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
    const [list, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        console.log(isAuth);
        if (isAuth == false) {
            navigator("/login");
        }
        else {
            getProduct();
        }

    }, []);

    const getProduct = () => {
        console.log("id: " + searchParams.get('id'));
        http.get('/product/' + searchParams.get('id'))
            .then((res) => res.data)
            .then(async (json) => {
                setLoading(false);
                setImage("http://bevl.com/storage/images/products/" + json.image)

                if (json.status == 1)
                    json.status = true;
                else if (json.status == 0)
                    json.status = false;
                formik.setValues(json);
                console.log("values ", values);

            })
        try {
            setLoading(true);
            http.get<ICategory[]>(
                `/categoriesAll`, {
            })
                .then((res) => {
                    if (res != undefined) {
                        setLoading(false);
                        console.log(res.data);
                        setCategories(res.data);
                    }

                })
        }
        catch (error) {
            console.log("Error", error);
        }

    }

    const initValues: IProductEdit = {
        name: "",
        image: new File(["fs"], "", {
            type: "text/plain"
        }),
        description: "",
        status: true,
        priority: 0,
        price: 0,
        discountPrice: undefined,
        category_id: 0,
        imgChange: false
    };

    const createSchema = yup.object({
        name: yup.string().required("Input name"),
        image: yup.mixed().required("Choose image"),
        description: yup.string().required("Input description"),
    });


    const onSubmitFormikData = (values: IProductEdit) => {
        var check = "0";
        if (values.status)
            check = "1";
        console.log("Check", values.status);
        const data = new FormData()
        console.log(values.image);
        data.append('image', values.image);
        data.append('name', values.name);
        data.append('status', check);
        data.append('description', values.description);
        data.append('priority', values.priority.toString());
        data.append('price', values.price.toString());
        if(values.discountPrice == undefined){
            data.append('discountPrice', "");
        }
        else{
            data.append('discountPrice', values.discountPrice.toString());
        }
        data.append('category_id', values.category_id.toString());

        console.log(values.image);
        setLoading(true);
        var check = "false";
        if (values.imgChange)
            check = "true";
        formHttp.post("/product/" + searchParams.get("id") + "/" + check, data).then(() => {
            navigator("/products");
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
            console.log(values);
            values.image = event.target.files[0];
            setImage(URL.createObjectURL(event.target.files[0]));
            formik.setFieldValue("imgChange", true);
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
                        <h2>Edit category</h2>

                        <Link to="/List" className='btn btn-success'>

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
                            Save
                        </button>
                    </form>
                </div>

            </div>
        )
    );
};
export default EditProduct;