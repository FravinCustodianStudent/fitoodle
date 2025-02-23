import React, { useState } from 'react';
import { Search, XCircle, CheckCircle} from 'lucide-react';
import "./testResult.scss";


const TestResult = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Пример данных (без типизации)
    const students = [
        {
            id: '1',
            name: 'Alex Johnson',
            email: 'alex.j@example.com',
            averageScore: 85,
            recentTests: [
                {
                    id: 't1',
                    testName: 'Algebra Fundamentals',
                    subject: 'Mathematics',
                    score: 78,
                    date: '2024-02-15',
                    incorrectAnswers: [
                        {
                            questionText: 'Solve for x: 2x + 5 = 13',
                            studentAnswer: '3',
                            correctAnswer: '4',
                        },
                    ],
                },
            ],
        },
        {
            id: '2',
            name: 'Alex Johnson',
            email: 'alex.j@example.com',
            averageScore: 85,
            recentTests: [
                {
                    id: 't1',
                    testName: 'Algebra Fundamentals',
                    subject: 'Mathematics',
                    score: 78,
                    date: '2024-02-15',
                    incorrectAnswers: [
                        {
                            questionText: 'Solve for x: 2x + 5 = 13',
                            studentAnswer: '3',
                            correctAnswer: '4',
                        },
                        {
                            questionText: 'Solve for x: 2x + 5 = 13',
                            studentAnswer: '3',
                            correctAnswer: '4',
                        },
                    ],
                },
            ],
        },
    ];

    return (
        <div className="test-results">
            <h1 className="test-results__title">Test Results</h1>

            <div className="test-results__content">
                {/* Левая панель со списком студентов */}
                <div className="test-results__list-panel">
                    {/* Поиск */}
                    <div className="test-results__search-header">
                        <div className="test-results__search">
                            <Search className="test-results__search-icon" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="test-results__search-input"
                            />
                        </div>
                    </div>

                    {/* Список студентов */}
                    <div className="test-results__students">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className={`test-results__student-button ${
                                    selectedStudent?.id === student.id
                                        ? 'test-results__student-button--active'
                                        : ''
                                }`}
                            >
                                <div className="test-results__student-button-content">
                                    <div className="test-results__student-info">
                                        <h3 className="test-results__student-name">{student.name}</h3>
                                        <p className="test-results__student-email">{student.email}</p>
                                    </div>
                                    <span className="test-results__student-score-badge">
                    {student.averageScore}%
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Правая часть: детали выбранного студента */}
                <div className="test-results__details-panel">
                    {selectedStudent ? (
                        <div className="test-results__details">
                            {/* Карточка с основной информацией */}
                            <div className="test-results__card test-results__card--info">
                                <div className="test-results__info-header">
                                    <div className="test-results__info-header-left">
                                        <h2 className="test-results__info-name">{selectedStudent.name}</h2>
                                        <p className="test-results__info-email">{selectedStudent.email}</p>
                                    </div>
                                    <div className="test-results__info-header-right">
                                        <div className="test-results__info-score">
                                            {selectedStudent.averageScore}%
                                        </div>
                                        <p className="test-results__info-score-label">Average Score</p>
                                    </div>
                                </div>

                            </div>

                            {/* Карточка с результатами тестов */}
                            <div className="test-results__card test-results__card--recent">
                                <div className="test-results__recent-header">
                                    <h3 className="test-results__recent-title">Recent Test Results</h3>
                                </div>
                                <div className="test-results__recent-list">
                                    {selectedStudent.recentTests.map((test) => (
                                        <div key={test.id} className="test-results__recent-item">
                                            <div className="test-results__recent-item-header">
                                                <div className="test-results__recent-item-info">
                                                    <h4 className="test-results__recent-item-name">{test.testName}</h4>
                                                    <p className="test-results__recent-item-subject">{test.subject}</p>
                                                </div>
                                                <div className="test-results__recent-item-score">
                          <span
                              className={`test-results__score-badge ${
                                  test.score >= 70
                                      ? 'test-results__score-badge--green'
                                      : 'test-results__score-badge--red'
                              }`}
                          >
                            {test.score}%
                          </span>
                                                    <span className="test-results__recent-item-date">
                            {test.date}
                          </span>
                                                </div>
                                            </div>

                                            <div className="test-results__recent-answers">
                                                <h5 className="test-results__recent-answers-title">
                                                    Incorrect Answers
                                                </h5>
                                                {test.incorrectAnswers.map((answer, index) => (
                                                    <div key={index} className="test-results__answer-item">
                                                        <p className="test-results__answer-question">
                                                            {answer.questionText}
                                                        </p>
                                                        <div className="test-results__answer-grid">
                                                            <div className="test-results__answer-wrong">
                                                                <XCircle className="test-results__answer-icon test-results__answer-icon--wrong" />
                                                                <div>
                                                                    <p className="test-results__answer-label">Student Answer</p>
                                                                    <p className="test-results__answer-value">{answer.studentAnswer}</p>
                                                                </div>
                                                            </div>
                                                            <div className="test-results__answer-correct">
                                                                <CheckCircle className="test-results__answer-icon test-results__answer-icon--correct" />
                                                                <div>
                                                                    <p className="test-results__answer-label">Correct Answer</p>
                                                                    <p className="test-results__answer-value">{answer.correctAnswer}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="test-results__empty-state">
                            <p className="test-results__empty-text">
                                Select a student to view their test results
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};




export default TestResult;
