import Header from "../header/header";
import {Outlet} from "react-router-dom";


const Layout = () => {
    return(
        <div className="app">
            <Header></Header>
            <Outlet/>
        </div>
    )
}
export default Layout;