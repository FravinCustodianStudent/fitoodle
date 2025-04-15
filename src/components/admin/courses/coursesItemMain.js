import {useHttp} from "../../../hooks/http.hook";
import {useState} from "react";


const CoursesItemMain = ({item,Course,setCourse}) =>{
    const {DELETE} = useHttp();
    const toRender = (studetsIds) =>{
        let str = "";
        for (let i = 0; i < studetsIds.length; i++) {
            str =str+ studetsIds[i].toString()+"\n";
        }
        return str;
    }
    const onDelete = (id) =>{
        DELETE({},`courseresource/courses/${id}`)
            .then((res)=>{
                console.log(res)
                    setCourse(Course.filter(res=>res.id!==id))
            })
    }
    const renderItem = (arr) =>{
        let str = ""
        for (let i = 0; i < arr.length; i++) {
            str = str +" {"+arr[i] + "}";
        }
        return str;
    }

    return(<tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.teacherId}</td>
        <td>{renderItem(item.targetGroups)}</td>
        <td><button disabled={item.id==="2df50cc5-2a4d-470f-b4ef-50aadd4c7d00"}  onClick={()=>onDelete(item.id)}><span className="text">Delete</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button></td>
    </tr>)
}
export default CoursesItemMain;