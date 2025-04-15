import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Row,
    Col,
    Card,
    Button,
    Form,
    Input,
    InputNumber,
    Drawer,
    List,
    Modal,
    Upload,
    Checkbox,
    Select,
    Steps,
    Spin,
    Alert,
    DatePicker,
    message
} from 'antd';
import {
    PlusOutlined,
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
    FolderOpenOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import "./questionAdmin.scss";
import { useCourseService } from "../services/useCourseService";
import {useHttp} from "../../../hooks/http.hook";

const { Step } = Steps;

// Dummy request for Upload to simulate instant success.
const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 0);
};

// Normalize the uploaded file value.
const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
};
const selectedListItemActive={

}
/**
 * CreateTaskDrawer Component
 * Handles both creation and editing of tasks.
 */
const CreateTaskDrawer = ({ visible, onClose, onCreate, selectedCourse, editingTask, onUpdate }) => {
    const { POST, DELETE } = useHttp();
    const currentUser = useSelector((state) => state.users.user);
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        if (editingTask) {
            form.setFieldsValue({
                name: editingTask.name,
                maxMarkValue: editingTask.maxMarkValue,
                createdAt: moment(editingTask.createdAt),
                deadline: moment(editingTask.deadline),
                description: editingTask.description
            });
            // Assume attached files could be set here if needed.
        } else {
            form.resetFields();
            setUploadedFiles([]);
        }
    }, [editingTask, form]);

    const beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('File must be smaller than 2MB!');
        }
        return isLt2M;
    };

    const customRequest = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await POST({}, 'fileresource/files', {}, formData);
            onSuccess(response.data, file);
        } catch (error) {
            onError(error);
        }
    };

    const handleRemoveFile = async (file) => {
        try {
            await DELETE({}, `/files/${file.response.id}`, {});
            setUploadedFiles((prev) => prev.filter((f) => f.uid !== file.uid));
            message.success('File removed successfully');
        } catch (error) {
            console.error('Failed to remove file:', error);
            message.error('Failed to remove file');
        }
    };

    const handleFinish = (values) => {
        const fileIds = uploadedFiles.map((file) => file.response.id);
        const taskPayload = {
            id: editingTask ? editingTask.id : Date.now().toString(),
            name: values.name,
            authorId: currentUser.id,
            eduCourseId: selectedCourse ? selectedCourse.id : '',
            maxMarkValue: values.maxMarkValue,
            createdAt: values.createdAt.format('YYYY-MM-DDTHH:mm:ss'),
            deadline: values.deadline.format('YYYY-MM-DD'),
            description: values.description,
            attachedFiles: fileIds,
            testId: editingTask ? editingTask.testId : null
        };

        // If we are editing a task, call the update callback.
        if (editingTask) {
            POST({}, 'taskresource/tasks', {}, taskPayload)
                .then((res) => {
                    onUpdate(res.data);
                    message.success('Task updated successfully');
                    form.resetFields();
                    setUploadedFiles([]);
                    onClose();
                })
                .catch((error) => {
                    console.error('Failed to update task:', error);
                    message.error('Failed to update task');
                });
        } else {
            // Creation of a new task.
            POST({}, 'taskresource/tasks', {}, taskPayload)
                .then((res) => {
                    onCreate(res.data);
                    message.success('Task created successfully');
                    form.resetFields();
                    setUploadedFiles([]);
                    onClose();
                })
                .catch((error) => {
                    console.error('Failed to create task:', error);
                    message.error('Failed to create task');
                });
        }
    };

    return (
        <Drawer
            title={editingTask ? "Edit Task" : "Create New Task"}
            placement="right"
            closable
            onClose={onClose}
            visible={visible}
            width={400}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Task Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter task name' }]}
                >
                    <Input placeholder="Enter task name" />
                </Form.Item>
                <Form.Item
                    label="Max Mark Value"
                    name="maxMarkValue"
                    rules={[{ required: true, message: 'Please enter max mark value' }]}
                >
                    <Input type="number" placeholder="Max Mark" />
                </Form.Item>
                <Form.Item
                    label="Creation Date"
                    name="createdAt"
                    rules={[{ required: true, message: 'Please select creation date' }]}
                >
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Deadline"
                    name="deadline"
                    rules={[{ required: true, message: 'Please select deadline' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter task description' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter task description" />
                </Form.Item>
                <Form.Item label="Attached Files">
                    <Upload.Dragger
                        name="file"
                        multiple
                        customRequest={customRequest}
                        beforeUpload={beforeUpload}
                        onRemove={handleRemoveFile}
                        fileList={uploadedFiles}
                        onChange={(info) => {
                            setUploadedFiles(info.fileList);
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <PlusCircleOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to upload</p>
                        <p className="ant-upload-hint">Max file size 2MB</p>
                    </Upload.Dragger>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        <PlusCircleOutlined /> {editingTask ? "Update Task" : "Create Task"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

const QuestionsAdmin = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        courses,
        courseInfo,
        fetchCourseList,
        fetchCourseInfo,
        loading: courseLoading,
        error: courseError,
    } = useCourseService();
    const { GET, POST, DELETE } = useHttp();

    // State for course modal
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
    const [courseForm] = Form.useForm();

    // Step management: 0 = Linked Tests, 1 = Basic Info, 2 = Test Group Management, 3 = Test Management
    const [currentStep, setCurrentStep] = useState(0);

    // Other state variables
    const [selectedTestDetail, setSelectedTestDetail] = useState(null);
    const [questionGroups, setQuestionGroups] = useState([]);
    const [isGroupDrawerVisible, setIsGroupDrawerVisible] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [drawerForm] = Form.useForm();
    const [isTestDrawerVisible, setIsTestDrawerVisible] = useState(false);
    const [testForm] = Form.useForm();
    const [editingTest, setEditingTest] = useState(null);
    const [basicInfoForm] = Form.useForm();
    const [finalTestData, setFinalTestData] = useState({
        testName: '',
        description: '',
        taskId:'',
        testContentConfigurationList:[],
        timeLimitation:60,
    });

    // New state for tasks (for the Task List in Basic Info)
    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    // For controlling the create/edit task drawer:
    const [isTaskDrawerVisible, setIsTaskDrawerVisible] = useState(false);
    const [editingTaskTask, setEditingTaskTask] = useState(null);

    // New state for question configs in Test Management
    const [questionConfigs, setQuestionConfigs] = useState([]);
    const [isConfigDrawerVisible, setIsConfigDrawerVisible] = useState(false);
    const [configForm] = Form.useForm();

    useEffect(() => {
        fetchCourseList();
    }, [fetchCourseList]);

    // When courseInfo is updated, fetch connected tasks using GET
    useEffect(() => {
        if (courseInfo) {
            GET({ eduCourseId: courseInfo.id }, 'taskresource/tasks/by/course', {})
                .then((res) => setTasks(res.data))
                .catch(() => message.error('Failed to fetch tasks for selected course'));
            GET({}, 'testingresource/questionGroups', {})
                .then((res) => setQuestionGroups(res.data))
                .catch(() => message.error('Failed to fetch tasks for selected course'));
        } else {
            setTasks([]);
        }
    }, [courseInfo, GET]);

    useEffect(() => {
        const courseIdParam = searchParams.get('courseId');
        if (courseIdParam) {
            fetchCourseInfo(courseIdParam);
        }
    }, [searchParams, fetchCourseInfo]);

    // Modal handlers for course selection
    const handleCourseModalOk = () => {
        courseForm.validateFields().then((values) => {
            const courseId = values.courseId;
            fetchCourseInfo(courseId);
            setSearchParams({ courseId: courseId.toString() });
            setIsCourseModalVisible(false);
            setCurrentStep(0);
            setSelectedTestDetail(null);
        });
    };

    const handleCourseModalCancel = () => {
        setIsCourseModalVisible(false);
    };

    // Group Management (Drawer) functions (Step 2)
    const openGroupDrawer = (group) => {
        setCurrentGroup(group);
        if (group) {
            drawerForm.setFieldsValue({ name: group.name });
        } else {
            drawerForm.resetFields();
        }
        setIsGroupDrawerVisible(true);
    };

    const closeGroupDrawer = () => {
        setIsGroupDrawerVisible(false);
        setCurrentGroup(null);
    };

    const handleDrawerOk = () => {
        drawerForm.validateFields().then((values) => {
            if (currentGroup) {
                setQuestionGroups((prev) =>
                    prev.map((g) => (g.id === currentGroup.id ? { ...g, ...values } : g))
                );
            } else {
                const newGroup = { id: Date.now(), tests: [], ...values };
                setQuestionGroups((prev) => [...prev, newGroup]);
            }
            closeGroupDrawer();
        });
    };

    const handleDrawerCancel = () => {
        closeGroupDrawer();
    };

    const deleteGroup = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this group?',
            onOk: () => {
                setQuestionGroups((prev) => prev.filter((g) => g.id !== id));
            }
        });
    };

    // Test Question management functions (remain unchanged)
    const handleTestSubmit = () => {
        testForm.validateFields().then((values) => {
            if (editingTest) {
                const updatedTest = {
                    ...editingTest,
                    ...values,
                    courseId: courseInfo ? courseInfo.id : null,
                    attachmentUrl:
                        values.attachmentUrl && values.attachmentUrl[0]
                            ? values.attachmentUrl[0].name
                            : '',
                    answers: values.answers.map((answer, index) => ({
                        id:
                            editingTest.answers && editingTest.answers[index]
                                ? editingTest.answers[index].id
                                : Date.now() + Math.random(),
                        text: answer.text,
                        correct: answer.correct
                    }))
                };

                setQuestionGroups((prev) =>
                    prev.map((g) => {
                        if (g.id === currentGroup.id) {
                            const updatedTests = g.tests.map((test) =>
                                test.id === editingTest.id ? updatedTest : test
                            );
                            return { ...g, tests: updatedTests };
                        }
                        return g;
                    })
                );
                setCurrentGroup((prev) => ({
                    ...prev,
                    tests: prev.tests.map((test) =>
                        test.id === editingTest.id ? updatedTest : test
                    )
                }));
            } else {
                const newTest = {
                    id: Date.now(),
                    questionGroupId: currentGroup.id,
                    courseId: courseInfo ? courseInfo.id : null,
                    ...values,
                    attachmentUrl:
                        values.attachmentUrl && values.attachmentUrl[0]
                            ? values.attachmentUrl[0].name
                            : '',
                    answers: values.answers.map((answer) => ({
                        id: Date.now() + Math.random(),
                        text: answer.text,
                        correct: answer.correct
                    }))
                };

                setQuestionGroups((prev) =>
                    prev.map((g) => {
                        if (g.id === currentGroup.id) {
                            return { ...g, tests: [...g.tests, newTest] };
                        }
                        return g;
                    })
                );
                setCurrentGroup((prev) => ({
                    ...prev,
                    tests: [...prev.tests, newTest]
                }));
            }
            setIsTestDrawerVisible(false);
            testForm.resetFields();
            setEditingTest(null);
        });
    };

    const editTest = (test) => {
        setEditingTest(test);
        const formValues = {
            ...test,
            attachmentUrl: test.attachmentUrl
                ? [
                    {
                        uid: test.attachmentUrl,
                        name: test.attachmentUrl,
                        status: 'done'
                    }
                ]
                : []
        };
        testForm.setFieldsValue(formValues);
        setIsTestDrawerVisible(true);
    };

    const deleteTest = (testId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this test question?',
            onOk: () => {
                setQuestionGroups((prev) =>
                    prev.map((g) => {
                        if (g.id === currentGroup.id) {
                            return { ...g, tests: g.tests.filter((test) => test.id !== testId) };
                        }
                        return g;
                    })
                );
                setCurrentGroup((prev) => ({
                    ...prev,
                    tests: prev.tests.filter((test) => test.id !== testId)
                }));
            }
        });
    };

    // Basic Information submission (Step 1) – auto-saving via onValuesChange.
    const onBasicInfoFinish = (values) => {
        console.log('Basic Info Submitted:', values);
    };

    // Config submission function (for Question Configs in Test Management)
    const onConfigFinish = (values) => {
        const newConfig = { id: Date.now(), ...values };
        setQuestionConfigs((prev) => [...prev, newConfig]);
        setIsConfigDrawerVisible(false);
        configForm.resetFields();
    };

    // Delete task function using DELETE hook.
    const deleteTask = (taskId) => {
        DELETE({}, `/taskresource/tasks/${taskId}`, {})
            .then(() => {
                setTasks((prev) => prev.filter((task) => task.id !== taskId));
                message.success('Task deleted successfully');
            })
            .catch(() => message.error('Failed to delete task'));
    };

    // When clicking on a task from the list, set it as active if testId is null.
    const handleTaskSelect = (task) => {
        if (task.testId) {
            message.warning('Task is already attached to a test and cannot be selected');
        } else {
            setFinalTestData({...finalTestData,taskId: task.id});
            setActiveTask(task);
        }
    };

    return (
        <div style={{ width: '100vw', minHeight: '100vh', boxSizing: 'border-box', padding: 24, position: 'relative' }}>
            {courseError && (
                <Alert
                    message="Error"
                    description={courseError.message || 'Failed to load course data.'}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {/* Intro Screen when no course selected */}
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
                            width: '100%',
                            height: '100%',
                            background: '#fff',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '48px' }}>Please select a course to start creating tests!</h1>
                            <Button icon={<BookOutlined />} onClick={() => setIsCourseModalVisible(true)} size="large">
                                Select Course
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header after course is selected */}
            {courseInfo && (
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 style={{ color: '#2B2D42' }}>{courseInfo.name}</h1>
                    <Button icon={<EditOutlined />} onClick={() => setIsCourseModalVisible(true)}>Change Course</Button>
                </div>
            )}

            {courseInfo && (
                <>
                    <Steps current={currentStep} className="custom-steps" style={{ marginBottom: 24 }}>
                        <Step title="Linked Tests" />
                        <Step title="Basic Info" />
                        <Step title="Test Group Management" />
                        <Step title="Test Management" />
                    </Steps>

                    {/* Step 0: Linked Tests */}
                    {currentStep === 0 && (
                        <div>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                        <Card
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span>All Linked Tests</span>
                                                    <Button type="primary" onClick={() => setCurrentStep(1)} style={{ marginLeft: 8 }}>
                                                        Create Task
                                                    </Button>
                                                </div>
                                            }
                                            bordered={false}
                                            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 16 }}
                                        >
                                            <List
                                                dataSource={questionGroups.reduce((acc, group) => acc.concat(group.tests || []), [])}
                                                renderItem={(test, index) => (
                                                    <motion.div key={test.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}>
                                                        <List.Item onClick={() => setSelectedTestDetail(test)} style={{ cursor: 'pointer' }}>
                                                            <List.Item.Meta title={test.name || 'Unnamed Test'} description={test.questionText || 'No description provided.'} />
                                                        </List.Item>
                                                    </motion.div>
                                                )}
                                                locale={{ emptyText: 'No tests linked to this course yet.' }}
                                            />
                                        </Card>
                                    </motion.div>
                                </Col>
                                <Col span={16}>
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                                        {selectedTestDetail ? (
                                            <Card title={selectedTestDetail.name} bordered={false} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                                                <p><strong>Question Text:</strong> {selectedTestDetail.questionText}</p>
                                            </Card>
                                        ) : (
                                            <Card bordered={false} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                                                <p>Please select a test from the list to view its details.</p>
                                            </Card>
                                        )}
                                    </motion.div>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div>
                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={() => setCurrentStep(0)}>Back to Linked Tests</Button>
                                <Button type="primary" onClick={() => setCurrentStep(2)}>Next: Test Group Management</Button>
                            </div>
                            <Row gutter={16}>
                                {/* Left Card: Basic Information */}
                                <Col span={12}>
                                    <Card
                                        title={<span><FileTextOutlined style={{ marginRight: 8 }} />Basic Information</span>}
                                        bordered={false}
                                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 24 }}
                                    >
                                        <Form
                                            form={basicInfoForm}
                                            layout="vertical"
                                            initialValues={{
                                                testName: finalTestData.testName,
                                                description: finalTestData.description,
                                                timeLimitation: finalTestData.timeLimitation,
                                            }}
                                            onValuesChange={(changedValues, allValues) => {
                                                setFinalTestData({...finalTestData,...allValues})
                                            }}
                                            onFinish={onBasicInfoFinish}
                                        >
                                            <Form.Item label="Test Name" name="testName" rules={[{ required: true, message: 'Please input the test name!' }]}>
                                                <Input placeholder="Enter test name" prefix={<FileTextOutlined />} />
                                            </Form.Item>
                                            <Form.Item label="Description" name="description">
                                                <Input.TextArea rows={4} placeholder="Enter test description" />
                                            </Form.Item>
                                            <Form.Item label="Time Limitation (minutes)" name="timeLimitation" rules={[{ required: true, message: 'Please input the time limitation!' }]}>
                                                <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter time in minutes" />
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </Col>
                                {/* Right Card: Task List */}
                                <Col span={12}>
                                    <Card
                                        title={<span><FileTextOutlined style={{ marginRight: 8 }} />Task List</span>}
                                        bordered={false}
                                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 24 }}
                                    >
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => { setEditingTaskTask(null); setIsTaskDrawerVisible(true); }}
                                            style={{ marginBottom: 16 }}
                                            block
                                        >
                                            Add Task
                                        </Button>
                                        <List
                                            bordered
                                            dataSource={tasks}
                                            renderItem={(task) => (
                                                <List.Item
                                                    style={{ cursor: task.testId ? 'not-allowed' : 'pointer', backgroundColor: activeTask && activeTask.id === task.id ? '#E1E1E4' : 'transparent' }}
                                                    onClick={() => handleTaskSelect(task)}
                                                    actions={[
                                                        <Button type="link" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); setEditingTaskTask(task); setIsTaskDrawerVisible(true); }} disabled={!!task.testId}>Edit</Button>,
                                                        <Button type="link" icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>Delete</Button>
                                                    ]}
                                                >
                                                    <List.Item.Meta title={task.name} description={task.description} />
                                                </List.Item>
                                            )}
                                            locale={{ emptyText: 'No tasks added yet.' }}
                                        />
                                    </Card>
                                    {/* Task Drawer for Create/Edit Task */}
                                    <CreateTaskDrawer
                                        visible={isTaskDrawerVisible}
                                        onClose={() => { setIsTaskDrawerVisible(false); setEditingTaskTask(null); }}
                                        onCreate={(newTask) => {
                                            setTasks((prev) => [...prev, newTask]);
                                        }}
                                        selectedCourse={courseInfo}
                                        editingTask={editingTaskTask}
                                        onUpdate={(updatedTask) => {
                                            setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t));
                                        }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}

                    {/* Step 2: Test Group Management */}
                    {currentStep === 2 && (
                        <div>
                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={() => setCurrentStep(1)}>Back to Basic Info</Button>
                                <Button type="primary" onClick={() => setCurrentStep(3)}>Next: Test Management</Button>
                            </div>
                            <Card
                                title={
                                    <span>
                    <FolderOpenOutlined style={{ marginRight: 8 }} />Question Groups
                  </span>
                                }
                                bordered={false}
                                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 24 }}
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => openGroupDrawer(null)}
                                    style={{ marginBottom: 16 }}
                                >
                                    Create Question Group
                                </Button>
                                <List
                                    bordered
                                    dataSource={questionGroups}
                                    renderItem={(group) => (
                                        <List.Item
                                            actions={[
                                                <Button type="link" icon={<EditOutlined />} onClick={() => openGroupDrawer(group)}>Edit</Button>,
                                                <Button type="link" icon={<DeleteOutlined />} onClick={() => deleteGroup(group.id)}>Delete</Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={<><FolderOpenOutlined style={{ marginRight: 8 }} />{group.name}</>}
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: 'No question groups created yet' }}
                                />

                                <Drawer
                                    title={currentGroup ? `Edit Question Group: ${currentGroup.name}` : 'Create Question Group'}
                                    width={480}
                                    onClose={closeGroupDrawer}
                                    visible={isGroupDrawerVisible}
                                    footer={
                                        <div style={{ textAlign: 'right' }}>
                                            <Button onClick={handleDrawerCancel} style={{ marginRight: 8 }}>Cancel</Button>
                                            <Button onClick={handleDrawerOk} type="primary">Save</Button>
                                        </div>
                                    }
                                >
                                    <Form form={drawerForm} layout="vertical">
                                        <Form.Item label="Group Name" name="name" rules={[{ required: true, message: 'Please input the group name!' }]}>
                                            <Input placeholder="Enter group name" />
                                        </Form.Item>
                                    </Form>
                                    <h3 style={{ marginTop: 24 }}><FileTextOutlined /> Tests List</h3>
                                    <List
                                        bordered
                                        dataSource={currentGroup && currentGroup.tests ? currentGroup.tests : []}
                                        renderItem={(test) => (
                                            <List.Item
                                                actions={[
                                                    <Button type="link" icon={<EditOutlined />} onClick={() => editTest(test)}>Edit</Button>,
                                                    <Button type="link" icon={<DeleteOutlined />} onClick={() => deleteTest(test.id)}>Delete</Button>
                                                ]}
                                            >
                                                <span><FileTextOutlined style={{ marginRight: 4 }} />{test.name}</span>
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: 'No tests available' }}
                                    />
                                    <Button
                                        type="dashed"
                                        style={{ marginTop: 16 }}
                                        block
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            if (!courseInfo) {
                                                setIsCourseModalVisible(true);
                                                return;
                                            }
                                            setEditingTest(null);
                                            testForm.resetFields();
                                            setIsTestDrawerVisible(true);
                                        }}
                                    >
                                        Add Test
                                    </Button>
                                </Drawer>

                                <Drawer
                                    title={editingTest ? 'Edit Test Question' : 'Add Test Question'}
                                    width={480}
                                    onClose={() => {
                                        setIsTestDrawerVisible(false);
                                        setEditingTest(null);
                                    }}
                                    visible={isTestDrawerVisible}
                                    destroyOnClose
                                    getContainer={document.body}
                                    footer={
                                        <div style={{ textAlign: 'right' }}>
                                            <Button onClick={() => { setIsTestDrawerVisible(false); setEditingTest(null); }} style={{ marginRight: 8 }}>Cancel</Button>
                                            <Button onClick={handleTestSubmit} type="primary">Save Test</Button>
                                        </div>
                                    }
                                >
                                    <Form
                                        form={testForm}
                                        layout="vertical"
                                        initialValues={{
                                            answers: [
                                                { text: '', correct: false },
                                                { text: '', correct: false },
                                                { text: '', correct: false },
                                                { text: '', correct: false }
                                            ]
                                        }}
                                    >
                                        <Form.Item label="Question Name" name="name" rules={[{ required: true, message: 'Please input the question name!' }]}>
                                            <Input placeholder="Enter question name" />
                                        </Form.Item>
                                        <Form.Item label="Question Text" name="questionText" rules={[{ required: true, message: 'Please input the question text!' }]}>
                                            <Input.TextArea rows={3} placeholder="Enter question text" />
                                        </Form.Item>
                                        <Form.Item label="Attachment" name="attachmentUrl" valuePropName="fileList" getValueFromEvent={normFile}>
                                            <Upload.Dragger customRequest={dummyRequest}>
                                                <p className="ant-upload-drag-icon">📁</p>
                                                <p className="ant-upload-text">Drag & drop file here</p>
                                                <p className="ant-upload-hint">Optional (for the whole question)</p>
                                            </Upload.Dragger>
                                        </Form.Item>
                                        {[0, 1, 2, 3].map((index) => (
                                            <div key={index} style={{ border: '1px solid #f0f0f0', padding: 10, marginBottom: 10 }}>
                                                <h4>Answer {index + 1}</h4>
                                                <Form.Item label="Answer Text" name={['answers', index, 'text']} rules={[{ required: true, message: 'Please input answer text' }]}>
                                                    <Input placeholder="Enter answer text" />
                                                </Form.Item>
                                                <Form.Item name={['answers', index, 'correct']} valuePropName="checked">
                                                    <Checkbox>Correct</Checkbox>
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </Form>
                                </Drawer>
                            </Card>
                        </div>
                    )}

                    {/* Step 3: Test Management */}
                    {currentStep === 3 && (
                        <div>
                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={() => setCurrentStep(2)}>Back to Test Group Management</Button>
                            </div>
                            <Row gutter={16}>
                                {/* Left Column: Final Test (Read-only) Card */}
                                <Col span={12}>
                                    <Card
                                        title={<span><FileTextOutlined style={{ marginRight: 8 }} />Final Test</span>}
                                        bordered={false}
                                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 24 }}
                                    >
                                        <p><strong>Test Name: </strong>{finalTestData.testName || 'N/A'}</p>
                                        <p><strong>Description: </strong>{finalTestData.description || 'N/A'}</p>
                                        <p><strong>Time Limitation (minutes): </strong>{finalTestData.timeLimitation || 'N/A'}</p>
                                        <p><strong>Max Test Mark: </strong>{finalTestData.maxTestMark || 'N/A'}</p>
                                    </Card>
                                </Col>
                                {/* Right Column: Question Configs Card */}
                                <Col span={12}>
                                    <Card
                                        title={<span><FileTextOutlined style={{ marginRight: 8 }} />Question Configs</span>}
                                        bordered={false}
                                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 24 }}
                                    >
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => setIsConfigDrawerVisible(true)}
                                            style={{ marginBottom: 16 }}
                                            block
                                        >
                                            Add Config
                                        </Button>
                                        <List
                                            bordered
                                            dataSource={questionConfigs}
                                            renderItem={(config) => (
                                                <List.Item>
                                                    <List.Item.Meta title={config.name} />
                                                </List.Item>
                                            )}
                                            locale={{ emptyText: 'No question configs added yet.' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <div style={{ textAlign: 'right' }}>
                                <Button type="primary" size="large" onClick={() => console.log('Creating Test...')}>
                                    Create Test
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal for Course Selection */}
            <Modal
                title="Select Course"
                visible={isCourseModalVisible}
                onOk={handleCourseModalOk}
                onCancel={handleCourseModalCancel}
                destroyOnClose
            >
                <Form form={courseForm} layout="vertical">
                    <Form.Item name="courseId" label="Course" rules={[{ required: true, message: 'Please select a course' }]}>
                        <Select placeholder="Select a course" loading={courseLoading}>
                            {courses && courses.map((course) => (
                                <Select.Option key={course.id} value={course.id}>
                                    {course.name}
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
