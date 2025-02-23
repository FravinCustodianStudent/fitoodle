import React, { useState } from 'react';
import {
    Plus,
    Search,
    BarChart2,
    Users,
    BookOpen,
    Calendar,
    Clock,
    ListTodo
} from 'lucide-react';

import './LearningGroups.scss'; // SCSS со стилями

const LearningGroups = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'students' | 'tasks'
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [newTask, setNewTask] = useState({
        type: 'assignment',
        status: 'active',
    });

    // Мок-данные (две группы)
    const groups = [
        {
            id: '1',
            name: 'Web Development Basics',
            instructor: 'John Smith',
            schedule: 'Mon, Wed 10:00 AM',
            averageScore: 82,
            totalStudents: 15,
            students: [
                {
                    id: 's1',
                    name: 'Alex Johnson',
                    email: 'alex.j@example.com',
                    averageScore: 85,
                    attendance: 90,
                    recentActivity: [
                        {
                            id: 'a1',
                            type: 'test',
                            title: 'HTML Fundamentals',
                            date: '2024-02-15',
                            score: 88,
                        },
                        {
                            id: 'a2',
                            type: 'task',
                            title: 'CSS Layout Project',
                            date: '2024-02-14',
                            status: 'pending',
                            dueDate: '2024-02-20',
                        },
                    ],
                },
                {
                    id: 's2',
                    name: 'Emily Davis',
                    email: 'emily.d@example.com',
                    averageScore: 78,
                    attendance: 85,
                    recentActivity: [
                        {
                            id: 'a3',
                            type: 'lesson',
                            title: 'Responsive Design',
                            date: '2024-02-16',
                        },
                    ],
                },
            ],
            tasks: [
                {
                    id: 't1',
                    type: 'test',
                    title: 'JavaScript Basics Quiz',
                    description: 'Test covering fundamental JavaScript concepts',
                    dueDate: '2024-02-25',
                    status: 'active',
                    totalPoints: 100,
                    submissions: 12,
                    averageScore: 85,
                },
                {
                    id: 't2',
                    type: 'assignment',
                    title: 'Responsive Website Project',
                    description: 'Create a responsive website using HTML and CSS',
                    dueDate: '2024-03-01',
                    status: 'active',
                    totalPoints: 50,
                    submissions: 8,
                    averageScore: 78,
                },
            ],
        },
        {
            id: '2',
            name: 'Advanced JavaScript',
            instructor: 'Jane Doe',
            schedule: 'Tue, Thu 2:00 PM',
            averageScore: 88,
            totalStudents: 20,
            students: [
                {
                    id: 's3',
                    name: 'Michael Brown',
                    email: 'michael.b@example.com',
                    averageScore: 90,
                    attendance: 95,
                    recentActivity: [
                        {
                            id: 'a4',
                            type: 'test',
                            title: 'ES6 Features Quiz',
                            date: '2024-02-18',
                            score: 92,
                        },
                    ],
                },
                {
                    id: 's4',
                    name: 'Sarah Wilson',
                    email: 'sarah.w@example.com',
                    averageScore: 86,
                    attendance: 88,
                    recentActivity: [
                        {
                            id: 'a5',
                            type: 'task',
                            title: 'Async Programming Assignment',
                            date: '2024-02-17',
                            status: 'completed',
                            dueDate: '2024-02-20',
                        },
                    ],
                },
            ],
            tasks: [
                {
                    id: 't3',
                    type: 'assignment',
                    title: 'Asynchronous JavaScript',
                    description: 'Complete a project on async programming',
                    dueDate: '2024-03-05',
                    status: 'active',
                    totalPoints: 75,
                    submissions: 15,
                    averageScore: 88,
                },
            ],
        },
    ];

    // Создание задачи (упрощённый вариант)
    const handleCreateTask = () => {
        if (!selectedGroup) return;
        console.log('Creating new task:', newTask);
        setIsCreatingTask(false);
        setNewTask({ type: 'assignment', status: 'active' });
    };

    /*****************************
     * RENDER-функции для вкладок
     *****************************/

        // Overview
    const renderOverviewTab = () => (
            <div className="learning-groups__overview-tab">
                {/* Карточка с основной инфой */}
                <div className="learning-groups__card learning-groups__card--info">
                    <div className="learning-groups__info-header">
                        <div>
                            <h2 className="learning-groups__info-name">
                                {selectedGroup?.name}
                            </h2>
                            <p className="learning-groups__info-email">
                                Instructor: {selectedGroup?.instructor}
                            </p>
                            <p className="learning-groups__info-email">
                                Schedule: {selectedGroup?.schedule}
                            </p>
                        </div>
                        <div className="learning-groups__info-header-right">
                            <div className="learning-groups__info-score">
                                {selectedGroup?.averageScore}%
                            </div>
                            <p className="learning-groups__info-score-label">Group Average</p>
                        </div>
                    </div>

                    {/* Небольшая статистика: кол-во студентов, тестов, заданий */}
                    <div className="learning-groups__info-stats">
                        <div className="learning-groups__info-stat">
                            <div className="learning-groups__info-stat-value">
                                {selectedGroup?.totalStudents}
                            </div>
                            <p className="learning-groups__info-stat-label">Total Students</p>
                        </div>
                        <div className="learning-groups__info-stat">
                            <div className="learning-groups__info-stat-value">
                                {selectedGroup?.tasks.filter((t) => t.type === 'test').length}
                            </div>
                            <p className="learning-groups__info-stat-label">Active Tests</p>
                        </div>
                    </div>
                </div>

                {/* Карточка "Recent Activity" */}
                <div className="learning-groups__card">
                    <div className="learning-groups__card-header">
                        <h3 className="learning-groups__card-title">Recent Activity</h3>
                    </div>
                    <div className="learning-groups__card-list">
                        {selectedGroup?.students.flatMap((student) =>
                                student.recentActivity.map((activity) => (
                                    <div key={activity.id} className="learning-groups__card-item">
                                        <div className="learning-groups__card-item-row">
                                            <div className="learning-groups__card-item-left">
                                                {activity.type === 'test' ? (
                                                    <BookOpen className="learning-groups__icon learning-groups__icon--gray-small" />
                                                ) : activity.type === 'task' ? (
                                                    <ListTodo className="learning-groups__icon learning-groups__icon--gray-small" />
                                                ) : (
                                                    <Calendar className="learning-groups__icon learning-groups__icon--gray-small" />
                                                )}
                                                <div>
                                                    <p className="learning-groups__card-item-title">
                                                        {activity.title}
                                                    </p>
                                                    <p className="learning-groups__card-item-sub">
                                                        {student.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="learning-groups__card-item-right">
                                                {/* Если есть score */}
                                                {activity.score && (
                                                    <span className="learning-groups__badge learning-groups__badge--indigo">
                        {activity.score}%
                      </span>
                                                )}
                                                {/* Если есть статус (pending, completed, etc.) */}
                                                {activity.status && (
                                                    <span
                                                        className={`
                          learning-groups__badge
                          ${
                                                            activity.status === 'completed'
                                                                ? 'learning-groups__badge--green'
                                                                : activity.status === 'overdue'
                                                                    ? 'learning-groups__badge--red'
                                                                    : 'learning-groups__badge--yellow'
                                                        }
                        `}
                                                    >
                        {activity.status}
                      </span>
                                                )}
                                                <span className="learning-groups__card-item-date">
                      {activity.date}
                    </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        );

    // Students
    const renderStudentsTab = () => (
        <div className="learning-groups__card">
            <div className="learning-groups__card-header">
                <h3 className="learning-groups__card-title">Students</h3>
            </div>
            <div className="learning-groups__card-list">
                {selectedGroup?.students.map((student) => (
                    <div key={student.id} className="learning-groups__card-item">
                        <div className="learning-groups__card-item-row learning-groups__card-item-row--space">
                            <div>
                                <h4 className="learning-groups__student-name">{student.name}</h4>
                                <p className="learning-groups__student-email">{student.email}</p>
                            </div>
                            <div className="learning-groups__student-score">
                                <div className="learning-groups__student-score-top">
                                    <BarChart2 className="learning-groups__icon learning-groups__icon--gray-small" />
                                    <span className="learning-groups__student-score-value">
                    {student.averageScore}%
                  </span>
                                </div>
                                <p className="learning-groups__student-score-label">Average Score</p>
                            </div>
                        </div>

                        {/* Недавняя активность конкретного студента */}
                        <div className="learning-groups__student-activity">
                            <h5 className="learning-groups__student-activity-title">
                                Recent Activity
                            </h5>
                            <div className="learning-groups__student-activity-list">
                                {student.recentActivity.map((activity) => (
                                    <div key={activity.id} className="learning-groups__activity-item">
                                        <div className="learning-groups__activity-left">
                                            {activity.type === 'test' ? (
                                                <BookOpen className="learning-groups__icon learning-groups__icon--gray-small" />
                                            ) : activity.type === 'task' ? (
                                                <ListTodo className="learning-groups__icon learning-groups__icon--gray-small" />
                                            ) : (
                                                <Calendar className="learning-groups__icon learning-groups__icon--gray-small" />
                                            )}
                                            <span className="learning-groups__activity-title">
                        {activity.title}
                      </span>
                                        </div>
                                        <div className="learning-groups__activity-right">
                                            {activity.score && (
                                                <span className="learning-groups__badge learning-groups__badge--indigo">
                          {activity.score}%
                        </span>
                                            )}
                                            {activity.status && (
                                                <span
                                                    className={`
                            learning-groups__badge
                            ${
                                                        activity.status === 'completed'
                                                            ? 'learning-groups__badge--green'
                                                            : activity.status === 'overdue'
                                                                ? 'learning-groups__badge--red'
                                                                : 'learning-groups__badge--yellow'
                                                    }
                          `}
                                                >
                          {activity.status}
                        </span>
                                            )}
                                            <span className="learning-groups__activity-date">
                        {activity.date}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Tasks
    const renderTasksTab = () => (
        <div className="learning-groups__card">
            <div className="learning-groups__card-header">
                <div className="learning-groups__card-item-row learning-groups__card-item-row--space">
                    <h3 className="learning-groups__card-title">Tasks and Assignments</h3>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsCreatingTask(true);
                        }}
                        className="learning-groups__btn learning-groups__btn--primary"
                    >
                        <Plus className="learning-groups__icon" />
                        <span>Create Task</span>
                    </a>
                </div>
            </div>

            {/* Если нажали Create Task */}
            {isCreatingTask ? (
                <div className="learning-groups__card-list" style={{ padding: '1rem' }}>
                    <div className="learning-groups__form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="learning-groups__label">Task Type</label>
                            <select
                                value={newTask.type}
                                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                className="learning-groups__input"
                            >
                                <option value="assignment">Assignment</option>
                                <option value="test">Test</option>
                            </select>
                        </div>
                        <div>
                            <label className="learning-groups__label">Title</label>
                            <input
                                type="text"
                                value={newTask.title || ''}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="learning-groups__input"
                                placeholder="Enter task title"
                            />
                        </div>
                        <div>
                            <label className="learning-groups__label">Description</label>
                            <textarea
                                value={newTask.description || ''}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, description: e.target.value })
                                }
                                className="learning-groups__input"
                                rows={3}
                                placeholder="Enter task description"
                            />
                        </div>
                        <div>
                            <label className="learning-groups__label">Due Date</label>
                            <input
                                type="date"
                                value={newTask.dueDate || ''}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="learning-groups__input"
                            />
                        </div>
                        {newTask.type === 'test' && (
                            <div>
                                <label className="learning-groups__label">Total Points</label>
                                <input
                                    type="number"
                                    value={newTask.totalPoints || ''}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, totalPoints: parseInt(e.target.value) })
                                    }
                                    className="learning-groups__input"
                                    placeholder="Enter total points"
                                />
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsCreatingTask(false);
                                }}
                                className="learning-groups__btn learning-groups__btn--outline"
                            >
                                Cancel
                            </a>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCreateTask();
                                }}
                                className="learning-groups__btn learning-groups__btn--primary"
                            >
                                Create Task
                            </a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="learning-groups__card-list">
                    {selectedGroup?.tasks.map((task) => (
                        <div key={task.id} className="learning-groups__card-item">
                            <div className="learning-groups__card-item-row learning-groups__card-item-row--space">
                                <div>
                                    <div className="learning-groups__task-top">
                                        <h4 className="learning-groups__task-title">{task.title}</h4>
                                        <span
                                            className={`
                        learning-groups__badge
                        ${
                                                task.type === 'test'
                                                    ? 'learning-groups__badge--purple'
                                                    : 'learning-groups__badge--blue'
                                            }
                      `}
                                        >
                      {task.type}
                    </span>
                                    </div>
                                    <p className="learning-groups__task-desc">{task.description}</p>
                                </div>
                                <div className="learning-groups__task-deadline">
                                    <div className="learning-groups__task-deadline-row">
                                        <Clock className="learning-groups__icon learning-groups__icon--gray-small" />
                                        <span className="learning-groups__task-deadline-date">
                      Due: {task.dueDate}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="learning-groups__task-stats-grid">
                                <div className="learning-groups__task-stat">
                                    <div className="learning-groups__task-stat-value">
                                        {task.submissions}
                                    </div>
                                    <p className="learning-groups__task-stat-label">Submissions</p>
                                </div>
                                {task.averageScore !== undefined && (
                                    <div className="learning-groups__task-stat">
                                        <div className="learning-groups__task-stat-value">
                                            {task.averageScore}%
                                        </div>
                                        <p className="learning-groups__task-stat-label">Average Score</p>
                                    </div>
                                )}
                                {task.totalPoints !== undefined && (
                                    <div className="learning-groups__task-stat">
                                        <div className="learning-groups__task-stat-value">
                                            {task.totalPoints}
                                        </div>
                                        <p className="learning-groups__task-stat-label">Total Points</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    /***********************
     * Основной рендер
     ***********************/
    return (
        <div className="learning-groups">
            {/* Заголовок + кнопка создания группы */}
            <div className="learning-groups__header-row">
                <h1 className="learning-groups__title">Learning Groups</h1>
                <a
                    href="#"
                    className="learning-groups__btn learning-groups__btn--primary"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log('Create Group clicked!');
                    }}
                >
                    <Plus className="learning-groups__icon" />
                    <span>Create Group</span>
                </a>
            </div>

            {/* Основная сетка: левая панель + правая часть */}
            <div className="learning-groups__main-grid">
                {/* Левая панель: список групп */}
                <div className="learning-groups__list-panel">
                    <div className="learning-groups__list-panel-header">
                        <div className="learning-groups__list-panel-search">
                            <Search className="learning-groups__list-panel-search-icon" />
                            <input
                                type="text"
                                placeholder="Search groups..."
                                className="learning-groups__list-panel-search-input"
                            />
                        </div>
                    </div>

                    <div className="learning-groups__groups-list">
                        {groups.map((group) => (
                            <a
                                key={group.id}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedGroup(group);
                                    setActiveTab('overview');
                                }}
                                className={`learning-groups__group-link ${
                                    selectedGroup?.id === group.id
                                        ? 'learning-groups__group-link--active'
                                        : ''
                                }`}
                            >
                                <div className="learning-groups__group-link-content">
                                    <div>
                                        <h3 className="learning-groups__group-name">{group.name}</h3>
                                        <p className="learning-groups__group-sub">{group.instructor}</p>
                                        <p className="learning-groups__group-sub">{group.schedule}</p>
                                    </div>
                                    <div className="learning-groups__group-info-right">
                                        <div className="learning-groups__group-info-students">
                                            <Users className="learning-groups__icon learning-groups__icon--gray-small" />
                                            <span className="learning-groups__group-student-count">
                        {group.totalStudents}
                      </span>
                                        </div>
                                        <span className="learning-groups__badge learning-groups__badge--indigo">
                      {group.averageScore}%
                    </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Правая часть: детали группы */}
                <div className="learning-groups__details-panel">
                    {selectedGroup ? (
                        <div className="learning-groups__details">
                            {/* Вкладки */}
                            <div className="learning-groups__tabs-card">
                                <nav className="learning-groups__tabs-nav">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab('overview');
                                        }}
                                        className={`learning-groups__tab-link ${
                                            activeTab === 'overview'
                                                ? 'learning-groups__tab-link--active'
                                                : ''
                                        }`}
                                    >
                                        Overview
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab('students');
                                        }}
                                        className={`learning-groups__tab-link ${
                                            activeTab === 'students'
                                                ? 'learning-groups__tab-link--active'
                                                : ''
                                        }`}
                                    >
                                        Students
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab('tasks');
                                        }}
                                        className={`learning-groups__tab-link ${
                                            activeTab === 'tasks'
                                                ? 'learning-groups__tab-link--active'
                                                : ''
                                        }`}
                                    >
                                        Tasks
                                    </a>
                                </nav>
                            </div>

                            {/* Содержимое вкладок */}
                            {activeTab === 'overview' && renderOverviewTab()}
                            {activeTab === 'students' && renderStudentsTab()}
                            {activeTab === 'tasks' && renderTasksTab()}
                        </div>
                    ) : (
                        <div className="learning-groups__empty-state">
                            <p className="learning-groups__empty-text">
                                Select a group to view details
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningGroups;
