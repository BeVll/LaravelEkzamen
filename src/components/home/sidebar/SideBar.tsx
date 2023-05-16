import MenuItem from "./MenuItem";


const Sidebar = () => {

    return (
        <nav className="main-menu">

            <div className="p-2 d-flex logoBlock">
                <img src="/bevl2.png" alt="" height="50"></img>
            </div>

            <ul className="mt-5 menu">
   
                <MenuItem name="Dashboard" icon="fa fa-dashboard fa-2x" active="activeMenu" link="/"></MenuItem>
                <MenuItem name="Categories" icon="fa fa-th-large fa-2x" active="" link="/List"></MenuItem>
                <MenuItem name="Products" icon="fa fa-shopping-bag fa-2x" active="" link=""></MenuItem>
            </ul>

            <ul className="logout">
                <li>
                    <a href="#">
                        <div className="iconMenu">
                            <i className="fa fa-power-off fa-2x"></i>
                        </div>
                        <span className="nav-text">
                            Logout
                        </span>
                    </a>
                </li>
            </ul>

        </nav>
    );
};
export default Sidebar;