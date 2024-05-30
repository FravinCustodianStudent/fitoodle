import {useState} from "react";
import {useHttp} from "../../../hooks/http.hook";

const AdminGroupItem = ({item,Groups,setGroups}) =>{
    const {DELETE} = useHttp();
    const toRender = (studetsIds) =>{
        let str = "";
        for (let i = 0; i < studetsIds.length; i++) {
            str =str+ studetsIds[i].toString()+"\n";
        }
        return str;
    }
    const onDelete = (id) =>{
        DELETE({},`groupresource/groups/${id}`,{"Authorization": localStorage.getItem("jwt")})
            .then((res)=>{
                console.log(res)
                setGroups(Groups.filter(res=>res.id!==id))
            })
    }
    return(
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.enterYear}</td>
            <td>{item.endYear}</td>
            <td>{item.name}</td>
            <td>{toRender(item.students)}</td>
            <td><button disabled={item.id==="50bf28e0-c8eb-45fa-b5f3-0ab5d799a680"}  onClick={()=>onDelete(item.id)}><span className="text">Delete</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button></td>
        </tr>
    )
}
export default AdminGroupItem;