import {Oval} from "react-loader-spinner";
import {useState} from "react";

const QuestionsAdmin = () => {
    return (
        <><div style={{marginTop:"20px"}} className="Admin__groups__table">
            <h2>QuestionsList</h2>
            <div className="table-wrapper">
                <table className="fl-table">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>questionText</th>
                        <th>questionGroupId</th>
                        <th>answers`s</th>
                        <th>attachmentUrl</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>f325964c-957e-4d9d-ad2d-f1e4864a9e3a</td>
                        <td>question</td>
                        <td>how much</td>
                        <td>f325964c-957e-4d9k-ad2d-f1e4864a9e3a</td>
                        <td>bb234964cf1e4814a9e3m 3421221e4814a9e3m f325964c-957e4814a9e3m</td>
                        <td>AF2bZyhHeI9UgZ_SbJcX51rx41iVUrvnMb4VFM_cAOLI9urZWFo=s32-c-mo</td>
                        <td><button><span className="text">Delete</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style={{width:"750px"}} className="Admin__groups__form">
                <div className="adminForms">
                    <div className="nice-form-group">
                        <label>Ім'я</label>
                        <input placeholder="Sample Name of the questionGroup" type="text" />
                    </div>
                    <div className="nice-form-group">
                        <label>Текст Питання</label>
                        <input placeholder="Find the proper answer" type="text" />
                    </div>
                    <div className="nice-form-group">
                        <label>Виберіть групу питань</label>
                        <select>
                            <option>Please select a questionGroup</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                        </select>
                    </div>
                    <div className="nice-form-group">
                        <label>Question Image</label>
                        <input placeholder="text" type="file" />

                    </div>
                    <div className="nice-form-group">
                        <label>Перша відповідь</label>
                        <input placeholder="text" type="text" />

                    </div>
                    <div className="nice-form-group">
                        <input type="checkbox" id="check-3" className="switch" />
                        <label htmlFor="check-3">Правильність відповіді</label>
                    </div>
                    <div className="nice-form-group">
                        <button>Додати питання</button>
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
    );
};

export default QuestionsAdmin;