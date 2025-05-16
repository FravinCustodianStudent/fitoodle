import React, { useEffect, useState } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import { Steps, Modal, Form, Select, Alert, Button } from 'antd';
import {ArrowLeftOutlined, BookOutlined, EditOutlined} from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useCourseService } from '../services/useCourseService';
import { useHttp } from '../../../hooks/http.hook';

import LinkedTestsStep from './steps/LinkedTestsStep';
import BasicInfoStep from './steps/BasicInfoStep';
import TestGroupsStep from './steps/TestGroupsStep';
import TestManagementStep from './steps/TestManagementStep';
import "./questionAdmin.scss"
const { Step } = Steps;

const QuestionsAdmin = () => {
    const { GET, POST, DELETE } = useHttp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const {
        courses,
        courseInfo,
        fetchCourseList,
        fetchCourseInfo,
        loading: courseLoading,
        error: courseError
    } = useCourseService();

    // General state
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
    const [courseForm] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTestDetail, setSelectedTestDetail] = useState(null);
    // Step 1 — Basic Info
    const [finalTestData, setFinalTestData] = useState({
        testName: '',
        description: '',
        taskId: '',
        testContentConfigurationList: [],
        timeLimitation: 60,
    });
    const [basicInfoForm] = Form.useForm();
    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [isTaskDrawerVisible, setIsTaskDrawerVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [eduCourseId, setEduCourseId] = useState(null);
    const navigate = useNavigate();
    // Step 2 — Groups
    const [questionGroups, setQuestionGroups] = useState([]);
    const [isGroupDrawerVisible, setIsGroupDrawerVisible] = useState(false);
    const [drawerForm] = Form.useForm();
    const [currentGroup, setCurrentGroup] = useState(null);

    // Step 3 — Configs
    const [questionConfigs, setQuestionConfigs] = useState([]);
    // add this inside your component body:
    const handleAddConfig = (config) => {
        setQuestionConfigs(prev => [...prev, config]);
    };
    // Update
    const handleUpdateConfig = updatedConfig => {
        setQuestionConfigs(prev =>
            prev.map(c => c.id === updatedConfig.id ? updatedConfig : c)
        );
    };

    const handleDeleteConfig = (configId) => {
        setQuestionConfigs(prev =>
            prev.filter(c => c.id !== configId)
        );
    };

    // Test drawer (used in Step 2)
    const [isTestDrawerVisible, setIsTestDrawerVisible] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [testForm] = Form.useForm();

    // Load initial data
    useEffect(() => {
        fetchCourseList();
    }, [navigate]);

    useEffect(() => {
        const courseIdParam = searchParams.get('courseId');
        setEduCourseId(courseIdParam);
        if (courseIdParam) fetchCourseInfo(courseIdParam);
    }, [searchParams]);

    useEffect(() => {
        if (!courseInfo) {
            setTasks([]);
            return;
        }

        GET({ eduCourseId: courseInfo.id }, 'taskresource/tasks/by/course', {})
            .then((res) => {

                setTasks(res.data.filter(item => item.testId === null))})
            .catch(() => {});

        GET({}, 'testingresource/questionGroups', {})
            .then((res) => setQuestionGroups(res.data))
            .catch(() => {});
    }, [courseInfo]);
    const handleSaveTestToGroup = (test) => {
        setQuestionGroups(prev => prev.map(group => {
            if (group.id === currentGroup.id) {
                const updatedTests = editingTest
                    ? group.tests.map(t => (t.id === test.id ? test : t))
                    : [...group.tests, test];
                return { ...group, tests: updatedTests };
            }
            return group;
        }));

        setCurrentGroup(prev => ({
            ...prev,
            tests: editingTest
                ? prev.tests.map(t => (t.id === test.id ? test : t))
                : [...prev.tests, test],
        }));
    };
    const handleCourseModalOk = () => {
        courseForm.validateFields().then((values) => {
            fetchCourseInfo(values.courseId);
            setSearchParams({ courseId: values.courseId.toString() });
            setIsCourseModalVisible(false);
            setCurrentStep(0);
            setSelectedTestDetail(null);
        });
    };
    // 2) group handlers update that state
    const handleCreateGroup = newGroup => {
        setQuestionGroups(prev => [...prev, newGroup]);
    };

    const handleUpdateGroup = updatedGroup => {
        setQuestionGroups(prev =>
            prev.map(g => (g.id === updatedGroup.id ? updatedGroup : g))
        );
    };

    const handleDeleteGroup = groupId => {
        setQuestionGroups(prev => prev.filter(g => g.id !== groupId));
    };

    // 3) question handlers also update questionGroups
    const handleCreateQuestion = question => {
        setQuestionGroups(prev =>
            prev.map(g =>
                g.id === question.questionGroupId
                    ? { ...g, questions: [...(g.questions || []), question] }
                    : g
            )
        );
    };

    const handleUpdateQuestion = question => {
        setQuestionGroups(prev =>
            prev.map(g => {
                if (g.id !== question.questionGroupId) return g;
                return {
                    ...g,
                    questions: g.questions.map(q =>
                        q.id === question.id ? question : q
                    ),
                };
            })
        );
    };

    const handleDeleteQuestion = questionId => {
        setQuestionGroups(prev =>
            prev.map(g => ({
                ...g,
                questions: (g.questions || []).filter(q => q.id !== questionId),
            }))
        );
    };

    const handleCourseModalCancel = () => {
        setIsCourseModalVisible(false);
    };

    const handleTaskSelect = (task) => {
        if (task.testId) return;
        setActiveTask(task);
        setFinalTestData({ ...finalTestData, taskId: task.id });
    };

    const handleCreateTask = (newTask) => setTasks(prev => [...prev, newTask]);

    const handleUpdateTask = (updatedTask) => {
        setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    };

    const handleDeleteTask = (taskId) => {
        DELETE({}, `/taskresource/tasks/${taskId}`, {})
            .then(() => {
                setTasks(prev => prev.filter((t) => t.id !== taskId));
            })
            .catch(() => {});
    };

    const handleGroupDrawerOpen = (group) => {
        setCurrentGroup(group);
        group ? drawerForm.setFieldsValue({ name: group.name }) : drawerForm.resetFields();
        setIsGroupDrawerVisible(true);
    };

    const handleGroupDrawerClose = () => {
        setCurrentGroup(null);
        setIsGroupDrawerVisible(false);
    };
    const returnHandler = () =>{
        navigate("/admin")
    }

    const handleGroupDrawerSubmit = () => {
        drawerForm.validateFields().then((values) => {
            if (currentGroup) {
                setQuestionGroups(prev =>
                    prev.map(g => (g.id === currentGroup.id ? { ...g, ...values } : g))
                );
            } else {
                const newGroup = { id: Date.now(), tests: [], ...values };
                setQuestionGroups(prev => [...prev, newGroup]);
            }
            handleGroupDrawerClose();
        });
    };

    const deleteGroup = (id) => {
        setQuestionGroups(prev => prev.filter((g) => g.id !== id));
    };

    const addConfig = () => {
        setQuestionConfigs(prev => [...prev, { id: Date.now(), name: `Config ${prev.length + 1}` }]);
    };

    return (
        <div style={{ padding: 24, width: '100vw', minHeight: '100vh' }}>
            {courseError && <Alert message="Error loading course" type="error" />}

            <AnimatePresence>
                {!courseInfo && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: '#fff',
                            zIndex: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <div>
                            <h1 style={{ fontSize: '40px' }}>Select a course to start</h1>
                            <Button icon={<BookOutlined />} onClick={() => setIsCourseModalVisible(true)}>Select Course</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {courseInfo && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h1>{courseInfo.name}</h1>
                        <Button icon={<EditOutlined />} onClick={() => setIsCourseModalVisible(true)}>Change Course</Button>
                    </div>

                    <Steps current={currentStep} style={{ marginBottom: 24 }}>
                        <Step title="Linked Tests" />
                        <Step title="Basic Info" />
                        <Step title="Test Groups" />
                        <Step title="Test Management" />
                    </Steps>

                    {currentStep === 0 && (
                        <LinkedTestsStep
                            testGroups={questionGroups}
                            eduCourseId={eduCourseId}
                            selectedTest={selectedTestDetail}
                            setSelectedTest={setSelectedTestDetail}
                            onCreateClick={() => setCurrentStep(1)}
                        />
                    )}

                    {currentStep === 1 && (
                        <BasicInfoStep
                            finalTestData={finalTestData}
                            setFinalTestData={setFinalTestData}
                            basicInfoForm={basicInfoForm}
                            onNext={() => setCurrentStep(2)}
                            onBack={() => setCurrentStep(0)}
                            tasks={tasks}
                            activeTask={activeTask}
                            onTaskSelect={handleTaskSelect}
                            onCreateTask={handleCreateTask}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            openTaskDrawer={(task) => { setEditingTask(task); setIsTaskDrawerVisible(true); }}
                            closeTaskDrawer={() => { setEditingTask(null); setIsTaskDrawerVisible(false); }}
                            isDrawerVisible={isTaskDrawerVisible}
                            editingTask={editingTask}
                            courseInfo={courseInfo}
                        />
                    )}

                    {currentStep === 2 && (
                        <TestGroupsStep
                            questionGroups={questionGroups}
                            openDrawer={handleGroupDrawerOpen}
                            onCreateGroup={handleCreateGroup}
                            onUpdateGroup={handleUpdateGroup}
                            onDeleteGroup={handleDeleteGroup}
                            onCreateQuestion={handleCreateQuestion}
                            onUpdateQuestion={handleUpdateQuestion}
                            onDeleteQuestion={handleDeleteQuestion}
                            deleteGroup={deleteGroup}
                            currentGroup={currentGroup}
                            isDrawerVisible={isGroupDrawerVisible}
                            drawerForm={drawerForm}
                            onNext={() => setCurrentStep(3)}
                            onBack={() => setCurrentStep(1)}
                            onDrawerClose={handleGroupDrawerClose}
                            onDrawerSubmit={handleGroupDrawerSubmit}
                            testForm={testForm}
                            isTestDrawerVisible={isTestDrawerVisible}
                            setIsTestDrawerVisible={setIsTestDrawerVisible}
                            editingTest={editingTest}
                            setEditingTest={setEditingTest}
                            onSaveTest={handleSaveTestToGroup}
                            onTestEdit={(test) => {
                                setEditingTest(test);
                                testForm.setFieldsValue(test);
                                setIsTestDrawerVisible(true);
                            }}
                            onTestDelete={(id) => {
                                setQuestionGroups(prev =>
                                    prev.map(g =>
                                        g.id === currentGroup.id
                                            ? { ...g, tests: g.tests.filter(t => t.id !== id) }
                                            : g
                                    )
                                );
                            }}
                            onTestAddClick={() => setIsTestDrawerVisible(true)}
                        />
                    )}

                    {currentStep === 3 && (
                        <TestManagementStep
                            finalTestData={finalTestData}
                            activeTask={tasks.find(t => t.id === finalTestData.taskId)}
                            onAddConfig={handleAddConfig}
                            navigate={navigate}
                            questionGroups={questionGroups}
                            onDeleteConfig={handleDeleteConfig}
                            onUpdateConfig={handleUpdateConfig}
                            questionConfigs={questionConfigs}
                            onBack={() => setCurrentStep(2)}
                        />
                    )}
                </>
            )}
            <Modal
                title="Select Course"
                open={isCourseModalVisible}
                footer={[
                    <Button type={"dashed"} icon={<ArrowLeftOutlined />} key="custom" onClick={returnHandler}>
                        Back
                    </Button>,
                    <Button key="cancel" onClick={handleCourseModalCancel}>
                        Cancel
                    </Button>,
                    <Button key="ok" type="primary" onClick={handleCourseModalOk}>
                        OK
                    </Button>,
                ]}
                destroyOnClose
            >
                <Form form={courseForm} layout="vertical">
                    <Form.Item name="courseId" label="Course" rules={[{ required: true }]}>
                        <Select placeholder="Select course" loading={courseLoading}>
                            {courses?.map((c) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionsAdmin;
