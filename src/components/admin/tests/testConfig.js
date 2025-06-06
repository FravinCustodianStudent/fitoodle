

const TestConfig = () =>{

    return( <><div style={{marginTop:"20px"}} className="Admin__groups__table">
        <h2>TestConfigList</h2>
        <div className="table-wrapper">
            <table className="fl-table">
                <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>description</th>
                    <th>taskId</th>
                    <th>testContentConfigurationListID`s</th>
                    <th>timeLimitation</th>
                    <th>maxTestMark</th>
                    <th>creatorId</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>f324964c-157e-4d9d-ad2d-g8e4864z9e3a</td>
                    <td>test#5</td>
                    <td>test#5</td>
                    <td>f324964c-157e-4d9a-ad2l-g4e4864z9e3a</td>
                    <td>f324964c-957e-4d9d-ad2d-g2e4864a9e3a b324964c-957e-4d9d-ad2d-g2e4864a9e33</td>
                    <td>34</td>
                    <td>8</td>
                    <td>b324964c-157b-4d9b-ad2x-g8e4864z9e3z</td>
                    <td><button><span className="text">Delete</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div style={{width:"750px"}} className="Admin__groups__form">
            <div className="adminForms">
                <div className="nice-form-group">
                    <label>Name</label>
                    <input placeholder="Sample Name of the questionGroup" type="text" />
                </div>
                <div className="nice-form-group">
                    <label>description</label>
                    <input placeholder="Sample description of test" type="text"/>
                </div>
                <div className="nice-form-group">
                    <label>timeLimitation</label>
                    <input placeholder="33" type="number" />
                </div>
                <div className="nice-form-group">
                    <label>tasksId</label>
                    <select>
                        <option>Please select a task</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>
                </div>
                <div style={{display:"flex",
                    flexDirection:"column"}} className="nice-form-group">
                    <label>testContentConfigurationListItem</label>
                    <input style={{marginTop:"10px"}} placeholder="markPerQuestion" type="number"/>
                    <input style={{marginTop:"10px"}} placeholder="numberOfQuestions" type="number"/>
                    <select style={{marginTop:"10px"}}>
                        <option>Please select a task</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>
                </div>
                <div className="nice-form-group">
                    <button>Add testContentConfigurationListItem</button>
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
    </div> </> )
}

export default TestConfig;