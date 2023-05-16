import { Link } from "react-router-dom";
import { IMenuProps } from "./types";

const MenuItem = (props:IMenuProps) => {

    return (
        <li className="has-subnav">
        
        <Link to={props.link}  className={props.active} >
    
                <div className="iconMenu">
                    <i className={props.icon}></i>
                </div>
                <span className="nav-text">
                    {props.name}
                </span>
         
        </Link>
    </li>
    );
};
export default MenuItem;