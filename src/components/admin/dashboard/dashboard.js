import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Typography, Button, Divider, Space, Tag, theme } from 'antd';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    Calendar,
    ArrowRight,
    BarChart2,
    GraduationCap,
    ClipboardCheck,
    ListTodo
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const { Title, Text } = Typography;

const Dashboard = () => {
    const { token } = theme.useToken();

    const stats = {
        totalStudents: 245,
        activeTests: 12,
        upcomingLessons: 8,
    };

    const groups = [
        {
            id: '1',
            name: 'Web Development Basics',
            studentsCount: 25,
            averageScore: 85,
            recentActivity: 'JavaScript Fundamentals Test completed',
        },
        {
            id: '2',
            name: 'Advanced Programming',
            studentsCount: 18,
            averageScore: 78,
            recentActivity: 'Data Structures Assignment due',
        },
        {
            id: '3',
            name: 'Mobile Development',
            studentsCount: 22,
            averageScore: 82,
            recentActivity: 'React Native Workshop scheduled',
        },
    ];

    const events = [
        {
            id: '1',
            title: 'JavaScript Basics Quiz',
            type: 'test',
            date: format(addDays(new Date(), 2), 'MMM dd, yyyy'),
            group: 'Web Development Basics',
        },
        {
            id: '2',
            title: 'React Components Workshop',
            type: 'lecture',
            date: format(addDays(new Date(), 1), 'MMM dd, yyyy'),
            group: 'Web Development Basics',
        },
        {
            id: '3',
            title: 'Database Design Project',
            type: 'task',
            date: format(addDays(new Date(), 4), 'MMM dd, yyyy'),
            group: 'Advanced Programming',
        },
    ];

    const getEventIcon = (type) => {
        switch (type) {
            case 'test': return <ClipboardCheck />;
            case 'lecture': return <GraduationCap />;
            case 'task': return <ListTodo />;
            default: return <ListTodo />;
        }
    };

    const QuickNavButton = ({ to, icon: Icon, label }) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', marginTop: 15 }}>
            <Link to={to}>
                <Card
                    hoverable
                    bordered
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        background: token.colorBgContainer,
                    }}
                >
                    <Space>
                        <Icon color={token.colorPrimary} />
                        <Text style={{ color: token.colorLink }}>{label}</Text>
                    </Space>
                    <ArrowRight color={token.colorPrimary} />
                </Card>
            </Link>
        </motion.div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
                <Title level={2}>Dashboard</Title>
                <Text>{format(new Date(), 'MMMM dd, yyyy')}</Text>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} md={6}><QuickNavButton to="/schedule" icon={Calendar} label="Schedule" /></Col>
                <Col xs={24} sm={12} md={6}><QuickNavButton to="/groups" icon={Users} label="Groups" /></Col>
                <Col xs={24} sm={12} md={6}><QuickNavButton to="/tests" icon={ClipboardCheck} label="Tests" /></Col>
                <Col xs={24} sm={12} md={6}><QuickNavButton to="/results" icon={BarChart2} label="Results" /></Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                {[{
                    icon: <Users color={token.colorPrimary} />, label: 'Total Students', value: stats.totalStudents
                }, {
                    icon: <BookOpen color={token.colorPrimary} />, label: 'Active Tests', value: stats.activeTests
                }, {
                    icon: <Calendar color={token.colorPrimary} />, label: 'Upcoming Lessons', value: stats.upcomingLessons
                }].map((stat, index) => (
                    <Col span={8} key={index}>
                        <Card bordered>
                            <Space direction="vertical">
                                <div>{stat.icon}</div>
                                <Title level={4}>{stat.label}</Title>
                                <Text>{stat.value}</Text>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={16} style={{ marginBottom: 32 }}>
                <Col span={12}>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Active Groups</Title>}
                        extra={<Link to="/groups" style={{ color: token.colorLink }}>View all</Link>}
                    >
                        {groups.map(group => (
                            <Card key={group.id} type="inner" style={{ marginBottom: 16 }}>
                                <Title level={5}>{group.name}</Title>
                                <Text type="secondary">{group.recentActivity}</Text>
                                <Divider style={{ margin: '12px 0' }} />
                                <Row gutter={12}>
                                    <Col><Tag color={token.colorPrimary}>Students: {group.studentsCount}</Tag></Col>
                                    <Col><Tag color={token.colorPrimary}>Avg. Score: {group.averageScore}%</Tag></Col>
                                </Row>
                            </Card>
                        ))}
                    </Card>
                </Col>

                <Col span={12}>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Upcoming Events</Title>}
                    >
                        {events.map(event => (
                            <Card key={event.id} type="inner" style={{ marginBottom: 16 }}>
                                <Row justify="space-between" align="middle">
                                    <Space>
                                        {getEventIcon(event.type)}
                                        <div>
                                            <Title level={5} style={{ margin: 0 }}>{event.title}</Title>
                                            <Text type="secondary">{event.group}</Text>
                                        </div>
                                    </Space>
                                    <Tag color={token.colorPrimary}>{event.date}</Tag>
                                </Row>
                            </Card>
                        ))}
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default Dashboard;