import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    testConfig:{},
    tests:[],
    testsGroup:{},
    answers:[],
    timer:{}
};

const testSlice = createSlice(
    {
        name: 'tests',
        initialState,
        reducers:{
            loadTestConfig:(state, action) =>{
                state.testConfig = action.payload;
                console.log(state.testConfig);
            },
            loadQuestions:(state, action) =>{
                state.tests = action.payload;
            },
            loadTestGroup:(state, action) =>{
                state.testsGroup = action.payload;
            },
            addAnswer:(state,action)=>{
                state.answers = [...state.answers,action.payload];
            },
            removeAnswer: (state, action) => {
                const indexToRemove = state.answers.findIndex(answer => answer === action.payload);
                if (indexToRemove !== -1) {
                    state.answers.splice(indexToRemove, 1);
                }
            },
            setTime:(state,action) =>{
                state.timer = action.payload.toString();
            },
            modifyAnswerById: (state, action) => {
                const { questionId, answersId } = action.payload;
                // Находим индекс сущности в массиве answers по questionId
                const indexToModify = state.answers.findIndex(answer => answer.questionId === questionId);
                if (indexToModify !== -1) {
                    // Если сущность найдена, заменяем ее новым значением
                    state.answers[indexToModify].answersId = answersId;
                }
            }
        }
    }
);

export const {loadTestConfig,loadTestGroup,loadQuestions,addAnswer,removeAnswer,setTime,modifyAnswerById } = testSlice.actions;
export default testSlice.reducer;