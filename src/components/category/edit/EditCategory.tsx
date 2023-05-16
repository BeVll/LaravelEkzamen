import { useFormik } from "formik";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ICategoryEdit } from "./types";
import * as yup from "yup";
import classNames from "classnames";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const EditCategory = () => {

    const navigator = useNavigate();
    const [image, setImage] = useState<string>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setLoading] = useState<boolean>();

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = () => {
        console.log("id: " + searchParams.get('id'));
        axios.get('http://127.0.0.1:8000/api/category/' + searchParams.get('id'))
            .then((res) => res.data)
            .then(async (json) => {
                setLoading(false);
                setImage("http://127.0.0.1:8000/storage/images/categories/" + json.image)

                if (json.status == 1)
                    json.status = true;
                else if (json.status == 0)
                    json.status = false;
                formik.setValues(json);
                console.log("values ", values);

            })


    }

    const initValues: ICategoryEdit = {
        name: "",
        image: new File(["fs"], "", {
            type: "text/plain"
        }),
        description: "",
        status: true,
        imgChange: false
    };

    const createSchema = yup.object({
        name: yup.string().required("Input name"),
        image: yup.mixed().required("Choose image"),
        description: yup.string().required("Input description"),
    });


    const onSubmitFormikData = (values: ICategoryEdit) => {
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
        console.log(values.image);
        axios.post("http://127.0.0.1:8000/api/category/" + searchParams.get("id"), data).then(() => {
            // navigator("/List");
            // navigator(0);
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
            formik.setFieldValue("imgChange", true);
        }
    }

    const { values, errors, touched, handleSubmit, handleChange } = formik;

    return (
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
                        {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="mb-3 form-check form-switch">

                        <input type="checkbox" className="form-check-input" onChange={handleChange} checked={values.status} id="status">

                        </input>
                        <label htmlFor="status" className="form-label">Status</label>
                    </div>
                    <div className=" mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className={classNames("form-control", { "is-invalid": errors.description && touched.description })}

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
    );
};
export default EditCategory;