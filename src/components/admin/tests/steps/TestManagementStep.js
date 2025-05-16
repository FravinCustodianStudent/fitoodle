import React, { useState } from 'react';
import { Row, Col, Card, Button, List, Drawer, Form, InputNumber, message, Modal } from 'antd';
import { FileTextOutlined, PlusOutlined, ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useHttp } from '../../../../hooks/http.hook';
import {useNavigate, useSearchParams} from "react-router-dom";

// TestManagementStep: review configs and create test via API
// Props:
// finalTestData: { testName, description, timeLimitation, taskId }
// activeTask: selected task object
// questionConfigs: initial array of configs {id, markPerQuestion, numberOfQuestions, questionGroupId}
// questionGroups: array of available groups {id, name}
// onBack: () => void
// onComplete: () => void (called after successful test creation)
const TestManagementStep = ({
                                finalTestData,
                                activeTask,
                                questionConfigs,
                                questionGroups,
                                onBack,
                                onComplete,
    navigate
                            }) => {
    const { POST,PUT } = useHttp();
    const [searchParams] = useSearchParams();

    const [localConfigs, setLocalConfigs] = useState(questionConfigs);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [form] = Form.useForm();

    // Open add-new-config drawer
    const openAddDrawer = () => {
        setEditingConfig(null);
        setSelectedGroup(null);
        form.resetFields();
        setDrawerVisible(true);
    };

    // Open edit-config drawer with pre-filled values
    const openEditDrawer = (cfg) => {
        setEditingConfig(cfg);
        const grp = questionGroups.find(g => g.id === cfg.questionGroupId) || null;
        setSelectedGroup(grp);
        form.setFieldsValue({
            markPerQuestion: cfg.markPerQuestion,
            numberOfQuestions: cfg.numberOfQuestions
        });
        setDrawerVisible(true);
    };

    // Close drawer
    const closeDrawer = () => {
        setDrawerVisible(false);
        setEditingConfig(null);
        setSelectedGroup(null);
    };

    // Save config (add or update)
    const handleSaveConfig = async () => {
        try {
            const values = await form.validateFields();
            if (!selectedGroup) {
                return message.error('Please select a question group');
            }
            const cfg = {
                id: editingConfig?.id || crypto.randomUUID(),
                markPerQuestion: values.markPerQuestion,
                numberOfQuestions: values.numberOfQuestions,
                questionGroupId: selectedGroup.id
            };
            setLocalConfigs(prev => {
                if (editingConfig) {
                    return prev.map(c => c.id === cfg.id ? cfg : c);
                } else {
                    return [...prev, cfg];
                }
            });
            closeDrawer();
        } catch {
            // ANTD handles validation errors
        }
    };

    // Confirm and create test via API
    const showCreateConfirm = () => {
        Modal.confirm({
            title: 'Confirm Create Test',
            content: 'Create test and link it to the selected task?',
            okText: 'Create',
            cancelText: 'Cancel',
            onOk: () => {
                const courseId = searchParams.get('courseId');

                const payload = {
                    name: finalTestData.testName,
                    description: finalTestData.description,
                    taskId: finalTestData.taskId,
                    timeLimitation: finalTestData.timeLimitation,
                    testContentConfigurationList: localConfigs.map(c => ({
                        markPerQuestion: c.markPerQuestion,
                        numberOfQuestions: c.numberOfQuestions,
                        questionGroupId: c.questionGroupId
                    }))
                };
                POST({}, 'testingresource/testConfigs', {}, payload)
                    .then(res => {
                        const newTestConfigId = res.data.id;
                        // update the task to link with this new test config
                        const updatedTask = { ...activeTask, testId: newTestConfigId };
                        return PUT({}, `taskresource/tasks/${activeTask.id}`, {}, updatedTask)
                            .then(()=>{
                                message.success('Test created and linked successfully');
                                const path = `/admin/courses?courseId=${courseId}`
                                navigate(path,{ replace: true });
                            });
                    })
                    .then(() => {

                        if (onComplete) onComplete();
                    })
                    .catch(() => {
                        message.error('Failed to create or link test');
                    });
            }
        });
    };

    return (
        <>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 16 }}>
                Back
            </Button>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Final Test Details" bordered={false}>
                        <p><strong>Test Name:</strong> {finalTestData.testName}</p>
                        <p><strong>Description:</strong> {finalTestData.description}</p>
                        <p><strong>Task:</strong> {activeTask?.name}</p>
                        <p><strong>Time Limit:</strong> {finalTestData.timeLimitation} minutes</p>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><FileTextOutlined /> Configurations</span>
                                <Button type="primary" icon={<PlusOutlined />} onClick={openAddDrawer}>
                                    Add Configuration
                                </Button>
                            </div>
                        }
                        bordered={false}
                    >
                        <List
                            dataSource={localConfigs}
                            renderItem={cfg => {
                                const grp = questionGroups.find(g => g.id === cfg.questionGroupId) || {};
                                return (
                                    <List.Item
                                        actions={[
                                            <Button icon={<EditOutlined />} onClick={() => openEditDrawer(cfg)} key="edit" />,
                                            <Button danger icon={<DeleteOutlined />} onClick={() => setLocalConfigs(prev => prev.filter(c => c.id !== cfg.id))} key="delete" />
                                        ]}
                                    >
                                        <strong>{grp.name || `Group ${cfg.questionGroupId}`}</strong>: {cfg.numberOfQuestions} questions, {cfg.markPerQuestion} marks/question
                                    </List.Item>
                                );
                            }}
                            locale={{ emptyText: 'No configurations added' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Button
                    type="primary"
                    onClick={showCreateConfirm}
                    disabled={localConfigs.length === 0}
                >
                    Create Test
                </Button>
            </div>

            <Drawer
                title={editingConfig ? 'Edit Configuration' : 'New Configuration'}
                width={360}
                visible={drawerVisible}
                onClose={closeDrawer}
                bodyStyle={{ paddingBottom: 80 }}
                destroyOnClose
                footer={(
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveConfig} type="primary">
                            Save
                        </Button>
                    </div>
                )}
            >
                <Form form={form} layout="vertical" initialValues={{ markPerQuestion: 1, numberOfQuestions: 2 }}>
                    <Form.Item
                        name="markPerQuestion"
                        label="Marks per Question"
                        rules={[{ required: true, message: 'Please enter marks per question' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="numberOfQuestions"
                        label="Number of Questions"
                        rules={[{ required: true, message: 'Please enter number of questions' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Select Question Group">
                        <List
                            dataSource={questionGroups}
                            renderItem={g => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type={selectedGroup?.id === g.id ? 'primary' : 'default'}
                                            onClick={() => setSelectedGroup(g)}
                                            key={g.id}
                                        >
                                            {selectedGroup?.id === g.id ? 'Selected' : 'Select'}
                                        </Button>
                                    ]}
                                    key={g.id}
                                >
                                    <List.Item.Meta title={g.name} />
                                </List.Item>
                            )}
                            style={{ maxHeight: 200, overflowY: 'auto' }}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default TestManagementStep;
