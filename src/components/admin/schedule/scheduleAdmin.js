

const ScheduleAdmin = () =>{

    return(
        <>
            <div style={{marginTop:"20px"}} className="Admin__groups__table">
                <h2>ScheduleList</h2>
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>groupId</th>
                            <th>mondayId</th>
                            <th>tuesdayId</th>
                            <th>wednesdayId</th>
                            <th>thursdayId</th>
                            <th>fridayId</th>
                            <th>delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>f325964c-957e-4d9d-ad2d</td>
                            <td>86das7dd-957e-4d9d-at2d</td>
                            <td>4d9ds7dd-7656-957e-4d9d</td>
                            <td>43212556-4321-957e-at2d</td>
                            <td>46544556-at2d-4d9d-at2d</td>
                            <td>46544556-at2d-4d9d-at2d</td>
                            <td>46544556-at2d-4d9d-at2d</td>
                            <td><button><span className="text">Delete</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{width:"750px"}} className="Admin__groups__form">
                    <div className="adminForms">
                        <div className="nice-form-group">
                            <label>Задайте для якої групи розклад</label>
                            <select>
                                <option>Оберіть групу</option>
                                <option>Option 1</option>
                                <option>Option 2</option>
                            </select>
                        </div>
                        <div className="nice-form-group">
                            <label>Введіть дату до котрої буде дійсним розклад</label>
                            <input placeholder="Sample description of test" type="date"/>
                        </div>
                        <div className="nice-form-group">
                            <label>Оберіть день для заповнення</label>
                            <select>
                                <option>Понеділок</option>
                                <option>Option 1</option>
                                <option>Option 2</option>
                            </select>
                        </div>
                        <div style={{display:"flex",
                            flexDirection:"column"}} className="nice-form-group">
                            <label>9.00 - 10.20</label>
                            <input style={{marginTop:"10px"}} placeholder="назва" type="text"/>
                            <input style={{marginTop:"10px"}} placeholder="посилання" type="text"/>
                            <input style={{marginTop:"10px"}} placeholder="дата останнього заняття" type="date"/>
                            <select style={{marginTop:"10px"}}>
                                <option>Оберіть викладача</option>
                                <option>Option 1</option>
                                <option>Option 2</option>
                            </select>
                        </div>
                        <div className="nice-form-group">
                            <button>Додати наступну пару</button>
                        </div>
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
                </div>
            </div>
        </>
    )
}

export default ScheduleAdmin;