import React from 'react';
import { Link } from 'react-router-dom';
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
import './dashboard.scss';

const Dashboard = () => {
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
            status: 'upcoming',
        },
        {
            id: '2',
            title: 'React Components Workshop',
            type: 'lecture',
            date: format(addDays(new Date(), 1), 'MMM dd, yyyy'),
            group: 'Web Development Basics',
            status: 'upcoming',
        },
        {
            id: '3',
            title: 'Database Design Project',
            type: 'task',
            date: format(addDays(new Date(), 4), 'MMM dd, yyyy'),
            group: 'Advanced Programming',
            status: 'upcoming',
        },
    ];

    const performanceData = [
        { month: 'Jan', averageScore: 75, completionRate: 85 },
        { month: 'Feb', averageScore: 78, completionRate: 82 },
        { month: 'Mar', averageScore: 82, completionRate: 88 },
        { month: 'Apr', averageScore: 80, completionRate: 85 },
        { month: 'May', averageScore: 85, completionRate: 90 },
    ];

    // QuickNavButton as a reusable component.
    const QuickNavButton = ({ to, icon: Icon, label }) => (
        <Link to={to} className="dashboard__quicknav-button">
            <div className="dashboard__quicknav-button__left">
                <Icon className="dashboard__quicknav-icon" />
                <span className="dashboard__quicknav-label">{label}</span>
            </div>
            <ArrowRight className="dashboard__quicknav-arrow" />
        </Link>
    );

    return (
        <div className="dashboard">
            <header className="dashboard__header">
                <h1 className="dashboard__title">Dashboard</h1>
                <div className="dashboard__date">{format(new Date(), 'MMMM dd, yyyy')}</div>
            </header>

            {/* Quick Navigation Links */}
            <div className="dashboard__quicknav">
                <QuickNavButton to="/schedule" icon={Calendar} label="Schedule" />
                <QuickNavButton to="/groups" icon={Users} label="Groups" />
                <QuickNavButton to="/tests" icon={ClipboardCheck} label="Tests" />
                <QuickNavButton to="/results" icon={BarChart2} label="Results" />
            </div>

            {/* Overview Stats */}
            <div className="dashboard__stats">
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon-wrapper dashboard__stat-icon-wrapper--blue">
                        <Users className="dashboard__stat-icon" />
                    </div>
                    <div className="dashboard__stat-info">
                        <h2 className="dashboard__stat-label">Total Students</h2>
                        <p className="dashboard__stat-value">{stats.totalStudents}</p>
                    </div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon-wrapper dashboard__stat-icon-wrapper--green">
                        <BookOpen className="dashboard__stat-icon" />
                    </div>
                    <div className="dashboard__stat-info">
                        <h2 className="dashboard__stat-label">Active Tests</h2>
                        <p className="dashboard__stat-value">{stats.activeTests}</p>
                    </div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon-wrapper dashboard__stat-icon-wrapper--purple">
                        <Calendar className="dashboard__stat-icon" />
                    </div>
                    <div className="dashboard__stat-info">
                        <h2 className="dashboard__stat-label">Upcoming Lessons</h2>
                        <p className="dashboard__stat-value">{stats.upcomingLessons}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard__modules">
                {/* Active Groups Module */}
                <div className="dashboard__module">
                    <div className="dashboard__module-header">
                        <h2 className="dashboard__module-title">Active Groups</h2>
                        <Link to="/groups" className="dashboard__module-link">
                            View all
                        </Link>
                    </div>
                    <div className="dashboard__module-list">
                        {groups.map((group) => (
                            <div key={group.id} className="dashboard__module-item">
                                <div className="dashboard__group-info">
                                    <h3 className="dashboard__group-name">{group.name}</h3>
                                    <p className="dashboard__group-activity">{group.recentActivity}</p>
                                </div>
                                <div className="dashboard__group-stats">
                                    <div className="dashboard__group-stat">
                                        <span className="dashboard__group-stat-label">Students</span>
                                        <span className="dashboard__group-stat-value">{group.studentsCount}</span>
                                    </div>
                                    <div className="dashboard__group-stat">
                                        <span className="dashboard__group-stat-label">Avg. Score</span>
                                        <span className="dashboard__group-stat-value">{group.averageScore}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events Module */}
                <div className="dashboard__module">
                    <div className="dashboard__module-header">
                        <h2 className="dashboard__module-title">Upcoming Events</h2>
                    </div>
                    <div className="dashboard__module-list">
                        {events.map((event) => (
                            <div key={event.id} className="dashboard__module-item">
                                <div className="dashboard__event-info">
                                    <div className="dashboard__event-icon">
                                        {event.type === 'test' ? (
                                            <ClipboardCheck className="dashboard__icon" />
                                        ) : event.type === 'lecture' ? (
                                            <GraduationCap className="dashboard__icon" />
                                        ) : (
                                            <ListTodo className="dashboard__icon" />
                                        )}
                                    </div>
                                    <div className="dashboard__event-details">
                                        <h3 className="dashboard__event-title">{event.title}</h3>
                                        <p className="dashboard__event-group">{event.group}</p>
                                    </div>
                                </div>
                                <div className="dashboard__event-date">{event.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
