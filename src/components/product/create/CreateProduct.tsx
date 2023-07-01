import { useFormik } from "formik";
import React, { useRef, ChangeEvent, FormEvent, useState, useEffect } from "react";
import { ICategory, ICategoryResponse, IProductCreate } from "./types";
import * as yup from "yup";
import classNames from "classnames";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { AuthUserActionType, IAuthUser } from "../../auth/types";
import { useDispatch, useSelector } from "react-redux";
import { formHttp, http } from "../../../http";

import { Editor } from '@tinymce/tinymce-react';

const CreateProduct = () => {
    const editorRef = useRef(null);
    const log = () => {
      if (editorRef.current) {
        console.log(editorRef.current);
      }
    };

    const navigator = useNavigate();
    const [image, setImage] = useState<string>();
    const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
    const [isLoading, setLoading] = useState<boolean>();
    const [list, setCategories] = useState<ICategory[]>([]);
    useEffect(() => {
        if (isAuth == false) {
            navigator("/login");
        }
        else {
            setLoading(true);
            try {
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
    }, []);

    const initValues: IProductCreate = {
        name: "",
        images: [],
        description: "",
        status: true,
        priority: 0,
        price: 0,
        discountPrice: undefined,
        category_id: 0
    };

    const createSchema = yup.object({
        name: yup.string().required("Input name"),
        description: yup.string().required("Input description")
    });


    const onSubmitFormikData = (values: IProductCreate) => {

        console.log(values, "go");
        setLoading(true);
        formHttp.post("/products", values).then(() => {
            // navigator("/");
            // navigator(0);
        });

    }

    const clickSelect = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.addEventListener("change", (e: any) => {
            const files = e.target.files;
            if (files) {
                const file = files[0];
                setFieldValue("images", [...values.images, file]);
                //console.log("Select file ", file);
            }
        });
        input.click();
    }



    const removeImage = (index: number) => {

        var images = values.images;
        images.splice(index, 1);
        setFieldValue("images", images);
        //console.log("Select file ", file);

    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: createSchema,
        onSubmit: onSubmitFormikData
    });


    const { values, errors, touched, handleChange, handleSubmit, setFieldValue } = formik;

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
                            <input type="file" id="selectedFile" className='selectInp' name="img" accept="image/*" ></input>
                            <input type="button" className='btn btn-primary btnSelect' value="Select image" onClick={clickSelect} />
                            {values.images.map((img, index) => (
                                <div className="col-md-3" key={index}>
                                    <div>
                                        <button className="btn btn-danger deleteBtn" onClick={() => removeImage(index)}>X</button>
                                    </div>
                                    <img
                                        className="img-fluid"
                                        src={URL.createObjectURL(img)}
                                        alt="Оберіть фото"
                                        style={{ cursor: "pointer" }}
                                        width={120}

                                    />
                                </div>
                            ))}
                            {errors.images && touched.images && <div className="invalid-feedback">Choose a image</div>}
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
                            <Editor
                                onInit={(evt, editor) => {}}
                                initialValue="<p>This is the initial content of the editor.</p>"
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | ' +
                                        'bold italic backcolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                                onEditorChange={(e) => {
                                    handleChange({ target: { name: 'description', value: e } })
                                }}
                            />
                            <button onClick={log}>Log editor content</button>
                    
                        {/* <textarea
                                className={classNames("form-control", { "is-invalid": errors.description && touched.description })}
                                placeholder="Вкажіть опис"
                                id="description"
                                name="description"
                                style={{ height: "100px" }}
                                value={values.description}
                                onChange={handleChange}
                            ></textarea> */}
                        {errors.description && touched.description && <div className="invalid-feedback">{errors.description}</div>}

                </div>

                <button type="submit" className="btn btn-primary">
                    Add
                </button>
            </form>
                </div >
            </div >
        )
    );
};
export default CreateProduct;