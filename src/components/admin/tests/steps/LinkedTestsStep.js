import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, List, Spin, Descriptions, Tag, Divider, Empty } from 'antd';
import { motion } from 'framer-motion';
import { useHttp } from '../../../../hooks/http.hook';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const LinkedTestsStep = ({
                             eduCourseId,
                             selectedTest,
                             setSelectedTest,
                             onCreateClick,
                         }) => {
    const { GET } = useHttp();
    const [tasks, setTasks] = useState([]);

    // New state for viewResults and loading
    const [viewResults, setViewResults] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);

    // Destructure selectedTest metadata (guard for null)
    const title = selectedTest?.name || 'Select a test';
    const description = selectedTest?.description || '';
    const deadline = selectedTest?.deadline || '';

    // Fetch tasks when course changes
    useEffect(() => {
        if (!eduCourseId) return;
        GET({ eduCourseId }, 'taskresource/tasks/by/course', {})
            .then(res => {
                const linked = res.data.filter(t => t.testId != null);
                setTasks(linked);
            })
            .catch(() => {});
    }, [eduCourseId, GET]);

    // Fetch results whenever the selectedTest changes
    useEffect(() => {
        if (!selectedTest?.id) {
            setViewResults([]);
            return;
        }

        setViewLoading(true);
        // 1) fetch taskResults
        GET({ taskId: selectedTest.id }, 'taskresource/taskResult/by/task', {})
            .then(res => res.data)
            // 2) fetch marks for each result
            .then(results =>
                Promise.all(
                    results.map(r =>
                        GET({ taskResultId: r.id }, 'taskresource/marks/by/testResult', {}).then(
                            markRes => ({
                                ...r,
                                markValue: markRes.data.markValue,
                                comment: markRes.data.comment,
                            })
                        )
                    )
                )
            )
            // 3) fetch user info for all studentIds
            .then(resultsWithMarks => {
                const studentIds = [
                    ...new Set(resultsWithMarks.map(r => r.studentId)),
                ];
                if (studentIds.length === 0) {
                    return { resultsWithMarks, users: [] };
                }
                const query = studentIds.map(id => `ids=${id}`).join('&');
                return GET({}, `userdataresource/users/by-ids?${query}`, {}).then(
                    usersRes => ({
                        resultsWithMarks,
                        users: usersRes.data,
                    })
                );
            })
            // 4) merge user into each result
            .then(({ resultsWithMarks, users }) => {
                const merged = resultsWithMarks.map(r => ({
                    ...r,
                    user: users.find(u => u.id === r.studentId),
                }));
                setViewResults(merged);
            })
            .catch(() => {})
            .finally(() => setViewLoading(false));
    }, [selectedTest, GET]);

    return (
        <Row gutter={16}>
            {/* Left: All linked tests */}
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
                                <Button type="primary" onClick={onCreateClick}>
                                    Create Test
                                </Button>
                            </div>
                        }
                        bordered={false}
                    >
                        <List
                            dataSource={tasks}
                            renderItem={(task, index) => {
                                const isSelected = selectedTest?.id === task.id;
                                return (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        style={{ marginBottom: 8 }}
                                    >
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                backgroundColor: isSelected ? '#f5f5f5' : '#ffffff',
                                            }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                position: 'relative',
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: isSelected ? 8 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    backgroundColor: '#D90429',
                                                }}
                                            />
                                            <List.Item
                                                onClick={() => setSelectedTest(task)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '12px 16px 12px 20px',
                                                }}
                                            >
                                                <List.Item.Meta
                                                    title={task.name || 'Unnamed Task'}
                                                    description={task.description || 'No description'}
                                                />
                                            </List.Item>
                                        </motion.div>
                                        <Divider />
                                    </motion.div>
                                );
                            }}
                            locale={{ emptyText: 'No linked tests' }}
                        />
                    </Card>
                </motion.div>
            </Col>

            {/* Right: Selected Test details + student results */}
            <Col xs={24} sm={24} md={16}>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {!selectedTest?.id ? (
                        <Card style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Empty description="Не обрано тест" />
                        </Card>
                    ) : (
                        <Card title={title} variant="borderless" style={{ marginBottom: 16 }}>
                            <p><strong>Description:</strong> {description}</p>
                            <p><strong>Deadline:</strong> {deadline}</p>
                            <Divider orientation="left">Test Results</Divider>
                            <Row gutter={[16, 16]}>
                                {viewResults.map(result => {
                                    const name = result.user
                                        ? `${result.user.firstName} ${result.user.lastName}`
                                        : 'Unknown Student';

                                    return (
                                        <Col xs={24} sm={12} key={result.id || result.studentId}>
                                            <Card
                                                type="inner"
                                                hoverable
                                                title={name}
                                            >
                                                <Card.Meta
                                                    description={
                                                        <Descriptions
                                                            column={1}
                                                            size="small"
                                                            bordered={true}
                                                        >
                                                            <Descriptions.Item label="Completed">
                                                                {result.completed ? (
                                                                    <Tag icon={<CheckCircleOutlined />} color="success">
                                                                        Yes
                                                                    </Tag>
                                                                ) : (
                                                                    <Tag icon={<CloseCircleOutlined />} color="error">
                                                                        No
                                                                    </Tag>
                                                                )}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Completion Time">
                                                                {result.completionTime ? (
                                                                    <>
                                                                        <CalendarOutlined style={{ marginRight: 4 }} />
                                                                        {new Date(result.completionTime).toLocaleString()}
                                                                    </>
                                                                ) : (
                                                                    '-'
                                                                )}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Mark">
                                                                {result.markValue}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="Comment">
                                                                {result.comment}
                                                            </Descriptions.Item>
                                                        </Descriptions>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Card>
                    )}
                </motion.div>
            </Col>
        </Row>
    );
};

export default LinkedTestsStep;
