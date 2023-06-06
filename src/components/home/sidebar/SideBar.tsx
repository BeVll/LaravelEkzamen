import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import MenuItem from './MenuItem';
import { ISidebarProps } from "./types";
import {http} from "../../../http";
import { AuthUserActionType, IAuthUser } from "../../auth/types";
import { Link, useNavigate } from 'react-router-dom';

export default function SideBar(props: ISidebarProps) {

    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
    const navigator = useNavigate();

    const logout = () => {
        delete http.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        dispatch({ type: AuthUserActionType.LOGOUT_USER });
        navigator("/login");
    }
    console.log("is Auth", isAuth);

    const bg = () => {
        return 'http://bevl.com/storage/images/users/' + user?.image;
    }
    return (
        <nav className="main-menu">

            <div className="p-2 d-flex logoBlock">
                <img src="/bevl2.png" alt="" height="50"></img>
            </div>

            <ul className="mt-5 menu">
                <MenuItem name="Dashboard" icon="fa fa-dashboard fa-2x" active={props.page == 1 ? "activeMenu" : ""} link="/"></MenuItem>
                <MenuItem name="Categories" icon="fa fa-th-large fa-2x" active={props.page == 2 ? "activeMenu" : ""} link="/"></MenuItem>
                <MenuItem name="Products" icon="fa fa-shopping-bag fa-2x" active={props.page == 3 ? "activeMenu" : ""} link=""></MenuItem>
            </ul>

            <ul className="logout">
                {isAuth ? (
                    <>

                        <li className="nav-item profile">
                            <a href="#">
                                <div className='iconMenu profileImg' style={{ backgroundImage: `url(${'http://bevl.com/storage/images/users/' + user?.image})` }}>

                                </div>
                                <span className="nav-text email">
                                    {user?.email}
                                </span>
                                {/* <img className='profileImg' src={'http://bevl.com/storage/images/users/' + user?.image}></img> */}
                            </a>
                        </li>
                        <li className="nav-item log">
                            < li >

                                <Link to="/logout" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                }}>
                                    <div className="iconMenu">
                                        <i className="fa fa-power-off fa-2x"></i>
                                    </div>
                                    <span className="nav-text">
                                        Logout
                                    </span>
                                </Link>
                            </li>
                            
                        </li>
                    </>
                ) : (
                    <></>
                )
                }

            </ul>

        </nav >
    );
}
