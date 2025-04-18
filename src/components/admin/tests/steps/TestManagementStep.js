import React, { useState } from 'react';
import { Row, Col, Card, List, Button, Drawer, Form, InputNumber, Select } from 'antd';
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const TestManagementStep = ({
                                finalTestData = {},
                                activeTask,
                                questionGroups = [],
                                setFinalTestData,
                                onBack,
                                onNext
                            }) => {
    const [basicDrawerVisible, setBasicDrawerVisible] = useState(false);
    const [groupDrawerVisible, setGroupDrawerVisible] = useState(false);
    const [basicForm] = Form.useForm();
    const [groupForm] = Form.useForm();
    const [newConfigBasic, setNewConfigBasic] = useState({});

    const openBasicDrawer = () => {
        basicForm.resetFields();
        setBasicDrawerVisible(true);
    };

    const closeBasicDrawer = () => setBasicDrawerVisible(false);

    const handleBasicNext = async () => {
        try {
            const values = await basicForm.validateFields();
            setNewConfigBasic(values);
            setBasicDrawerVisible(false);
            setGroupDrawerVisible(true);
        } catch {
            // validation errors handled by ANTD
        }
    };

    const handleGroupBack = () => {
        groupForm.resetFields();
        setGroupDrawerVisible(false);
        setBasicDrawerVisible(true);
    };

    const handleGroupSave = async () => {
        try {
            const { questionGroupId } = await groupForm.validateFields();
            const config = {
                id: crypto.randomUUID(),
                markPerQuestion: newConfigBasic.markPerQuestion,
                numberOfQuestions: newConfigBasic.numberOfQuestions,
                questionGroupId
            };
            setFinalTestData(prev => ({
                ...prev,
                testContentConfigurationList: [
                    ...(prev.testContentConfigurationList || []),
                    config
                ]
            }));
            setGroupDrawerVisible(false);
        } catch {
            // validation errors handled by ANTD
        }
    };

    const configs = finalTestData.testContentConfigurationList || [];

    return (
        <>
            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Button onClick={onBack}>← Back</Button>
            </div>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title={<><FileTextOutlined /> Final Test Details</>} bordered={false}>
                        <p><strong>Based on Task:</strong> {activeTask?.name || 'Not selected'}</p>
                        <p><strong>Name:</strong> {finalTestData.testName || '—'}</p>
                        <p><strong>Description:</strong> {finalTestData.description || '—'}</p>
                        <p><strong>Time:</strong> {finalTestData.timeLimitation != null ? `${finalTestData.timeLimitation} minutes` : '—'}</p>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title={<><FileTextOutlined /> Test Configurations</>} bordered={false}>
                        <Button
                            block
                            icon={<PlusOutlined />}
                            onClick={openBasicDrawer}
                            style={{ marginBottom: 16 }}
                        >
                            Add Configuration
                        </Button>

                        <List
                            bordered
                            dataSource={configs}
                            renderItem={cfg => {
                                const group = questionGroups.find(g => g.id === cfg.questionGroupId) || {};
                                return (
                                    <List.Item>
                                        <strong>{group.name || 'Unknown Group'}</strong>: {cfg.numberOfQuestions} questions, {cfg.markPerQuestion} marks/question
                                    </List.Item>
                                );
                            }}
                            locale={{ emptyText: 'No configurations added yet' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer
                title="New Configuration — Step 1: Basic Info"
                width={400}
                onClose={closeBasicDrawer}
                visible={basicDrawerVisible}
                destroyOnClose
                footer={(
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={closeBasicDrawer} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleBasicNext}>
                            Next
                        </Button>
                    </div>
                )}
            >
                <Form form={basicForm} layout="vertical">
                    <Form.Item
                        name="markPerQuestion"
                        label="Mark Per Question"
                        rules={[{ required: true, message: 'Enter marks per question' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="numberOfQuestions"
                        label="Number Of Questions"
                        rules={[{ required: true, message: 'Enter number of questions' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="New Configuration — Step 2: Select Question Group"
                width={400}
                onClose={handleGroupBack}
                visible={groupDrawerVisible}
                destroyOnClose
                footer={(
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={handleGroupBack} style={{ marginRight: 8 }}>
                            Back
                        </Button>
                        <Button type="primary" onClick={handleGroupSave}>
                            Save
                        </Button>
                    </div>
                )}
            >
                <Form form={groupForm} layout="vertical">
                    <Form.Item
                        name="questionGroupId"
                        label="Question Group"
                        rules={[{ required: true, message: 'Select a question group' }]}
                    >
                        <Select placeholder="Select a group">
                            {questionGroups.map(g => (
                                <Option key={g.id} value={g.id}>{g.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default TestManagementStep;
