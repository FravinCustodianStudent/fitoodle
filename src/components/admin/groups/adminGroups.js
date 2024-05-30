import "./adminGroups.scss";
import {useEffect, useState} from "react";
import {useHttp} from "../../../hooks/http.hook";
import {Oval} from "react-loader-spinner";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import AdminGroupItem from "./adminGroupItem";

const schema = yup.object().shape({
    enterYear: yup.number().required().positive().integer().min(2000),
    endYear: yup.number().required().positive().integer().min(2004),
    name: yup.string().required(),
    students: yup.array().of(yup.object().required()).min(1, 'Select at least one student')
});
const AdminGroups = () =>{
    const {GET,POST} = useHttp();
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const [users, setUsers] = useState([
        { id: '3b6df8d7-7add-4eae-9e18-4a2803c4fc13', name: 'User 1' },
        // Добавьте здесь больше пользователей
    ]);
    const userOptions = users.map(user => ({
        value: user.userId,
        label: (user.firstName+" "+user.lastName)
    }));
    const onSubmit = data => {
        const dateToUpload = {
            endYear: data.endYear,
            enterYear:data.enterYear,
            name:data.name,
            students:(data.students.map(user=> user.value)),
        }
        console.log(dateToUpload)
        POST({},"groupresource/groups",{"Authorization": localStorage.getItem("jwt")},dateToUpload)
            .then((res)=>{
                setGroups([...Groups,res.data])
            })
        console.log(data);
        // Здесь можно сделать что-то с данными, например отправить их на сервер
    };
    const [Groups, setGroups] = useState();
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        GET(null,"groupresource/groups/all",{"Authorization": localStorage.getItem("jwt")})
            .then((res)=>{
                setGroups(res.data);
                console.log(res)
                setLoading(false);
                GET(null,"userdataresource/users",{"Authorization": localStorage.getItem("jwt")})
                    .then((result)=>{
                        setUsers(result.data)
                    });
            })
    }, []);

    const renderItems = arr =>{
        const items = arr.map((item, i) =>{
            return(
                <>{<AdminGroupItem item={item} Groups={Groups} setGroups={setGroups} />}</>
            )
        })
        return(items)
    }
    return(
        <>
            {Loading?<div className="oval__loader"><Oval
                visible={true}
                height="120"
                width="120"
                color="#D90429"
                secondaryColor="#2B2D42"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></div>:<div className="Admin__groups">
                <div className="Admin__groups__table">
                    <h2>GroupsList</h2>
                    <div className="table-wrapper">
                        <table className="fl-table">
                            <thead>
                            <tr>
                                <th>id</th>
                                <th>enterYear</th>
                                <th>endYear</th>
                                <th>Name</th>
                                <th>studentsId`s</th>
                                <th>Remove</th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderItems(Groups)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="Admin__groups__form ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="adminForms">
                            <div className="nice-form-group">
                                <label>Enter Year</label>
                                <input placeholder="2023" {...register("enterYear")} type="number" />
                                {errors.enterYear && <p>{errors.enterYear.message}</p>}
                            </div>

                            <div className="nice-form-group">
                                <label>End Year</label>
                                <input placeholder="2027" {...register("endYear")} type="number" />
                                {errors.endYear && <p>{errors.endYear.message}</p>}
                            </div>

                            <div className="nice-form-group ">
                                <label>Name</label>
                                <input  type="text" {...register("name")} />
                                {errors.name && <p>{errors.name.message}</p>}
                            </div>
                        </div>


                        <div className="groupSelect" >
                            <label>Students</label>
                            <Controller
                                name="students"
                                control={control}
                                render={({ onChange,field }) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        options={userOptions}
                                        onChange={(selectedOptions) => {
                                            field.onChange(selectedOptions);
                                        }}
                                    />
                                )}
                            />
                            {errors.students && <p>{errors.students.message}</p>}
                        </div>
                        <div className="adminForms"><button type="submit"><div className="svg-wrapper-1">
                            <div className="svg-wrapper">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        fill="currentColor"
                                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                            <span>Submit</span></button></div>

                    </form>
                </div>
            </div> }

        </>

        )
}

export default AdminGroups;