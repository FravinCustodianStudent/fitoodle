import React from 'react';
import { Row, Col, Card, Form, Input, InputNumber, Button, List } from 'antd';
import { FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateTaskDrawer from '../drawers/CreateTaskDrawer';

const BasicInfoStep = ({
                           finalTestData,
                           setFinalTestData,
                           basicInfoForm,
                           onNext,
                           onBack,
                           tasks,
                           activeTask,
                           onTaskSelect,
                           onCreateTask,
                           onUpdateTask,
                           onDeleteTask,
                           openTaskDrawer,
                           closeTaskDrawer,
                           isDrawerVisible,
                           editingTask,
                           courseInfo
                       }) => (
    <>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={onBack}>Back</Button>
            <Button type="primary" onClick={onNext}>Next: Groups</Button>
        </div>
        <Row gutter={16}>
            <Col span={12}>
                <Card title="Basic Information" bordered={false}>
                    <Form
                        form={basicInfoForm}
                        layout="vertical"
                        initialValues={finalTestData}
                        onValuesChange={(changed, all) => setFinalTestData({ ...finalTestData, ...all })}
                    >
                        <Form.Item label="Test Name" name="testName" rules={[{ required: true }]}>
                            <Input placeholder="Enter name" prefix={<FileTextOutlined />} />
                        </Form.Item>
                        <Form.Item label="Description" name="description">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item label="Time Limitation" name="timeLimitation" rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col span={12}>
                <Card title="Task List" bordered={false}>
                    <Button block type="primary" icon={<PlusOutlined />} onClick={() => openTaskDrawer(null)} style={{ marginBottom: 16 }}>
                        Add Task
                    </Button>
                    <List
                        bordered
                        dataSource={tasks}
                        renderItem={(task) => (
                            <List.Item
                                onClick={() => onTaskSelect(task)}
                                style={{ cursor: task.testId ? 'not-allowed' : 'pointer', backgroundColor: activeTask?.id === task.id ? '#f5f5f5' : undefined }}
                                actions={[
                                    <Button type="link" icon={<EditOutlined />} onClick={e => { e.stopPropagation(); openTaskDrawer(task); }} disabled={!!task.testId} />,
                                    <Button type="link" icon={<DeleteOutlined />} onClick={e => { e.stopPropagation(); onDeleteTask(task.id); }} />
                                ]}
                            >
                                <List.Item.Meta title={task.name} description={task.description} />
                            </List.Item>
                        )}
                        locale={{ emptyText: 'No tasks yet' }}
                    />
                </Card>
            </Col>
        </Row>

        <CreateTaskDrawer
            visible={isDrawerVisible}
            onClose={closeTaskDrawer}
            selectedCourse={courseInfo}
            editingTask={editingTask}
            onCreate={onCreateTask}
            onUpdate={onUpdateTask}
        />
    </>
);

export default BasicInfoStep;
