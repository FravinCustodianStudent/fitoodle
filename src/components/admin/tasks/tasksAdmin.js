import * as yup from "yup";
import {useHttp} from "../../../hooks/http.hook";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import Select from "react-select";
import {Oval} from "react-loader-spinner";
import "../groups/adminGroups.scss"
import {useDropzone} from "react-dropzone";
import axios from "axios";

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    authorId: yup.object().required('Author ID is required'),
    eduCourseId: yup.string().required('Education Course ID is required'),
    maxMarkValue: yup.number().required().positive().integer().min(1, 'Max Mark Value should be at least 1'),
    deadline: yup.date().required('Deadline is required'),
    description: yup.string().required('Description is required'),
    attachedFiles: yup.mixed().required()
});
const TasksAdmin = () =>{
    const {GET,POST} = useHttp();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([{
        "id": "string",
        "name": "Sample Name of the Course",
        "teacherId": "f383664c-937e-4d9d-ad2d-f1e4964a9e3a",
    }]);
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    useEffect(() => {
        GET(null, "userdataresource/users", { "Authorization": localStorage.getItem("jwt") })
            .then((result) => {
                setUsers(result.data);
                setLoading(false);
                GET({},"courseresource/courses/all",{"Authorization": localStorage.getItem("jwt")})
                    .then((res)=>{
                        setCourses(res.data)

                    })
            });
    }, []);
    const userOptions = users.map(user => ({
        value: user.userId,
        label: `${user.firstName} ${user.lastName}`
    }));
    const coursesOptions = courses.map(course=>({
        value: course.id,
        label: course.name
    }))
    const formatdDate = (dateObject ) =>{
        const currentDate = new Date(dateObject);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
        return `${year}-${month}-${date}`;
    }
    const onSubmit =  data => {
        //setLoading(true)
        let formData = new FormData();
        formData.append('file',data.attachedFiles[0],data.attachedFiles[0].name)
        setLoading(true)
        const response = axios.post('http://localhost:8888/fileresource/files',formData,{
           headers:{
               'Content-Type': 'multipart/form-data',
               'Authorization': localStorage.getItem("jwt")}
        })
            .then((res)=>{
            console.log(res.data)
            setLoading(false)
            const dateToUpload = {
                name: data.name,
                authorId: data.authorId.value,
                eduCourseId: data.eduCourseId,
                maxMarkValue: data.maxMarkValue,
                deadline: formatdDate(data.deadline),
                description: data.description,
                attachedFiles: [res.data.id]
            };
            console.log(dateToUpload)
                POST({}, "taskresource/tasks", { "Authorization": localStorage.getItem("jwt") }, dateToUpload)
                    .then((res) => {
                        console.log(res);
                        // обновить состояние или уведомить пользователя
                        setLoading(false)
                    });
        });


    };
    const [Loading, setLoading] = useState(true);
    return(
        <>
            {Loading ? (
                <div className="oval__loader">
                    <Oval
                        visible={true}
                        height="120"
                        width="120"
                        color="#D90429"
                        secondaryColor="#2B2D42"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            ) : (
                <div className="Admin__tasks">
                    <div className="Admin__groups__form" style={{width:"500px"}}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="adminForms">
                                <div className="nice-form-group">
                                    <label>Name</label>
                                    <input type="text" {...register("name")} />
                                    {errors.name && <p>{errors.name.message}</p>}
                                </div>




                                <div className="nice-form-group">
                                    <label>Max Mark Value</label>
                                    <input type="number" {...register("maxMarkValue")} />
                                    {errors.maxMarkValue && <p>{errors.maxMarkValue.message}</p>}
                                </div>


                                <div className="nice-form-group">
                                    <label>Deadline</label>
                                    <input type="date" {...register("deadline")} />
                                    {errors.deadline && <p>{errors.deadline.message}</p>}
                                </div>

                                <div className="nice-form-group">
                                    <label>Description</label>
                                    <textarea {...register("description")} />
                                    {errors.description && <p>{errors.description.message}</p>}
                                </div>

                                <div className="nice-form-group">
                                    <input type="file" {...register('attachedFiles')} />
                                    {errors.attachedFiles && <p>{errors.attachedFiles.message}</p>}
                                </div>
                            </div>
                            <div className="nice-form-group">
                                <label>Author ID</label>
                                <Controller
                                    name="authorId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={userOptions}
                                            onChange={(selectedOptions) => {
                                                field.onChange(selectedOptions);
                                            }}
                                        />
                                    )}
                                />
                                {errors.authorId && <p>{errors.authorId.message}</p>}
                            </div>
                            <div className="nice-form-group">
                                <label>Education Course ID</label>
                                <Controller
                                    name="eduCourseId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={coursesOptions}
                                            onChange={(selectedOption) =>{ field.onChange(selectedOption.value)
                                            } }
                                        />
                                    )}
                                />
                                {errors.eduCourseId && <p>{errors.eduCourseId.message}</p>}
                            </div>
                            <div className="adminForms">
                                <button type="submit">
                                    <div className="svg-wrapper-1">
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
                                    <span>Submit</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
export default TasksAdmin;