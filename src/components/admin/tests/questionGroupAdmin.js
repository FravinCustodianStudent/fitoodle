import {useHttp} from "../../../hooks/http.hook";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import CoursesItemMain from "../courses/coursesItemMain";
import {Oval} from "react-loader-spinner";
import Select from "react-select";
import * as yup from "yup";
import QuestionGroupItemAdmin from "./questionGroupItemAdmin";
import QuestionItem from "../../tests/questionItem/questionItem";
const schema = yup.object().shape({
    name: yup.string().required(),
});
const QuestionGroupAdmin = () =>{
    const {GET,POST} = useHttp();
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const [Loading, setLoading] = useState(true);
    const [questionGroup, setQuestionGroup] = useState([
        { id: 'f325964c-957e-4d9d-ad2d-f1e4814a9e3a', name: 'question grou', creator:"f325964c-957e-4d9d-ad2d-f1e3814a9e3a" }
        // Добавьте здесь больше пользователей
    ]);

    useEffect(() => {
        GET({},"testingresource/questionGroups",{"Authorization": localStorage.getItem("jwt")})
            .then((res)=>{
                setQuestionGroup(res.data)

                GET(null,"userdataresource/users",{"Authorization": localStorage.getItem("jwt")})
                    .then((res)=>{
                        setLoading(false);
                    })
            })


    }, []);
    const onSubmit = date =>{
        setLoading(true)
        POST({name:date.name},"testingresource/questionGroups",{"Authorization": localStorage.getItem("jwt")})
            .then((res)=>{
                setQuestionGroup([...questionGroup,res.data]);
                setLoading(false)
            })
    }
    const renderItems = arr =>{
        const items = arr.map((item, i) =>{
            return(
                <>{<QuestionGroupItemAdmin key={item.id} item={item} questionGroup={questionGroup} setQuestionGroup={setQuestionGroup} />}</>
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
                        <h2>questionGroup</h2>
                        <div className="table-wrapper">
                            <table className="fl-table">
                                <thead>
                                <tr>
                                    <th>id</th>
                                    <th>name</th>
                                    <th>creator Id</th>
                                    <th>Remove</th>
                                </tr>
                                </thead>
                                <tbody>
                                {renderItems(questionGroup)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="Admin__groups__form ">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="adminForms">
                                <div className="nice-form-group">
                                    <label>Name</label>
                                    <input placeholder="Sample Name of the questionGroup" {...register("name")} type="text" />
                                    {errors.name && <p>{errors.name.message}</p>}
                                </div>
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

export default QuestionGroupAdmin;