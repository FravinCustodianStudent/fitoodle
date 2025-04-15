import React, { useEffect, useState } from 'react';
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
    Col,
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
    SmileOutlined,
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
    const { GET, PUT } = useHttp();
    const [teacherName, setTeacherName] = useState('');
    const [fetchedGroups, setFetchedGroups] = useState([]);
    const [courseFilters, setCourseFilters] = useState({
        enterYear: undefined,
        specNameShort: '',
        groupNumber: undefined,
        active: true,
    });
    const navigate = useNavigate();
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
            .then((res) => {setAvailableCourses(res.data)
            if (searchParams.get('courseId')) setSelectedCourse(res.data.find(a=>a.id === searchParams.get('courseId')));
            })
            .catch(() => message.error('Failed to fetch courses'))
            .finally(() => setLoadingCourses(false));
    };

    useEffect(() => {
        fetchCourses(courseFilters);
    }, [courseFilters, GET]);

    // When selectedCourse changes, fetch teacher info and linked group details.
    useEffect(() => {
        if (selectedCourse && selectedCourse.teacherId) {
            GET({}, `userdataresource/users/${selectedCourse.teacherId}`, {})
                .then((res) => {
                    const user = res.data;
                    setTeacherName(`${user.firstName} ${user.lastName}`);
                })
                .catch(() => message.error('Failed to fetch teacher info'));
        } else {
            setTeacherName('');
        }
        if (selectedCourse && selectedCourse.targetGroups && selectedCourse.targetGroups.length > 0) {
            const query = selectedCourse.targetGroups.map((id) => `ids=${id}`).join('&');
            GET({}, `userdataresource/groups/by-ids?${query}`, {})
                .then((res) => setFetchedGroups(res.data))
                .catch(() => message.error('Failed to fetch group details'));
        } else {
            setFetchedGroups([]);
        }
    }, [selectedCourse, GET]);

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
    // Render courses list in left sidebar
    const renderCourseList = () => (
        <List
            loading={loadingCourses}
            dataSource={availableCourses}
            renderItem={(course) => (
                <List.Item
                    onClick={() => {
                        setSelectedCourse(course)
                        console.log(course.id)
                        setSearchParams({'courseId':course.id})
                    } }
                    style={{
                        cursor: 'pointer',
                        padding: 12,
                        background: selectedCourse?.id === course.id ? '#f0f2f5' : '#fff',
                        marginBottom: 8,
                        borderRadius: 4,
                    }}
                >
                    <List.Item.Meta title={course.name} description={`Teacher: ${course.teacherId}`} />
                </List.Item>
            )}
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
                                dataSource={selectedCourse.tests || []}
                                renderItem={(test) => (
                                    <List.Item style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }} actions={[<Button type="link" className="red-icon">Select</Button>]}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{test.title}</div>
                                            <div style={{ fontSize: 12, color: '#555' }}>{test.description}</div>
                                        </div>
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
                                dataSource={selectedCourse.tasks || []}
                                renderItem={(task) => (
                                    <List.Item style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }} actions={[<Button type="link" className="red-icon">Select</Button>]}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                                            <div style={{ fontSize: 12, color: '#555' }}>{task.description}</div>
                                        </div>
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

    return (
        <Layout style={{ height: '100vh', width: '100vw' }}>
            {/* Left Sidebar: Courses List and Filter */}
            <Sider style={{ background: '#fff', padding: 16, overflowY: 'auto' }} width={300}>
                <div
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h3>Courses</h3>
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
        </Layout>
    );
};

export default CourseManagerPage;
