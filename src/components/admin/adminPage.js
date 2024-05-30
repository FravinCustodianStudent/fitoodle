import {Outlet} from "react-router-dom";
import Header from "../header/header";
import "./formsLib.scss";
import AdminHeader from "../header/adminHeader";
const AdminPage = () =>{
    return(
        <div className="Admin">
            <AdminHeader></AdminHeader>
            <Outlet/>
        </div>
    )
}
export default AdminPage;