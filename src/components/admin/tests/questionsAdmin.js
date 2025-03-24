import React, { useState } from 'react';
import {
    Row,
    Col,
    Button,
    Form,
    Input,
    InputNumber,
    Drawer,
    List,
    Modal,
    Upload,
    Checkbox
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import "./questionAdmin.scss";
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
    // State for question groups and their forms.
    const [questionGroups, setQuestionGroups] = useState([]);
    const [isGroupDrawerVisible, setIsGroupDrawerVisible] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
    const [groupForm] = Form.useForm();
    const [drawerForm] = Form.useForm();

    // State for nested (test question) drawer and its form.
    const [isTestDrawerVisible, setIsTestDrawerVisible] = useState(false);
    const [testForm] = Form.useForm();
    const [editingTest, setEditingTest] = useState(null); // null means "add new"

    // State for basic test information (right pane).
    const [basicInfoForm] = Form.useForm();

    // ----- Question Group Logic -----
    const openGroupDrawer = (group) => {
        setCurrentGroup(group);
        drawerForm.setFieldsValue(group);
        setIsGroupDrawerVisible(true);
    };

    const closeGroupDrawer = () => {
        setIsGroupDrawerVisible(false);
        setCurrentGroup(null);
    };

    const showGroupModal = (group = null) => {
        if (group) {
            groupForm.setFieldsValue(group);
        } else {
            groupForm.resetFields();
        }
        setIsGroupModalVisible(true);
        setCurrentGroup(group);
    };

    const handleGroupModalOk = () => {
        groupForm.validateFields().then((values) => {
            if (currentGroup) {
                setQuestionGroups((prev) =>
                    prev.map((g) => (g.id === currentGroup.id ? { ...g, ...values } : g))
                );
            } else {
                const newGroup = { id: Date.now(), tests: [], ...values };
                setQuestionGroups((prev) => [...prev, newGroup]);
            }
            setIsGroupModalVisible(false);
            setCurrentGroup(null);
        });
    };

    const handleGroupModalCancel = () => {
        setIsGroupModalVisible(false);
        setCurrentGroup(null);
    };

    const deleteGroup = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this group?',
            onOk: () => {
                setQuestionGroups((prev) => prev.filter((g) => g.id !== id));
            }
        });
    };

    const handleDrawerOk = () => {
        drawerForm.validateFields().then((values) => {
            setQuestionGroups((prev) =>
                prev.map((g) => (g.id === currentGroup.id ? { ...g, ...values } : g))
            );
            setIsGroupDrawerVisible(false);
            setCurrentGroup(null);
        });
    };

    const handleDrawerCancel = () => {
        setIsGroupDrawerVisible(false);
        setCurrentGroup(null);
    };

    // ----- Test Question (Nested) Drawer Logic -----
    const handleTestSubmit = () => {
        testForm.validateFields().then((values) => {
            if (editingTest) {
                // Update existing test question.
                const updatedTest = {
                    ...editingTest,
                    ...values,
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
                // Create a new test question.
                const newTest = {
                    id: Date.now(),
                    questionGroupId: currentGroup.id,
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

    // ----- Basic Information Logic (Right Pane) -----
    const onBasicInfoFinish = (values) => {
        console.log('Basic Info Submitted:', values);
    };

    return (
        <div style={{ width: '100vw', minHeight: '100vh', padding: 24, boxSizing: 'border-box' }}>
            <h1>Questions Admin</h1>
            <Row gutter={16}>
                {/* Left Side: Question Groups & Test Questions */}
                <Col span={12}>
                    <h2>Question Groups</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showGroupModal()}
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
                                    title={group.name}
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

                    {/* Modal for Creating/Editing a Question Group */}
                    <Modal
                        title={currentGroup ? 'Edit Question Group' : 'Create Question Group'}
                        visible={isGroupModalVisible}
                        onOk={handleGroupModalOk}
                        onCancel={handleGroupModalCancel}
                        destroyOnClose
                    >
                        <Form form={groupForm} layout="vertical">
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
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter marks" />
                            </Form.Item>
                            <Form.Item
                                label="Number of Questions"
                                name="questionsCount"
                                rules={[{ required: true, message: 'Please input number of questions!' }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter number of questions" />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* First-Level Drawer for Question Group Management */}
                    <Drawer
                        title={`Edit Question Group: ${currentGroup ? currentGroup.name : ''}`}
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
                                <Input />
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
                        <h3>Tests List</h3>
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
                                    <span>{test.name}</span>
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
                                setEditingTest(null);
                                testForm.resetFields();
                                setIsTestDrawerVisible(true);
                            }}
                        >
                            Add Test
                        </Button>
                    </Drawer>

                    {/* Nested (Sub) Drawer for Adding/Editing Test Questions */}
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
                </Col>

                {/* Right Side: Basic Test Information */}
                <Col span={12}>
                    <h2>Basic Information</h2>
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
                            <Input placeholder="Enter test name" />
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
                </Col>
            </Row>
        </div>
    );
};

export default QuestionsAdmin;
