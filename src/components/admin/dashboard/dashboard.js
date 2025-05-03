import React from 'react';
import {Row, Col, Card, List, Tag, Button, Divider, Progress, Typography, Space, theme, Statistic} from 'antd';
import { motion } from 'framer-motion'
import {
    BookOutlined,
    FormOutlined,
    FileTextOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    RiseOutlined,
    WarningOutlined,
    BellOutlined,
    PlusOutlined,
    CalendarOutlined,
    RightOutlined,
    UserOutlined
} from '@ant-design/icons';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import "./dashboard.scss";
const { Title, Text } = Typography;

const Dashboard = () => {
    const { token } = theme.useToken();

    // Mock data
    const courses = [
        { title: 'Introduction to Computer Science', status: 'active' },
        { title: 'Advanced Mathematics', status: 'active' },
        { title: 'Modern World History', status: 'inactive' }
    ];
    const tasks = [
        { title: 'CS101 Assignment 1', description: 'Complete the first assignment', status: 'pending', priority: 'high', dueDate: '2025-05-01', courseName: 'Introduction to Computer Science' },
        { title: 'Math301 Quiz 1', description: 'Take the first quiz', status: 'in-progress', priority: 'medium', dueDate: '2025-05-03', courseName: 'Advanced Mathematics' },
        { title: 'History202 Project', description: 'Research for the final project', status: 'overdue', priority: 'low', dueDate: '2025-04-15', courseName: 'Modern World History' }
    ];
    const tests = [
        { title: 'Math301 Quiz 1', status: 'upcoming' },
        { title: 'CS101 Midterm', status: 'upcoming' }
    ];
    const students = [
        { name: 'Alex Johnson', status: 'active' },
        { name: 'Emma Davis', status: 'active' },
        { name: 'John Smith', status: 'inactive' }
    ];
    const schedule = [
        { title: 'CS101 Lecture', startTime: '2025-04-27T09:00:00', endTime: '2025-04-27T10:00:00', type: 'class', courseName: 'Introduction to Computer Science', location: 'Room 101' },
        { title: 'Math301 Exam', startTime: '2025-04-27T13:00:00', endTime: '2025-04-27T15:00:00', type: 'exam', courseName: 'Advanced Mathematics', location: 'Room 202' }
    ];

    // Summary stats
    const activeCourses = courses.filter(c => c.status === 'active').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
    const upcomingTests = tests.filter(t => t.status === 'upcoming').length;
    const activeStudents = students.filter(s => s.status === 'active').length;

    const today = new Date();
    const todayEvents = schedule.filter(e => {
        const d = new Date(e.startTime);
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    });

    // Stats card definitions using theme tokens
    const stats = [
        { title: 'Active Courses', icon: <BookOutlined />, value: activeCourses, color: token.colorPrimary },
        { title: 'Active Students', icon: <TeamOutlined />, value: activeStudents, color: token.colorSuccess },
        { title: 'Pending Tasks', icon: <FormOutlined />, value: pendingTasks, color: token.colorWarning },
        { title: 'Upcoming Tests', icon: <FileTextOutlined />, value: upcomingTests, color: token.colorInfo },
    ];

    // Recent activity
    const recentActivity = [
        { title: 'New assignment submitted', description: 'Alex Johnson submitted CS101 Assignment', time: '10 minutes ago', icon: <FormOutlined style={{ color: token.colorPrimary }} /> },
        { title: 'Test results ready',      description: 'Math301 Quiz results are now available', time: '1 hour ago',     icon: <FileTextOutlined style={{ color: token.colorInfo }} /> },
        { title: 'New course enrollment',   description: 'Emma Davis enrolled in Digital Marketing', time: '3 hours ago', icon: <BookOutlined style={{ color: token.colorSuccess }} /> },
        { title: 'Schedule updated',        description: 'Office hours for CS101 have been rescheduled', time: '5 hours ago', icon: <CalendarOutlined style={{ color: token.colorWarning }} /> },
    ];

    return (
        <div className="overview-dashboard">
            <Row style={{padding:"30px 30px 0px 0px"}} gutter={[24, 24]}>
                {/* Hero Banner */}
                <Col span={24}>
                    <Card bordered={false} className="hero-banner">
                        <div className="hero-banner-content">
                            <Row gutter={24} align="middle">
                                <Col xs={24} md={16}>
                                    <div className="welcome-section">
                                        <Title style={{color:"white"}} level={2} className="welcome-title">
                                            Welcome back, John Doe
                                        </Title>
                                        <Text className="welcome-text">
                                            Here's what's happening in your educational institution today
                                        </Text>
                                    </div>

                                    <Row gutter={[16, 16]}>
                                        <Col>
                                            <Card
                                                className="stat-card"
                                                hoverable={false}               // turn off antd's default hover style
                                                style={{ position: 'relative', overflow: 'hidden' }}
                                            >
                                                <Statistic
                                                    title={
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                                                            Total Students
                                                          </span>
                                                    }
                                                    value={activeStudents}
                                                    prefix={<TeamOutlined style={{ color: 'white' }} />}
                                                    valueStyle={{ color: 'white' }}
                                                />


                                            </Card>
                                        </Col>

                                        <Col>
                                            <Card className="stat-card">
                                                <Statistic
                                                    title={
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        Today's Classes
                      </span>
                                                    }
                                                    value={todayEvents.filter(e => e.type === 'class').length}
                                                    prefix={<BookOutlined />}
                                                    valueStyle={{ color: 'white' }}
                                                />
                                            </Card>
                                        </Col>

                                        <Col>
                                            <Card className="stat-card">
                                                <Statistic
                                                    title={
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        Active Courses
                      </span>
                                                    }
                                                    value={activeCourses}
                                                    prefix={<RiseOutlined />}
                                                    valueStyle={{ color: 'white' }}
                                                />
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="stat-card">
                                                <Statistic
                                                    title={
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        Active Courses
                      </span>
                                                    }
                                                    value={activeCourses}
                                                    prefix={<RiseOutlined />}
                                                    valueStyle={{ color: 'white' }}
                                                />
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>


                            </Row>
                        </div>

                        <div id="overlay-background" />
                    </Card>
                </Col>

                {/* Upcoming Tasks */}
                <Col xs={24} md={16}>
                    <Card
                        title={<Title level={4}>Upcoming Tasks</Title>}
                        extra={<Button type="link">View All <RightOutlined /></Button>}
                        bordered={false}
                    >
                        <List
                            dataSource={tasks.filter(t => ['pending', 'in-progress', 'overdue'].includes(t.status)).slice(0, 5)}
                            renderItem={task => (
                                <List.Item
                                    actions={[
                                        <Button type="link" size="small">View</Button>,
                                        <Button type="link" size="small">Edit</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            task.status === 'overdue' ? (
                                                <WarningOutlined style={{ color: token.colorError, fontSize: 20 }} />
                                            ) : task.status === 'in-progress' ? (
                                                <ClockCircleOutlined style={{ color: token.colorPrimary, fontSize: 20 }} />
                                            ) : (
                                                <FormOutlined style={{ color: token.colorWarning, fontSize: 20 }} />
                                            )
                                        }
                                        title={
                                            <Space>
                                                <Text strong>{task.title}</Text>
                                                <Tag color={ task.status === 'overdue' ? 'error'
                                                    : task.status === 'in-progress' ? 'processing'
                                                        : 'warning' }>
                                                    {task.status.replace('-', ' ')}
                                                </Tag>
                                                <Tag color={ task.priority === 'high' ? 'error'
                                                    : task.priority === 'medium' ? 'warning'
                                                        : 'success' }>
                                                    {task.priority}
                                                </Tag>
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                <div>{task.description.slice(0, 60)}...</div>
                                                <div style={{ fontSize: 12, color: token.colorTextDescription, marginTop: 4 }}>
                                                    <span>Course: {task.courseName}</span>
                                                    <span style={{ margin: '0 8px' }}>•</span>
                                                    <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Recent Activity */}
                <Col xs={24} md={8}>
                    <Card
                        title={<Title level={4}>Upcoming Tasks</Title>}
                        extra={<Button type="link">View All <RightOutlined /></Button>}
                        bordered={false}
                    >
                        <List
                            dataSource={tasks.filter(t => ['pending', 'in-progress', 'overdue'].includes(t.status)).slice(0, 5)}
                            renderItem={task => (
                                <List.Item
                                    actions={[
                                        <Button type="link" size="small">View</Button>,
                                        <Button type="link" size="small">Edit</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            task.status === 'overdue' ? (
                                                <WarningOutlined style={{ color: token.colorError, fontSize: 20 }} />
                                            ) : task.status === 'in-progress' ? (
                                                <ClockCircleOutlined style={{ color: token.colorPrimary, fontSize: 20 }} />
                                            ) : (
                                                <FormOutlined style={{ color: token.colorWarning, fontSize: 20 }} />
                                            )
                                        }
                                        title={
                                            <Space>
                                                <Text strong>{task.title}</Text>
                                                <Tag color={ task.status === 'overdue' ? 'error'
                                                    : task.status === 'in-progress' ? 'processing'
                                                        : 'warning' }>
                                                    {task.status.replace('-', ' ')}
                                                </Tag>
                                                <Tag color={ task.priority === 'high' ? 'error'
                                                    : task.priority === 'medium' ? 'warning'
                                                        : 'success' }>
                                                    {task.priority}
                                                </Tag>
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                <div>{task.description.slice(0, 60)}...</div>
                                                <div style={{ fontSize: 12, color: token.colorTextDescription, marginTop: 4 }}>
                                                    <span>Course: {task.courseName}</span>
                                                    <span style={{ margin: '0 8px' }}>•</span>
                                                    <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Today's Schedule */}
                <Col xs={24} md={12}>
                    <Card
                        title={<Title level={4}>Today's Schedule</Title>}
                        extra={<Button type="link">Calendar View <RightOutlined /></Button>}
                        bordered={false}
                    >
                        {todayEvents.length > 0 ? (
                            <List
                                dataSource={todayEvents}
                                renderItem={event => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <div style={{
                                                    width: 40, textAlign: 'center', fontSize: 20,
                                                    color:
                                                        event.type === 'class' ? token.colorPrimary
                                                            : event.type === 'exam' ? token.colorError
                                                                : event.type === 'office-hours' ? token.colorSuccess
                                                                    : token.colorWarning
                                                }}>
                                                    {event.type === 'class' ? <BookOutlined />
                                                        : event.type === 'exam' ? <FileTextOutlined />
                                                            : event.type === 'office-hours' ? <TeamOutlined />
                                                                : <ClockCircleOutlined />}
                                                </div>
                                            }
                                            title={
                                                <Space>
                                                    <Text strong>{event.title}</Text>
                                                    <Tag color={
                                                        event.type === 'class' ? 'processing'
                                                            : event.type === 'exam' ? 'error'
                                                                : event.type === 'office-hours' ? 'success'
                                                                    : 'warning'
                                                    }>
                                                        {event.type}
                                                    </Tag>
                                                </Space>
                                            }
                                            description={
                                                <div>
                                                    <div>{event.description}</div>
                                                    <div style={{ fontSize: 12, color: token.colorTextDescription, marginTop: 4 }}>
                                                        {event.courseName && <>
                                                            <span>Course: {event.courseName}</span>
                                                            <span style={{ margin: '0 8px' }}>•</span>
                                                        </>}
                                                        <span>
                              {format(new Date(event.startTime), 'h:mm a')} – {format(new Date(event.endTime), 'h:mm a')}
                            </span>
                                                        {event.location && <>
                                                            <span style={{ margin: '0 8px' }}>•</span>
                                                            <span>{event.location}</span>
                                                        </>}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2em 0' }}>
                                <Text type="secondary">No events scheduled for today</Text>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Quick Actions */}
                <Col xs={24} md={12}>
                    <Card title={<Title level={4}>Quick Actions</Title>} bordered={false}>
                        <Row gutter={[16, 16]}>
                            <Col xs={12}>
                                <Button type="primary" icon={<FormOutlined />} block>
                                    Create Task
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <Button type="primary" icon={<FileTextOutlined />} block>
                                    Schedule Test
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <Button type="primary" icon={<TeamOutlined />} block>
                                    Add Student
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <Button type="primary" icon={<BookOutlined />} block>
                                    Create Course
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <Button type="primary" icon={<CalendarOutlined />} block>
                                    Schedule Event
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <Button type="primary" icon={<BellOutlined />} block>
                                    Send Notification
                                </Button>
                            </Col>
                        </Row>

                        <Divider />

                        <Title level={5}>Course Completion Progress</Title>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {[
                                { name: 'Introduction to Computer Science', pct: 68 },
                                { name: 'Advanced Mathematics', pct: 42 },
                                { name: 'Modern World History', pct: 51 }
                            ].map(item => (
                                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text>{item.name}</Text>
                                    <Text type="secondary">{item.pct}%</Text>
                                    <Progress percent={item.pct} size="small" />
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
