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
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
    FolderOpenOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import "./questionAdmin.scss";
import {useCourseService} from "../services/useCourseService";

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

const QuestionsAdmin = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Використання кастомного хука для роботи з курсами
    const {
        courses,
        courseInfo,
        fetchCourseList,
        fetchCourseInfo,
        loading: courseLoading,
        error: courseError,
    } = useCourseService();

    // Стан для модального вікна вибору курсу
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
    const [courseForm] = Form.useForm();

    // Викликаємо завантаження списку курсів при першому рендері
    useEffect(() => {
        fetchCourseList();
    }, [fetchCourseList]);

    // Перевірка URL search params на наявність courseId і завантаження інформації про курс
    useEffect(() => {
        const courseIdParam = searchParams.get('courseId');
        if (courseIdParam) {
            fetchCourseInfo(courseIdParam);
        }
    }, [searchParams, fetchCourseInfo]);

    // Решта станів компоненту
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTestDetail, setSelectedTestDetail] = useState(null);
    const [questionGroups, setQuestionGroups] = useState([]);
    const [isGroupDrawerVisible, setIsGroupDrawerVisible] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [drawerForm] = Form.useForm();
    const [isTestDrawerVisible, setIsTestDrawerVisible] = useState(false);
    const [testForm] = Form.useForm();
    const [editingTest, setEditingTest] = useState(null);
    const [basicInfoForm] = Form.useForm();

    // Обчислення пов'язаних тестів для обраного курсу (використовуємо courseInfo)
    const linkedTests = questionGroups.reduce((acc, group) => {
        const testsForGroup = (group.tests || []).filter(
            (test) => test.courseId === courseInfo?.id
        );
        return acc.concat(testsForGroup);
    }, []);

    // Логіка для модального вікна вибору курсу
    const handleCourseModalOk = () => {
        courseForm.validateFields().then((values) => {
            const courseId = values.courseId;
            // Завантажуємо інформацію про курс
            fetchCourseInfo(courseId);
            // Записуємо courseId в URL
            setSearchParams({ courseId: courseId.toString() });
            setIsCourseModalVisible(false);
            // Скидання кроку і вибору тесту при зміні курсу
            setCurrentStep(0);
            setSelectedTestDetail(null);
            if (!editingTest && currentGroup) {
                setEditingTest(null);
                testForm.resetFields();
                setIsTestDrawerVisible(true);
            }
        });
    };

    const handleCourseModalCancel = () => {
        setIsCourseModalVisible(false);
    };

    // Логіка для роботи з групами питань (Drawer)
    const openGroupDrawer = (group) => {
        setCurrentGroup(group);
        if (group) {
            drawerForm.setFieldsValue(group);
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

    // Логіка для роботи з тестовими питаннями (Drawer)
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

    // Basic Test Information Logic
    const onBasicInfoFinish = (values) => {
        console.log('Basic Info Submitted:', values);
    };

    return (
        <div style={{ width: '100vw', minHeight: '100vh', boxSizing: 'border-box', padding: 24, position: 'relative' }}>
            {/* Вивід помилки завантаження курсу */}
            {courseError && (
                <Alert
                    message="Error"
                    description={courseError.message || 'Failed to load course data.'}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {/* Intro Screen Animation (відображається, якщо курс не вибраний) */}
            <AnimatePresence>
                { !courseInfo && (
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
                            <h1 style={{ fontSize: '48px' }}>
                                Please select a course to start creating tests!
                            </h1>
                            <Button icon={<BookOutlined />} onClick={() => setIsCourseModalVisible(true)} size="large">
                                Select Course
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header (відображається, коли курс вибраний) */}
            { courseInfo && (
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 style={{ color: '#2B2D42' }}>{courseInfo.name}</h1>
                    <Button icon={<EditOutlined />} onClick={() => setIsCourseModalVisible(true)}>
                        Change Course
                    </Button>
                </div>
            )}

            {/* Основний контент (відображається, коли курс вибраний) */}
            { courseInfo && (
                <>
                    <Steps current={currentStep} className="custom-steps" style={{ marginBottom: 24 }}>
                        <Step title="Linked Tests" />
                        <Step title="Test Management" />
                    </Steps>

                    { currentStep === 0 && (
                        <div>
                            <Row gutter={16}>
                                {/* Ліва колонка: Відображення пов'язаних тестів */}
                                <Col span={8}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Card
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span>All Linked Tests</span>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => setCurrentStep(1)}
                                                        style={{ marginLeft: 8 }}
                                                    >
                                                        Next: Create/Edit Test
                                                    </Button>
                                                </div>
                                            }
                                            bordered={false}
                                            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 16 }}
                                        >
                                            <List
                                                dataSource={linkedTests}
                                                renderItem={(test, index) => (
                                                    <motion.div
                                                        key={test.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <List.Item onClick={() => setSelectedTestDetail(test)} style={{ cursor: 'pointer' }}>
                                                            <List.Item.Meta
                                                                title={test.name || 'Unnamed Test'}
                                                                description={test.questionText || 'No description provided.'}
                                                            />
                                                        </List.Item>
                                                    </motion.div>
                                                )}
                                                locale={{ emptyText: 'No tests linked to this course yet.' }}
                                            />
                                        </Card>
                                    </motion.div>
                                </Col>
                                {/* Права колонка: Деталі вибраного тесту */}
                                <Col span={16}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        { selectedTestDetail ? (
                                            <Card title={selectedTestDetail.name} bordered={false} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                                                <p>
                                                    <strong>Question Text:</strong> {selectedTestDetail.questionText}
                                                </p>
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

                    { currentStep === 1 && (
                        <div>
                            <Button onClick={() => setCurrentStep(0)} style={{ marginBottom: 16 }}>
                                Back to Test List
                            </Button>
                            <Row gutter={16}>
                                {/* Ліва колонка: Групи питань */}
                                <Col span={12}>
                                    <Card
                                        title={
                                            <span>
                        <FolderOpenOutlined style={{ marginRight: 8 }} />
                        Question Groups
                      </span>
                                        }
                                        bordered={false}
                                        style={{ marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
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
                                                        <Button type="link" icon={<EditOutlined />} onClick={() => openGroupDrawer(group)}>
                                                            Edit
                                                        </Button>,
                                                        <Button type="link" icon={<DeleteOutlined />} onClick={() => deleteGroup(group.id)}>
                                                            Delete
                                                        </Button>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        title={
                                                            <>
                                                                <FolderOpenOutlined style={{ marginRight: 8 }} />
                                                                {group.name}
                                                            </>
                                                        }
                                                        description={
                                                            <>
                                                                <p>Marks: {group.marks}</p>
                                                                <p>Number of Questions: {group.questionsCount}</p>
                                                            </>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                            locale={{ emptyText: 'No question groups created yet' }}
                                        />

                                        {/* Drawer для створення/редагування групи питань */}
                                        <Drawer
                                            title={currentGroup ? `Edit Question Group: ${currentGroup.name}` : 'Create Question Group'}
                                            width={480}
                                            onClose={closeGroupDrawer}
                                            visible={isGroupDrawerVisible}
                                            footer={
                                                <div style={{ textAlign: 'right' }}>
                                                    <Button onClick={handleDrawerCancel} style={{ marginRight: 8 }}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleDrawerOk} type="primary">
                                                        Save
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <Form form={drawerForm} layout="vertical">
                                                <Form.Item
                                                    label="Group Name"
                                                    name="name"
                                                    rules={[{ required: true, message: 'Please input the group name!' }]}
                                                >
                                                    <Input placeholder="Enter group name" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Marks"
                                                    name="marks"
                                                    rules={[{ required: true, message: 'Please input marks!' }]}
                                                >
                                                    <InputNumber min={0} style={{ width: '100%' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Number of Questions"
                                                    name="questionsCount"
                                                    rules={[{ required: true, message: 'Please input number of questions!' }]}
                                                >
                                                    <InputNumber min={1} style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Form>
                                            <h3 style={{ marginTop: 24 }}>
                                                <FileTextOutlined /> Tests List
                                            </h3>
                                            <List
                                                bordered
                                                dataSource={currentGroup && currentGroup.tests ? currentGroup.tests : []}
                                                renderItem={(test) => (
                                                    <List.Item
                                                        actions={[
                                                            <Button type="link" icon={<EditOutlined />} onClick={() => editTest(test)}>
                                                                Edit
                                                            </Button>,
                                                            <Button type="link" icon={<DeleteOutlined />} onClick={() => deleteTest(test.id)}>
                                                                Delete
                                                            </Button>
                                                        ]}
                                                    >
                            <span>
                              <FileTextOutlined style={{ marginRight: 4 }} />
                                {test.name}
                            </span>
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

                                        {/* Nested Drawer для додавання/редагування тестових питань */}
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
                                                    <Button
                                                        onClick={() => {
                                                            setIsTestDrawerVisible(false);
                                                            setEditingTest(null);
                                                        }}
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleTestSubmit} type="primary">
                                                        Save Test
                                                    </Button>
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
                                                <Form.Item
                                                    label="Question Name"
                                                    name="name"
                                                    rules={[{ required: true, message: 'Please input the question name!' }]}
                                                >
                                                    <Input placeholder="Enter question name" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Question Text"
                                                    name="questionText"
                                                    rules={[{ required: true, message: 'Please input the question text!' }]}
                                                >
                                                    <Input.TextArea rows={3} placeholder="Enter question text" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Attachment"
                                                    name="attachmentUrl"
                                                    valuePropName="fileList"
                                                    getValueFromEvent={normFile}
                                                >
                                                    <Upload.Dragger customRequest={dummyRequest}>
                                                        <p className="ant-upload-drag-icon">📁</p>
                                                        <p className="ant-upload-text">Drag & drop file here</p>
                                                        <p className="ant-upload-hint">Optional (for the whole question)</p>
                                                    </Upload.Dragger>
                                                </Form.Item>
                                                {[0, 1, 2, 3].map((index) => (
                                                    <div
                                                        key={index}
                                                        style={{ border: '1px solid #f0f0f0', padding: 10, marginBottom: 10 }}
                                                    >
                                                        <h4>Answer {index + 1}</h4>
                                                        <Form.Item
                                                            label="Answer Text"
                                                            name={['answers', index, 'text']}
                                                            rules={[{ required: true, message: 'Please input answer text' }]}
                                                        >
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
                                </Col>

                                {/* Права колонка: Basic Information */}
                                <Col span={12}>
                                    <Card
                                        title={
                                            <span>
                        <FileTextOutlined style={{ marginRight: 8 }} />
                        Basic Information
                      </span>
                                        }
                                        bordered={false}
                                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                                    >
                                        <Form
                                            form={basicInfoForm}
                                            layout="vertical"
                                            initialValues={{
                                                testName: '',
                                                description: '',
                                                timeLimitation: 60,
                                                maxTestMark: 100
                                            }}
                                            onFinish={onBasicInfoFinish}
                                        >
                                            <Form.Item
                                                label="Test Name"
                                                name="testName"
                                                rules={[{ required: true, message: 'Please input the test name!' }]}
                                            >
                                                <Input placeholder="Enter test name" prefix={<FileTextOutlined />} />
                                            </Form.Item>
                                            <Form.Item label="Description" name="description">
                                                <Input.TextArea rows={4} placeholder="Enter test description" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Time Limitation (minutes)"
                                                name="timeLimitation"
                                                rules={[{ required: true, message: 'Please input the time limitation!' }]}
                                            >
                                                <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter time in minutes" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Max Test Mark"
                                                name="maxTestMark"
                                                rules={[{ required: true, message: 'Please input the maximum test mark!' }]}
                                            >
                                                <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter maximum mark" />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Save Basic Info
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )}
                </>
            )}

            {/* Modal для вибору курсу */}
            <Modal
                title="Select Course"
                visible={isCourseModalVisible}
                onOk={handleCourseModalOk}
                onCancel={handleCourseModalCancel}
                destroyOnClose
            >
                <Form form={courseForm} layout="vertical">
                    <Form.Item
                        name="courseId"
                        label="Course"
                        rules={[{ required: true, message: 'Please select a course' }]}
                    >
                        <Select placeholder="Select a course" loading={courseLoading}>
                            {courses &&
                                courses.map((course) => (
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
