import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Layout,
    List,
    Card,
    Drawer,
    Button,
    Popover,
    Form,
    Input,
    InputNumber,
    Select,
    Tooltip,
    Tabs,
    Modal,
    message,
    Row,
    Col, Spin, Tag, Table, Avatar
} from 'antd';
import {
    FilterOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    TeamOutlined,
    FileTextOutlined,
    CheckSquareOutlined,
    BookOutlined,
    UserOutlined,
    IdcardOutlined,
    SmileOutlined, EditOutlined, EyeOutlined, DeleteOutlined, CloseCircleOutlined, CheckCircleOutlined, CalendarOutlined,CommentOutlined
} from '@ant-design/icons';
import { useHttp } from '../../../hooks/http.hook';
import {useNavigate, useSearchParams} from "react-router-dom";
const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const ManageGroupsModal = ({ visible, initialSelectedIds,selectedCourse, onClose, onUpdate }) => {
    const { GET,PUT } = useHttp();
    const [allGroups, setAllGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState(initialSelectedIds || []);
    const [loading, setLoading] = useState(false);

    // Fetch all available groups when modal opens
    useEffect(() => {
        if (visible) {
            setLoading(true);
            GET({}, 'userdataresource/groups', {})
                .then((res) => setAllGroups(res.data))
                .catch(() => message.error('Failed to fetch groups'))
                .finally(() => setLoading(false));
        }
    }, [visible, GET]);

    // Keep local selectedIds in sync with initialSelectedIds (e.g., when course changes)
    useEffect(() => {
        setSelectedIds(initialSelectedIds || []);
    }, [initialSelectedIds]);

    // Filter groups by search term (case-insensitive match on specNameShort and groupNumber)
    const filteredGroups = allGroups.filter((group) =>
        (`${group.specNameShort} - Group ${group.groupNumber}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Toggle selection of a group
    const toggleGroup = (groupId) => {
        if (selectedIds.includes(groupId)) {
            setSelectedIds(selectedIds.filter((id) => id !== groupId));
        } else {
            setSelectedIds([...selectedIds, groupId]);
        }
    };

    const handleSave = () => {
        const updatedCourse = {
            ...selectedCourse,
            targetGroups: selectedIds
        };

        PUT({}, 'courseresource/courses', {}, updatedCourse)
            .then(() => {
                message.success('Groups updated successfully');
                onUpdate(selectedIds); // оновити стан батьківського компонента
                onClose();
            })
            .catch(() => message.error('Failed to update course with new groups'));
    };

    return (
        <Modal
            visible={visible}
            title="Manage Linked Groups"
            onCancel={onClose}
            onOk={handleSave}
            okText="Save Changes"
        >
            <Input
                placeholder="Search groups by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <List
                loading={loading}
                dataSource={filteredGroups}
                renderItem={(group) => (
                    <List.Item
                        actions={[
                            selectedIds.includes(group.id) ? (
                                <Tooltip title="Remove group">
                                    <Button
                                        type="link"
                                        icon={<MinusCircleOutlined className="red-icon" />}
                                        onClick={() => toggleGroup(group.id)}
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Add group">
                                    <Button
                                        type="link"
                                        icon={<PlusCircleOutlined className="red-icon" />}
                                        onClick={() => toggleGroup(group.id)}
                                    />
                                </Tooltip>
                            ),
                        ]}
                    >
                        <List.Item.Meta
                            title={`${group.specNameShort} - Group ${group.groupNumber}`}
                            description={
                                <>
                                    <span>Year: {group.enterYear}</span>{' '}
                                    <Tooltip title="Active Status">
                                        <span>{group.active ? 'Active' : 'Inactive'}</span>
                                    </Tooltip>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

/**
 * CreateCourseDrawer Component
 * Opens as a multi‑level drawer for creating a new course.
 * The course “name” is auto‑generated. Instead, the user selects a teacher (only one),
 * manages linked groups and laborants (via inner drawers).
 */
/**
 * CreateCourseDrawer Component
 * Opens as a multi‑level drawer for creating a new course.
 * The course name is a string input. The user selects a teacher (only one),
 * and manages linked groups and laborants via inner drawers.
 */
const CreateCourseDrawer = ({ visible, onClose, onCreate }) => {
    const { GET, POST } = useHttp();
    const [form] = Form.useForm();

    // States for inner drawers visibility
    const [groupsDrawerVisible, setGroupsDrawerVisible] = useState(false);
    const [laborantsDrawerVisible, setLaborantsDrawerVisible] = useState(false);
    const [teacherDrawerVisible, setTeacherDrawerVisible] = useState(false);

    // States for selected linked items
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedLaborants, setSelectedLaborants] = useState([]);

    // Data fetched from server for inner drawers
    const [availableGroups, setAvailableGroups] = useState([]);
    const [availableLaborants, setAvailableLaborants] = useState([]);
    const [availableTeachers, setAvailableTeachers] = useState([]);

    // Fetch available groups when groups drawer opens
    useEffect(() => {
        if (groupsDrawerVisible) {
            GET({}, 'userdataresource/groups', {})
                .then((res) => setAvailableGroups(res.data))
                .catch(() => message.error('Failed to fetch groups'));
        }
    }, [groupsDrawerVisible, GET]);

    // Fetch available laborants when laborants drawer opens
    useEffect(() => {
        if (laborantsDrawerVisible) {
            GET({}, 'userdataresource/users', {})
                .then((res) => setAvailableLaborants(res.data))
                .catch(() => message.error('Failed to fetch laborants'));
        }
    }, [laborantsDrawerVisible, GET]);

    // Fetch available teachers when teacher drawer opens; assume teachers have role TEACHER.
    useEffect(() => {
        if (teacherDrawerVisible) {
            GET({ roles: "TEACHER" }, 'userdataresource/users', {})
                .then((res) => setAvailableTeachers(res.data))
                .catch(() => message.error('Failed to fetch teachers'));
        }
    }, [teacherDrawerVisible, GET]);

    // Handle course creation
    const handleSubmit = (values) => {
        const courseData = {
            name: values.name,
            teacherId: selectedTeacher ? selectedTeacher.id : '',
            targetGroups: selectedGroups.map((g) => g.id),
            laborants: selectedLaborants.map((l) => l.id),
            messages: [],
        };

        POST({}, 'courseresource/courses', {}, courseData)
            .then(() => {
                message.success('Course created successfully');
                onCreate(courseData);
                form.resetFields();
                setSelectedTeacher(null);
                setSelectedGroups([]);
                setSelectedLaborants([]);
                onClose();
            })
            .catch(() => message.error('Failed to create course'));
    };

    return (
        <>
            <Drawer
                visible={visible}
                title={
                    <span>
            <BookOutlined style={{ marginRight: 8 }} />
            Create New Course
          </span>
                }
                onClose={onClose}
                width={500}
                bodyStyle={{ padding: 24, background: '#fafafa' }}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={() => form.submit()}>
                            <PlusCircleOutlined /> Create Course
                        </Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label={
                            <span>
                <BookOutlined style={{ marginRight: 4 }} /> Course Name
              </span>
                        }
                        name="name"
                        rules={[{ required: true, message: 'Please enter course name' }]}
                    >
                        <Input placeholder="Enter course name" />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                <UserOutlined style={{ marginRight: 4 }} /> Teacher
              </span>
                        }
                    >
                        <Row align="middle" gutter={8}>
                            <Col flex="auto">
                                {selectedTeacher ? (
                                    <span>
                    {selectedTeacher.firstName} {selectedTeacher.lastName}
                  </span>
                                ) : (
                                    <span style={{ color: '#aaa' }}>No teacher selected</span>
                                )}
                            </Col>
                            <Col>
                                <Tooltip title="Select Teacher">
                                    <Button type="link" onClick={() => setTeacherDrawerVisible(true)}>
                                        <IdcardOutlined />
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                <TeamOutlined style={{ marginRight: 4 }} /> Linked Groups
              </span>
                        }
                    >
                        <Row align="middle" gutter={8}>
                            <Col flex="auto">
                                {selectedGroups.length > 0 ? (
                                    <span>{selectedGroups.length} group(s) selected</span>
                                ) : (
                                    <span style={{ color: '#aaa' }}>No groups linked</span>
                                )}
                            </Col>
                            <Col>
                                <Tooltip title="Manage Groups">
                                    <Button type="link" onClick={() => setGroupsDrawerVisible(true)}>
                                        <PlusCircleOutlined />
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                <SmileOutlined style={{ marginRight: 4 }} /> Laborants
              </span>
                        }
                    >
                        <Row align="middle" gutter={8}>
                            <Col flex="auto">
                                {selectedLaborants.length > 0 ? (
                                    <span>{selectedLaborants.length} laborant(s) selected</span>
                                ) : (
                                    <span style={{ color: '#aaa' }}>No laborants linked</span>
                                )}
                            </Col>
                            <Col>
                                <Tooltip title="Manage Laborants">
                                    <Button type="link" onClick={() => setLaborantsDrawerVisible(true)}>
                                        <PlusCircleOutlined />
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Groups Management Drawer (for course creation) */}
            <Drawer
                visible={groupsDrawerVisible}
                title="Manage Groups"
                onClose={() => setGroupsDrawerVisible(false)}
                width={400}
            >
                <List
                    dataSource={availableGroups}
                    renderItem={(group) => (
                        <List.Item
                            actions={[
                                <Button
                                    onClick={() => {
                                        const exists = selectedGroups.find((g) => g.id === group.id);
                                        if (exists) {
                                            setSelectedGroups(selectedGroups.filter((g) => g.id !== group.id));
                                        } else {
                                            setSelectedGroups([...selectedGroups, group]);
                                        }
                                    }}
                                >
                                    {selectedGroups.find((g) => g.id === group.id) ? 'Remove' : 'Add'}
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={`${group.specNameShort} - Group ${group.groupNumber}`}
                                description={`Year: ${group.enterYear}`}
                            />
                        </List.Item>
                    )}
                />
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <Button onClick={() => setGroupsDrawerVisible(false)}>Done</Button>
                </div>
            </Drawer>

            {/* Laborants Management Drawer */}
            <Drawer
                visible={laborantsDrawerVisible}
                title="Manage Laborants"
                onClose={() => setLaborantsDrawerVisible(false)}
                width={400}
            >
                <List
                    dataSource={availableLaborants}
                    renderItem={(laborant) => (
                        <List.Item
                            actions={[
                                <Button
                                    onClick={() => {
                                        if (selectedTeacher && selectedTeacher.id === laborant.id) {
                                            message.warning('This user is already selected as teacher. Remove from teacher selection first.');
                                            return;
                                        }
                                        if (selectedLaborants.find((l) => l.id === laborant.id)) {
                                            setSelectedLaborants(selectedLaborants.filter((l) => l.id !== laborant.id));
                                        } else {
                                            setSelectedLaborants([...selectedLaborants, laborant]);
                                        }
                                    }}
                                >
                                    {selectedLaborants.find((l) => l.id === laborant.id) ? 'Remove' : 'Add'}
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={`${laborant.firstName} ${laborant.lastName}`}
                                description={laborant.contactEmail}
                            />
                        </List.Item>
                    )}
                />
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <Button onClick={() => setLaborantsDrawerVisible(false)}>Done</Button>
                </div>
            </Drawer>

            {/* Teacher Selection Drawer */}
            <Drawer
                visible={teacherDrawerVisible}
                title="Select Teacher"
                onClose={() => setTeacherDrawerVisible(false)}
                width={400}
            >
                <List
                    dataSource={availableTeachers}
                    renderItem={(teacher) => (
                        <List.Item
                            actions={[
                                <Button
                                    onClick={() => {
                                        if (selectedLaborants.find((l) => l.id === teacher.id)) {
                                            message.warning('This user is already selected as laborant. Remove them from laborants first.');
                                            return;
                                        }
                                        setSelectedTeacher(teacher);
                                        setTeacherDrawerVisible(false);
                                    }}
                                >
                                    Select
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={`${teacher.firstName} ${teacher.lastName}`}
                                description={teacher.contactEmail}
                            />
                        </List.Item>
                    )}
                />
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <Button onClick={() => setTeacherDrawerVisible(false)}>Done</Button>
                </div>
            </Drawer>
        </>
    );
};
/**
 * CourseManagerPage Component
 * This page is 100% of the window. The left sidebar shows a list of courses (fetched with filters)
 * and a filter button that opens a popover. A "Create Course" button opens the multi‑level drawer.
 * The right panel displays details about the selected course.
 */
const CourseManagerPage = () => {
    const { GET, PUT, DELETE } = useHttp();
    const [teacherName, setTeacherName] = useState('');
    const [fetchedGroups, setFetchedGroups] = useState([]);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewResults, setViewResults] = useState([]);
    const [teacherMap, setTeacherMap] = useState({});
    const [courseFilters, setCourseFilters] = useState({
        enterYear: undefined,
        specNameShort: '',
        groupNumber: undefined,
        active: true,
    });
    const navigate = useNavigate();
    const [courseItems, setCourseItems] = useState({ tests: [], tasks: [] });
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [createCourseDrawerVisible, setCreateCourseDrawerVisible] = useState(false);
    const [manageGroupsModalVisible, setManageGroupsModalVisible] = useState(false);
    const [searchParams,setSearchParams] = useSearchParams();
    // Fetch courses from the server with filters
    const fetchCourses = (filters) => {
        setLoadingCourses(true);
        GET({}, 'courseresource/courses/all', filters)
            .then((res) => {
                setAvailableCourses(res.data)
            if (searchParams.get('courseId')) setSelectedCourse(res.data.find(a=>a.id === searchParams.get('courseId')));
                const ids = Array.from(new Set(res.data.map(c => c.teacherId).filter(Boolean)));
                if (ids.length) {
                    const q = ids.map(id => `ids=${id}`).join('&');
                    GET({}, `userdataresource/users/by-ids?${q}`, {})
                        .then(usersRes => {
                            const map = {};
                            usersRes.data.forEach(u => {
                                map[u.id] = `${u.firstName} ${u.lastName}`;
                            });
                            setTeacherMap(map);
                        })
                        .catch(() => message.error('Failed to load teacher names'));
                }
            })
            .catch(() => message.error('Failed to fetch courses'))
            .finally(() => setLoadingCourses(false));
    };

    useEffect(() => {
        fetchCourses(courseFilters);
    }, [courseFilters, GET]);

    // 2) When you select a course, fetch teacher info, groups, and tasks/tests
    useEffect(() => {
        if (!selectedCourse) return;

        // reflect in URL
        setSearchParams({ courseId: selectedCourse.id });

        // a) teacher
        if (selectedCourse.teacherId) {
            GET({}, `userdataresource/users/${selectedCourse.teacherId}`, {})
                .then((res) =>
                    setTeacherName(`${res.data.firstName} ${res.data.lastName}`)
                )
                .catch(() => message.error('Failed to fetch teacher info'));
        } else {
            setTeacherName('');
        }

        // b) linked groups
        if (selectedCourse.targetGroups?.length) {
            const query = selectedCourse.targetGroups
                .map((id) => `ids=${id}`)
                .join('&');
            GET({}, `userdataresource/groups/by-ids?${query}`, {})
                .then((res) => setFetchedGroups(res.data))
                .catch(() => message.error('Failed to fetch group details'));
        } else {
            setFetchedGroups([]);
        }

        // c) tasks/tests
        GET(
            {eduCourseId: selectedCourse.id},
            'taskresource/tasks/by/course',
            {  }
        )
            .then((res) => {
                const all = res.data;
                setCourseItems({
                    tests: all.filter((item) => item.testId),
                    tasks: all.filter((item) => !item.testId),
                });
            })
            .catch(() => message.error('Failed to fetch tests & tasks'));
    }, [selectedCourse]);

    // Filter form inside a popover for courses
    const courseFilterContent = (
        <Form
            layout="vertical"
            initialValues={courseFilters}
            onFinish={(values) => setCourseFilters(values)}
        >
            <Form.Item
                label="Enter Year"
                name="enterYear"
                rules={[{ type: 'number', min: 2000, message: 'Year must be > 2000' }]}
            >
                <InputNumber placeholder="Year" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Specialization" name="specNameShort">
                <Input placeholder="Specialization" />
            </Form.Item>
            <Form.Item label="Group Number" name="groupNumber">
                <InputNumber placeholder="Group Number" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Active" name="active">
                <Select>
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>Inactive</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Apply Filters
                </Button>
            </Form.Item>
        </Form>
    );
    // 3) Handlers for View / Edit / Delete
    const handleView = item => {
        if (!item.testId) {
            navigate(`/admin/tasks/${item.id}/results`);
            return;
        }

        setViewModalVisible(true);
        setViewLoading(true);

        // 1) fetch taskResults
        GET({ taskId: item.id }, 'taskresource/taskResult/by/task', {})
            .then(res => res.data)
            .then(results =>
                // 2) get marks for each
                Promise.all(results.map(r =>
                    GET({ taskResultId: r.id }, 'taskresource/marks/by/testResult', {})
                        .then(markRes => ({
                            ...r,
                            markValue: markRes.data.markValue,
                            comment:   markRes.data.comment,
                        }))
                ))
            )
            .then(resultsWithMarks => {
                // 3) collect unique studentIds
                const studentIds = Array.from(new Set(resultsWithMarks.map(r => r.studentId)));
                // 4) fetch user details
                const query = studentIds.map(id => `ids=${id}`).join('&');
                //made
                return GET({}, `userdataresource/users/by-ids?${query}`, {})
                    .then(usersRes => ({
                        resultsWithMarks,
                        users: usersRes.data,
                    }));
            })
            .then(({ resultsWithMarks, users }) => {
                // 5) merge user info into each result
                const finalResults = resultsWithMarks.map(r => ({
                    ...r,
                    user: users.find(u => u.id === r.studentId),
                }));
                setViewResults(finalResults);
            })
            .catch(() => message.error('Failed to load test results'))
            .finally(() => setViewLoading(false));
    };

    const handleEdit = (item) => {
        if (item.testId) {
            navigate(`/admin/questions/${item.testId}`); // or your test-edit route
        } else {
            navigate(`/admin/tasks/${item.id}`); // or your task-edit route
        }
    };
    const handleDelete = (item) => {
        Modal.confirm({
            title: `Delete ${item.testId ? 'test' : 'task'} "${item.name}"?`,
            onOk: () => {
                DELETE(
                    {},
                    `taskresource/tasks/${item.id}`,
                    {}
                )
                    .then(() => {
                        message.success('Deleted successfully');
                        // refetch tasks/tests
                        return GET(
                            {},
                            'taskresource/tasks/by/course',
                            { eduCourseId: selectedCourse.id }
                        );
                    })
                    .then((res) => {
                        const all = res.data;
                        setCourseItems({
                            tests: all.filter((i) => i.testId),
                            tasks: all.filter((i) => !i.testId),
                        });
                    })
                    .catch(() => message.error('Failed to delete'));
            },
        });
    };
    const itemVariants = {
        unselected: {
            "&::before":{

            },
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        },
        selected: {
            paddingLeft:"10px"
        },
    };
    // Render courses list in left sidebar
    const renderCourseList = () => (
        <List
            loading={loadingCourses}
            dataSource={availableCourses}
            itemLayout="vertical"
            renderItem={course => {
                const isSel = selectedCourse?.id === course.id;
                const teacherName = teacherMap[course.teacherId] || '—';
                return (<motion.div
                    key={course.id}
                    variants={itemVariants}
                    initial="unselected"
                    animate={isSel ? 'selected' : 'unselected'}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                        setSelectedCourse(course);
                        setSearchParams({ courseId: course.id });
                    }}
                    style={{
                        position: 'relative',
                        borderRadius: 8,
                        marginBottom: 12,
                        cursor: 'pointer',
                    }}
                >
                    {/* left bar animating in/out */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isSel ? 12 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            left: 0, top: 0,
                            height: '100%',
                            background: '#2B2D42',
                            borderRadius: '8px 0 0 8px',
                        }}
                    />

                    <List.Item
                        style={{ padding: 16, background: 'transparent', boxShadow: 'none' }}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    icon={<BookOutlined />}
                                    size={52}
                                />
                            }
                            title={
                                <span style={{ fontSize: 16, fontWeight: 600 }}>
                  <BookOutlined style={{ marginRight: 8}} />
                                    {course.name}
                </span>
                            }
                            description={
                                <>

                                    <div>
                                        <UserOutlined style={{ marginRight: 4 }} />
                                        Teacher: {teacherName}
                                    </div>
                                </>
                            }
                        />
                    </List.Item>
                </motion.div>);
            }}
        />
    );

    // Handler for updating linked groups from the ManageGroupsModal
    const handleUpdateCourseGroups = (newGroupIds) => {
        if (!selectedCourse) return;
        const updatedCourse = { ...selectedCourse, targetGroups: newGroupIds };
        PUT({}, `courseresource/courses`, {}, updatedCourse)
            .then(() => {
                setSelectedCourse(updatedCourse);
                message.success('Course groups updated');
            })
            .catch(() => message.error('Failed to update groups'));
    };

    // Render course details tabs in right panel
    const renderCourseTabs = () => {

        if (!selectedCourse) return null;
        return (
            <Tabs defaultActiveKey="general" type="line" style={{ padding: '16px 0' }}>
                <TabPane
                    tab={
                        <span>
              <Tooltip title="General information">
                <TeamOutlined className="red-icon" />
              </Tooltip>{' '}
                            General Info
            </span>
                    }
                    key="general"
                >
                    <div style={{ padding: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <h2 style={{ margin: 0 }}>{selectedCourse.name}</h2>
                        </div>
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
                            <UserOutlined className="red-icon" style={{ marginRight: 8 }} />
                            <strong>Teacher:</strong>
                            <span style={{ marginLeft: 8 }}>{teacherName || 'Loading...'}</span>
                        </div>
                        <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
                            Linked Groups
                        </div>
                        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 4, padding: 16 }}>
                            <List
                                dataSource={fetchedGroups}
                                renderItem={(group) => (
                                    <List.Item style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <TeamOutlined className="red-icon" style={{ fontSize: 20, marginRight: 8 }} />
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {group.specNameShort} - Group {group.groupNumber}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#555' }}>
                                                    Year: {group.enterYear} |{' '}
                                                    <Tooltip title="Active Status">
                                                        <span>{group.active ? 'Active' : 'Inactive'}</span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                            <Button
                                type="dashed"
                                icon={<PlusCircleOutlined className="red-icon" />}
                                style={{ marginTop: 16, width: '100%' }}
                                onClick={() => setManageGroupsModalVisible(true)}
                            >
                                Manage Groups
                            </Button>
                        </div>
                    </div>
                </TabPane>
                <TabPane
                    tab={
                        <span>
              <Tooltip title="Manage tests">
                <FileTextOutlined className="red-icon" />
              </Tooltip>{' '}
                            Tests
            </span>
                    }
                    key="tests"
                >
                    <div style={{ padding: 24 }}>
                        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 4, padding: 16 }}>
                            <List
                                        dataSource={courseItems.tests}
                                        renderItem={test => (
                                          <List.Item
                                            actions={[
                                              <Button icon={<EyeOutlined />}   onClick={() => handleView(test)}   />,
                                          <Button icon={<EditOutlined />}  onClick={() => handleEdit(test)}   />,
                                          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(test)} />,
                                        ]}
                                      >
                                        <List.Item.Meta
                                          title={test.name}
                                          description={test.description}
                                       />
                                      </List.Item>
                                )}
                             />
                        </div>
                        <Button
                            icon={<PlusCircleOutlined className="red-icon" />}
                            type="primary"
                            style={{ marginTop: 16 }}
                            onClick={()=>{
                                navigate("/admin/questions")
                            }}
                        >
                            Create New Test
                        </Button>
                    </div>
                </TabPane>
                <TabPane
                    tab={
                        <span>
              <Tooltip title="Manage tasks">
                <CheckSquareOutlined className="red-icon" />
              </Tooltip>{' '}
                            Tasks
            </span>
                    }
                    key="tasks"
                >
                    <div style={{ padding: 24 }}>
                        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 4, padding: 16 }}>
                            <List
                                        dataSource={courseItems.tasks}
                                      renderItem={task => (
                                         <List.Item
                                           actions={[
                                             <Button icon={<EyeOutlined />}   onClick={() => handleView(task)}   />,
                                         <Button icon={<EditOutlined />}  onClick={() => handleEdit(task)}   />,
                                         <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(task)} />,
                                       ]}
                                      >
                                        <List.Item.Meta
                                          title={task.name}
                                          description={task.description}
                                        />
                                      </List.Item>
                                )}
                              />
                        </div>
                        <Button
                            icon={<PlusCircleOutlined className="red-icon" />}
                            type="primary"
                            style={{ marginTop: 16 }}
                            onClick={()=>{
                                navigate("/admin/tasks")
                            }}
                        >
                            Create New Task
                        </Button>
                    </div>
                </TabPane>
            </Tabs>
        );
    };
    const resultColumns = [
        {
            title: 'Student',
            dataIndex: 'user',
            key: 'user',
            render: user =>
                user
                    ? (
                        <span>
            <Avatar src={user.imageUrl} style={{ marginRight: 8 }} />
                            {`${user.firstName} ${user.lastName}`}
          </span>
                    )
                    : '-'
        },
        {
            title: 'Completed',
            dataIndex: 'completed',
            key: 'completed',
            render: done =>
                done
                    ? <Tag icon={<CheckCircleOutlined />} color="success">Yes</Tag>
                    : <Tag icon={<CloseCircleOutlined />} color="error">No</Tag>
        },
        {
            title: 'Completion Time',
            dataIndex: 'completionTime',
            key: 'completionTime',
            render: t => t
                ? <span><CalendarOutlined style={{ marginRight: 4 }} />{new Date(t).toLocaleString()}</span>
                : '-'
        },
        {
            title: 'Mark',
            dataIndex: 'markValue',
            key: 'markValue',
            render: (markValue, record) =>{
                return (

                    record.completed?
                        <Tag
                            icon={<CheckCircleOutlined />}
                            color={'#2B2D42'}>
                            {markValue}</Tag>:
                        <Tag
                            icon={<CloseCircleOutlined />}
                            color={'red'}>
                            {markValue}</Tag>

                )
            }
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: c => <span><CommentOutlined style={{ marginRight: 4 }} />{c}</span>
        },
    ];


    return (
        <Layout style={{ height: '100vh', width: '100vw',backgroundColor: '#fff',marginTop: '1rem' }}>
            {/* Left Sidebar: Courses List and Filter */}
            <Sider style={{ background: '#fff', padding: 16, overflowY: 'auto' }} width={500}>
                <div
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h3 style={{margin:0}}>Courses</h3>
                    <div>
                        <Popover content={courseFilterContent} trigger="click">
                            <Button icon={<FilterOutlined />} />
                        </Popover>
                        <Button
                            type="primary"
                            style={{ marginLeft: 8 }}
                            onClick={() => setCreateCourseDrawerVisible(true)}
                        >
                            Create Course
                        </Button>
                    </div>
                </div>
                {renderCourseList()}
            </Sider>

            {/* Right Panel: Course Details */}
            <Content style={{ padding: 16, overflowY: 'auto' }}>
                {selectedCourse ? (
                    <Card title="Details About Course" bordered={false}>
                        {renderCourseTabs()}
                    </Card>
                ) : (
                    <Card>
                        <h2>Select a course to view details</h2>
                    </Card>
                )}
            </Content>

            {/* Create Course Drawer */}
            <CreateCourseDrawer
                visible={createCourseDrawerVisible}
                onClose={() => setCreateCourseDrawerVisible(false)}
                onCreate={(courseData) => {
                    // Refresh courses after creation
                    fetchCourses(courseFilters);
                }}
            />

            {/* Manage Groups Modal for General Info tab */}
            {selectedCourse && (
                <ManageGroupsModal
                    visible={manageGroupsModalVisible}
                    initialSelectedIds={selectedCourse.targetGroups || []}
                    selectedCourse={selectedCourse}
                    onClose={() => setManageGroupsModalVisible(false)}
                    onUpdate={handleUpdateCourseGroups}
                />
            )}
            <Modal
                visible={viewModalVisible}
                title="Test Results"
                onCancel={() => setViewModalVisible(false)}
                footer={null}
                width={1200}
            >
                {viewLoading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        rowKey="id"
                        dataSource={viewResults}
                        columns={resultColumns}
                        bordered
                        pagination={false}
                    />
                )}
            </Modal>
        </Layout>
    );
};

export default CourseManagerPage;
