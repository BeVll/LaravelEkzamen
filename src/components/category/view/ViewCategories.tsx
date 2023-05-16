import { useFormik } from "formik";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ICategory, ICategoryResponse, ICategorySearch } from "./types";
import * as yup from "yup";
import classNames from "classnames";
import axios from "axios";
import { APP_ENV } from "../../../env";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const ViewCategories = () => {

    const navigator = useNavigate();
    const [items, setItems] = useState<ICategoryResponse>({
        data: [],
        total: 0,
        current_page: 0,
        last_page: 0,
    });
    const [isLoading, setLoading] = useState<boolean>();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log("page = ", searchParams.get("page"));


    const [search, setSearch] = useState<ICategorySearch>({
        page: searchParams.get("page") || 1,
    });

    useEffect(() => {
        setLoading(true);
        axios.get<ICategoryResponse>(
            `${APP_ENV.BASE_URL}/categories`, {
            params: search,
        })
            .then((res) => {
                setLoading(false);
                console.log(isLoading);
                setItems(res.data);
            })

    }, []);

    const { data, last_page, current_page, total } = items;
    const buttons = [];
    for (let i = 1; i <= last_page; i++) {
        buttons.push(i);
    }

    const getItems = (page:any) => {
        setLoading(true);
 
        axios.get<ICategoryResponse>(
            `${APP_ENV.BASE_URL}/categories`, {
            params: page,
        })
            .then((res) => {
                setLoading(false);
                console.log(isLoading);
                setItems(res.data);
            })
    }

    const pagination = buttons.map((page) => (
        
        <li className={classNames("page-item", { "active": page === current_page })}>
            <Link
                className="page-link"
                to={"?page=" + page}
                onClick={ () => {  setSearch({page: page || 1}); getItems({page: page})}}
            >
                {page}

            </Link>
        </li>
    )
    );

    const deleteCategory = (id: number) => {
        console.log(id);
        axios.delete('http://127.0.0.1:8000/api/categories/' + id)
            .then(() => {
                axios.get(
                    "http://127.0.0.1:8000/api/categories")
                    .then((res) => res.data)
                    .then((json) => {
                        setLoading(false);
                        setItems(json);
                    })
            });
    }


    return (

        isLoading ? (
            <div className="loader-container">
                <div className="spinner"></div>
            </div>
        ) : (
            <div className='pageList'>
                <div className='ListColumn'>
                    <div className='tableHeader'>
                        <h2>Categories</h2>
                        <Link to="/Addcategory" className='btn btn-success'>
                            <i className='fa fa-2x fa-plus-circle'></i>
                            <span>Add</span>
                        </Link>
                    </div>
                    <table className="table listCategories">
                        <thead>
                            <tr>
                                <th>
                                    <input type='checkbox' className='form-check-input allCheck'></input>
                                </th>
                                <th>
                                    Id
                                </th>
                                <th>
                                    Image
                                </th>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Description
                                </th>
                                <th>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data ? (

                                items.data.map((item: ICategory) => (
                                    <tr key={item.id}>
                                        <td>
                                            <input type='checkbox' className='form-check-input'></input>
                                        </td>
                                        <td>
                                            {item.id}
                                        </td>
                                        <td>
                                            <img src={'http://bevl.com/storage/images/categories/' + item.image} height={60}></img>
                                        </td>
                                        <td>
                                            {item.name}
                                        </td>
                                        <td>
                                            {item.status == true ? <div className='ok'><span>Activated</span></div> : <div className='no'><span>Not working</span></div>}
                                        </td>
                                        <td>
                                            {item.description}
                                        </td>
                                        <td>
                                            <a onClick={() => deleteCategory(item.id)}><i className='fa fa-trash btnDelete'></i></a>
                                            <Link to={"/Editcategory?id=" + item.id}><i className='fa fa-edit btnEdit'></i></Link>
                                        </td>
                                    </tr>
                                ))

                            )
                                :
                                null}

                        </tbody>
                    </table>
                    <ul className="pagination justify-content-center">{pagination}</ul>
                </div>
            </div>
        )
    );
};
export default ViewCategories;