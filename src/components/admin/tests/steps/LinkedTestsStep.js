import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, List } from 'antd';
import { motion } from 'framer-motion';
import {useHttp} from "../../../../hooks/http.hook";

const LinkedTestsStep = ({
                             eduCourseId,
                             selectedTest,
                             setSelectedTest,
                             onCreateClick
                         }) => {
    const { GET } = useHttp();
    const [tasks, setTasks] = useState([]);

    // Fetch tasks on mount or when course ID changes
    useEffect(() => {
        console.log(eduCourseId);
        if (!eduCourseId) return;
        GET({ eduCourseId }, 'taskresource/tasks/by/course', {})
            .then(res => {
                // Only include tasks that have a linked testId
                const linked = res.data.filter(t => t.testId != null);
                setTasks(linked);
            })
            .catch(() => {});
    }, [eduCourseId, GET]);

    return (
        <Row gutter={16}>
            <Col span={8}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>All Linked Tests</span>
                                <Button type="primary" onClick={onCreateClick}>Create Task</Button>
                            </div>
                        }
                        bordered={false}
                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                    >
                        <List
                            dataSource={tasks}
                            renderItem={(task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <List.Item
                                        onClick={() => setSelectedTest(task)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <List.Item.Meta
                                            title={task.name || 'Unnamed Task'}
                                            description={task.description || 'No description'}
                                        />
                                    </List.Item>
                                </motion.div>
                            )}
                            locale={{ emptyText: 'No linked tests' }}
                        />
                    </Card>
                </motion.div>
            </Col>

            <Col span={16}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {selectedTest ? (
                        <Card title={selectedTest.name} bordered={false}>
                            <p><strong>Description:</strong> {selectedTest.description}</p>
                            <p><strong>Deadline:</strong> {selectedTest.deadline}</p>
                        </Card>
                    ) : (
                        <Card bordered={false}>
                            <p>Please select a test from the list to view details.</p>
                        </Card>
                    )}
                </motion.div>
            </Col>
        </Row>
    );
};

export default LinkedTestsStep;
