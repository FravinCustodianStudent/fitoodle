import {Oval} from "react-loader-spinner";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import {useHttp} from "../../../hooks/http.hook";
import {useEffect, useState} from "react";
import "../groups/adminGroups.scss"
import AdminGroupItem from "../groups/adminGroupItem";
import CoursesItemMain from "./coursesItemMain";
import * as yup from "yup";
import {date} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
const schema = yup.object().shape({
    name: yup.string().required(),
    teacherId: yup.object().required(),
    targetGroups: yup.array().of(yup.object().required()).min(1, 'Select at least one Group')
});
const CoursesMain = () =>{
    const {GET,POST} = useHttp();
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const [Loading, setLoading] = useState(true);
    const [Course, setCourse] = useState([ {
        "id": "string",
        "name": "Sample Name of the Course",
        "teacherId": "f383664c-937e-4d9d-ad2d-f1e4964a9e3a",
        "targetGroups": [
            "Groups","Groups2"
        ],
        "laborants": [
            "Laborants"
        ],
        "messages": [
            "Messages"
        ]
    }])
    const [users, setUsers] = useState([
        { userId: '3b6df8d7-7add-4eae-9e18-4a2803c4fc13', firstName: 'User', lastName:"surname" },
        { userId: 'sadsadas-7add-4eae-9e18-4a2803c4fc13', firstName: 'User2', lastName:"surname2" }
        // Добавьте здесь больше пользователей
    ]);
    const [Groups, setGroup] = useState([
        { id: '3b6df8d7-7add-4eae-9e18-4a2803c4fc13', name: 'Group 1' },
        { id: '23413213-7add-4eae-9e18-4a2803c4fc13', name: 'Group 1' }

        // Добавьте здесь больше пользователей
    ]);
    const userOptions = users.map(user => ({
        value: user.userId,
        label: (user.firstName+" "+user.lastName)
    }));
    const groupOptions = Groups.map(group => ({
        value: group.id,
        label: group.name
    }));
    useEffect(() => {
        GET({},"courseresource/courses/all",{"Authorization": localStorage.getItem("jwt")})
            .then((res)=>{
                setCourse(res.data)

                GET(null,"userdataresource/users",{"Authorization": localStorage.getItem("jwt")})
                    .then((result)=>{
                        setUsers(result.data)
                        GET(null,"groupresource/groups/all",{"Authorization": localStorage.getItem("jwt")})
                            .then((groupRes)=>{
                                setGroup(groupRes.data);
                                setLoading(false)
                            })
                    })
            })

    }, []);
    const onSubmit = date =>{
        const dateToUpload = {
            name: date.name,
            teacherId:date.teacherId.value,
            targetGroups: date.targetGroups.map(obj=>obj.value)
        }
        setLoading(true)
        POST({},"courseresource/courses",{"Authorization": localStorage.getItem("jwt")},dateToUpload)
            .then((res)=>{
                setCourse([...Course,res.data]);
                setLoading(false)
            })
    }
    const renderItems = arr =>{
        const items = arr.map((item, i) =>{
            return(
                <>{<CoursesItemMain item={item} Course={Course} setCourse={setCourse} />}</>
            )
        })
        return(items)
    }
    return(
        <>
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
                        <h2>CourseList</h2>
                        <div className="table-wrapper">
                            <table className="fl-table">
                                <thead>
                                <tr>
                                    <th>id</th>
                                    <th>name</th>
                                    <th>teacherId</th>
                                    <th>targetGroups</th>
                                    <th>Remove</th>
                                </tr>
                                </thead>
                                <tbody>
                                {renderItems(Course)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="Admin__groups__form ">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="adminForms">
                                <div className="nice-form-group">
                                    <label>Namee</label>
                                    <input placeholder="Sample Name of the Course" {...register("name")} type="text" />
                                    {errors.name && <p>{errors.name.message}</p>}
                                </div>
                            </div>


                            <div className="groupSelect" >
                                <label>Teacher</label>
                                <Controller
                                    name="teacherId"
                                    control={control}
                                    render={({ onChange,field }) => (
                                        <Select
                                            {...field}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    borderColor: state.isFocused ? '#D90429FF' : 'gray',
                                                }),
                                            }}
                                            closeMenuOnSelect={true}
                                            options={userOptions}
                                            onChange={(selectedOptions) => {
                                                field.onChange(selectedOptions);
                                            }}
                                        />
                                    )}
                                />
                                {errors.teacherId && <p>{errors.teacherId.message}</p>}
                            </div>
                            <div className="groupSelect" >
                                <label>targetGroups</label>
                                <Controller
                                    name="targetGroups"
                                    control={control}
                                    render={({ onChange,field }) => (
                                        <Select
                                            {...field}
                                            isMulti
                                            closeMenuOnSelect={false}
                                            options={groupOptions}
                                            onChange={(selectedOptions) => {
                                                field.onChange(selectedOptions);
                                            }}
                                        />
                                    )}
                                />
                                {errors.teacherId && <p>{errors.teacherId.message}</p>}
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
        </>
    )
}

export default CoursesMain;