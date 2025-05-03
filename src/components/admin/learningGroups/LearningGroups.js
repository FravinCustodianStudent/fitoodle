import React, { useEffect, useState } from 'react';
import {
    Button,
    Input,
    InputNumber,
    Row,
    Col,
    Card,
    List,
    Form,
    Checkbox,
    Avatar,
    message,
    Modal,
    Select,
} from 'antd';
import {PlusOutlined, SearchOutlined, RightCircleOutlined, UserOutlined} from '@ant-design/icons';
import { useHttp } from "../../../hooks/http.hook";
import {useNavigate} from "react-router-dom";

const { Option } = Select;

/**
 * CreateGroupModal Component
 */
const CreateGroupModal = ({ visible, onCreate, onCancel, loading }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onCreate(values);
        form.resetFields();
    };

    return (
        <Modal
            visible={visible}
            title="Create a New Group"
            footer={null}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                name="create_group_form"
                initialValues={{
                    active: true,
                    subGroups: [{}],
                }}
            >
                <Form.Item
                    name="enterYear"
                    label="Enter Year"
                    rules={[{ required: true, message: 'Please enter the entry year' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="e.g., 2025" />
                </Form.Item>
                <Form.Item
                    name="specNameShort"
                    label="Specialization (Short Name)"
                    rules={[{ required: true, message: 'Please enter the specialization short name' }]}
                >
                    <Input placeholder="e.g., ІПЗ" />
                </Form.Item>
                <Form.Item
                    name="groupNumber"
                    label="Group Number"
                    rules={[{ required: true, message: 'Please enter the group number' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="e.g., 10" />
                </Form.Item>
                <Form.Item name="active"  valuePropName="checked">
                    <Checkbox>Active</Checkbox>
                </Form.Item>
                <Form.List name="subGroups">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card key={key} style={{ marginBottom: 16 }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'subGroupNumber']}
                                        label="Sub Group Number"
                                        rules={[{ required: true, message: 'Missing sub group number' }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} placeholder="Sub Group Number" />
                                    </Form.Item>
                                    {fields.length > 1 && (
                                        <Button type="link" onClick={() => remove(name)}>
                                            Remove Sub Group
                                        </Button>
                                    )}
                                </Card>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block>
                                    Add Sub Group
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Create Group
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

/**
 * EditStudentsModal Component
 */
const EditStudentsModal = ({ visible, groupStudents, availableStudents, onAddStudent, onRemoveStudent, onCancel }) => {
    const { GET } = useHttp();
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchedStudents, setFetchedStudents] = useState([]);

    useEffect(() => {
        if (visible) {
            GET({}, "userdataresource/users", {})
                .then((res) => {
                    setFetchedStudents(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching available students", error);
                    message.error("Error fetching available students");
                });
        }
    }, [visible]);

    const filteredAvailableStudents = fetchedStudents.filter((student) => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            student.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <Modal
            visible={visible}
            title="Edit Students"
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <h3>Current Group Students</h3>
                    <List
                        dataSource={groupStudents}
                        renderItem={(student) => (
                            <List.Item
                                actions={[
                                    <ModalConfirmRemoveStudent
                                        student={student}
                                        onConfirm={() => onRemoveStudent(student)}
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={student.imageUrl} />}
                                    title={`${student.firstName} ${student.lastName}`}
                                    description={student.contactEmail}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={12}>
                    <h3>Available Students</h3>
                    <Input.Search
                        placeholder="Search available students"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <List
                        dataSource={filteredAvailableStudents}
                        renderItem={(student) => (
                            <List.Item
                                actions={[
                                    <Button disabled={groupStudents.some(st=> st.id===student.id)} variant="outlined" onClick={() => onAddStudent(student)}>
                                        Add
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={student.imageUrl} />}
                                    title={`${student.firstName} ${student.lastName}`}
                                    description={student.contactEmail}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </Modal>
    );
};

/**
 * ModalConfirmRemoveStudent Component
 */
const ModalConfirmRemoveStudent = ({ student, onConfirm }) => (
    <div>
        <Button variant="dashed" onClick={() => {
            Modal.confirm({
                title: 'Are you sure you want to remove this student?',
                onOk: onConfirm,
                okText: 'Yes',
                cancelText: 'No',
            });
        }}>
            Remove
        </Button>
    </div>
);

/**
 * EditSubGroupsModal Component
 */
const EditSubGroupsModal = ({ visible, initialSubGroups, groupStudents, selectedGroup, onSubmit, onCancel }) => {
    const { PUT } = useHttp();
    const [form] = Form.useForm();

    const options = groupStudents.map((student) => ({
        value: student.id,
        label: `${student.firstName} ${student.lastName}`,
    }));

    useEffect(() => {
        if (visible && (!groupStudents || groupStudents.length === 0)) {
            message.warning("No students are linked to this group. Please add students first.");
        }
    }, [visible, groupStudents]);

    const handleFinish = (values) => {
        if (!selectedGroup) return;
        const updatedGroup = {
            ...selectedGroup,
            subGroups: values.subGroups,
        };

        PUT({}, "userdataresource/groups", {}, { ...updatedGroup })
            .then((response) => {
                onSubmit(values.subGroups);
                form.resetFields();
                message.success("Sub Groups updated.");
            })
            .catch((error) => {
                console.error("Error updating sub groups:", error);
                message.error("Failed to update sub groups.");
            });
    };

    return (
        <Modal
            visible={visible}
            title="Edit Sub Groups"
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                name="edit_subgroups_form"
                initialValues={{ subGroups: initialSubGroups }}
                onFinish={handleFinish}
            >
                <Form.List name="subGroups">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card key={key} style={{ marginBottom: 16 }}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'subGroupNumber']}
                                                label="Sub Group Number"
                                                rules={[{ required: true, message: 'Missing sub group number' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} placeholder="Sub Group Number" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'students']}
                                                label="Assigned Students"
                                                rules={[{ required: true, message: 'Select at least one student' }]}
                                            >
                                                <Select mode="multiple" placeholder="Select students" options={options} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            {fields.length > 1 && (
                                                <Button type="link" onClick={() => remove(name)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block>
                                    Add Sub Group
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

/**
 * EditGroupModal Component
 */
const EditGroupModal = ({ visible, group, onUpdate, onCancel }) => {
    const { PUT } = useHttp();
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        if (!group) return;
        const updatedGroup = {
            ...group,
            specNameShort: values.specNameShort,
            active: values.active,
        };

        PUT({}, "userdataresource/groups", {}, { ...updatedGroup })
            .then((response) => {
                onUpdate(updatedGroup);
                form.resetFields();
                message.success("Group updated.");
            })
            .catch((error) => {
                console.error("Error updating group:", error);
                message.error("Failed to update group.");
            });
    };

    return (
        <Modal
            visible={visible}
            title="Edit Group"
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ specNameShort: group.specNameShort, active: group.active }}
            >
                <Form.Item
                    name="specNameShort"
                    label="Group Name"
                    rules={[{ required: true, message: 'Please enter the group name' }]}
                >
                    <Input placeholder="Enter group name" />
                </Form.Item>
                <Form.Item name="active" label="Active" valuePropName="checked">
                    <Checkbox>Active?</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

/**
 * StudentList Component
 */
const StudentList = ({ students, onEdit }) => (
    <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
            <Col>
                <h3>Students</h3>
            </Col>
            <Col>
                <Button variant="dashed" onClick={onEdit}>
                    Edit Students
                </Button>
            </Col>
        </Row>
        <List
            dataSource={students}
            renderItem={(student) => (
                <List.Item>
                    <Card style={{ width: '100%' }}>
                        <Card.Meta
                            avatar={<Avatar src={student.imageUrl} />}
                            title={`${student.firstName} ${student.lastName} ${student.patronomic}`}
                            description={
                                <div>
                                    <div>Email: {student.contactEmail}</div>
                                    <div>Roles: {student.roles.join(', ')}</div>
                                    <div>Status: {student.active ? 'Active' : 'Inactive'}</div>
                                </div>
                            }
                        />
                    </Card>
                </List.Item>
            )}
        />
    </div>
);

/**
 * SubGroupList Component
 */
const SubGroupList = ({ subGroups, onEdit }) => (
    <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
            <Col>
                <h3>Sub Groups</h3>
            </Col>
            <Col>
                <Button variant="outlined" onClick={onEdit}>
                    Edit Sub Groups
                </Button>
            </Col>
        </Row>
        <List
            dataSource={subGroups}
            renderItem={(subGroup) => (
                <List.Item>
                    <Card style={{ width: '100%' }}>
                        <Card.Meta
                            title={`Sub Group Number: ${subGroup.subGroupNumber}`}
                            description={<div>Students: {subGroup.students && subGroup.students.join(', ')}</div>}
                        />
                    </Card>
                </List.Item>
            )}
        />
    </div>
);

/**
 * CourseList Component
 * Displays a list of courses linked to the group with a "Create Course" button.
 */
const CourseList = ({ courses, onCreate,navigate }) => (
    <div style={{ marginTop: 16 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
            <Col>
                <h3>Courses</h3>
            </Col>
            <Col>
                <Button type="primary" onClick={onCreate}>
                    Create Course
                </Button>
            </Col>
        </Row>
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
            }}
            dataSource={courses}
            renderItem={(course) => (
                <List.Item>
                    <Card
                    actions={[
                        <RightCircleOutlined key={course.id} onClick={()=>{
                            navigate(`/admin/courses?courseId=${course.id}`);
                        }} />
                    ]}
                    >
                        <Card.Meta
                            title={course.name}
                            description={
                            <>
                                <p><UserOutlined /> Teacher : {course.teacherId}</p>
                            </>
                            }
                        />

                    </Card>
                </List.Item>
            )}
        />
    </div>
);

/**
 * LearningGroups Component
 * Main component that displays a list of groups and their details.
 * When a group is selected, its details are shown along with lists for Students,
 * Sub Groups, and Courses.
 */
const LearningGroups = () => {
    const { POST, GET, PUT } = useHttp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        getGroupList();
    }, []);

    const [groups, setGroups] = useState([]);
    const getGroupList = () => {
        return GET({}, "userdataresource/groups", {})
            .then((res) => {
                // Ensure groups have default arrays.
                const data = res.data.map((group) => ({
                    ...group,
                    tasks: group.tasks || [],
                    tests: group.tests || [],
                    courses: group.courses || [],
                }));
                setGroups(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        console.log('Groups have been updated:', groups);
    }, [groups]);

    const [loading, setLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupCourses, setGroupCourses] = useState([]);
    const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
    const [isEditStudentsModalVisible, setIsEditStudentsModalVisible] = useState(false);
    const [isEditSubGroupsModalVisible, setIsEditSubGroupsModalVisible] = useState(false);
    const [isEditGroupModalVisible, setIsEditGroupModalVisible] = useState(false);
    const navigate = useNavigate()
    // Simulated available students (fallback)
    const dbAvailableStudents = [
        {
            id: 's2',
            firstName: 'Emily',
            lastName: 'Davis',
            patronomic: 'Example',
            contactEmail: 'emily.d@example.com',
            imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
            roles: ['STUDENT'],
            active: true,
        },
        {
            id: 's3',
            firstName: 'John',
            lastName: 'Doe',
            patronomic: '',
            contactEmail: 'john.doe@example.com',
            imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            roles: ['STUDENT'],
            active: true,
        },
        {
            id: 's4',
            firstName: 'Jane',
            lastName: 'Smith',
            patronomic: '',
            contactEmail: 'jane.smith@example.com',
            imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
            roles: ['STUDENT'],
            active: true,
        },
    ];

    const getAvailableStudents = () => {
        if (!selectedGroup) return [];
        const groupStudentIds = new Set(selectedGroup.students.map((s) => s.id));
        return dbAvailableStudents.filter((s) => !groupStudentIds.has(s.id));
    };

    const handleCreateGroup = (groupData) => {
        setLoading(true);
        POST({}, 'userdataresource/groups', {}, groupData)
            .then((response) => {
                POST({name:`${response.data.specNameShort} ${response.data.groupNumber} ${response.data.enterYear}`,
                    groupIds :response.data.id},"scheduleresource/schedules",{},{})
                    .then(res => {
                    })
                    .catch(err => {
                        message.error("Error creating Schedule");
                    })
                GET({}, "userdataresource/groups", {})
                    .then((res) => {
                        setGroups(res.data);
                        const newGroup = response.data;
                        message.success(`Group "${newGroup.specNameShort}" created successfully!`);
                        setIsModalVisible(false);

                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((error) => {
                console.error('Error creating group:', error);
                message.error('Failed to create group.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleEditGroup = () => {
        setIsEditGroupModalVisible(true);
    };

    const handleUpdateGroup = (updatedValues) => {
        if (!selectedGroup) return;
        const updatedGroup = {
            ...selectedGroup,
            specNameShort: updatedValues.specNameShort,
            active: updatedValues.active,
        };
        PUT({}, "userdataresource/groups", {}, { ...updatedGroup })
            .then((response) => {
                setSelectedGroup(updatedGroup);
                setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
                message.success('Group updated.');
                setIsEditGroupModalVisible(false);
            })
            .catch((error) => {
                console.error("Error updating group:", error);
                message.error("Failed to update group.");
            });
    };

    const handleAddStudent = (student) => {
        if (!selectedGroup) return;
        if (selectedGroup.students.find((s) => s.id === student.id)) {
            message.warning('Student already added.');
            return;
        }
        const updatedGroup = {
            ...selectedGroup,
            students: [...selectedGroup.students, student],
        };

        PUT({}, "userdataresource/groups", {}, { ...updatedGroup })
            .then((response) => {
                setSelectedGroup(updatedGroup);
                setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
                message.success(`${student.firstName} added.`);
            })
            .catch((error) => {
                console.error("Error updating group:", error);
                message.error("Failed to add student.");
            });
    };

    const handleRemoveStudent = (student) => {
        if (!selectedGroup) return;
        const updatedGroup = {
            ...selectedGroup,
            students: selectedGroup.students.filter((s) => s.id !== student.id),
        };
        PUT({}, "userdataresource/groups", {}, { ...updatedGroup })
            .then((response) => {
                setSelectedGroup(updatedGroup);
                setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
                message.success(`${student.firstName} removed.`);
            })
            .catch((error) => {
                console.error("Error updating group:", error);
                message.error("Failed to remove student.");
            });
    };

    const handleUpdateSubGroups = (newSubGroups) => {
        if (!selectedGroup) return;
        const updatedGroup = {
            ...selectedGroup,
            subGroups: newSubGroups,
        };
        PUT({}, "userdataresource/groups", {}, { ...updatedGroup })
            .then((response) => {
                setSelectedGroup(updatedGroup);
                setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
                message.success('Sub Groups updated.');
                setIsEditSubGroupsModalVisible(false);
            })
            .catch((error) => {
                console.error("Error updating sub groups:", error);
                message.error("Failed to update sub groups.");
            });
    };

    // Dummy handler for creating a course.
    const handleCreateCourse = () => {
        navigate("/admin/courses");
    };

    // Fetch courses for the selected group when it changes.
    useEffect(() => {
        if (selectedGroup) {
            GET({ groupId: selectedGroup.id }, "courseresource/courses/by/group", {})
                .then((res) => {
                    setGroupCourses(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching courses for group:", error);
                    message.error("Failed to fetch courses.");
                });
        } else {
            setGroupCourses([]);
        }
    }, [selectedGroup, GET]);

    const renderGroupList = () => (
        <List
            header={<Input.Search placeholder="Search groups..." prefix={<SearchOutlined />} />}
            dataSource={groups}
            renderItem={(group) => (
                <List.Item
                    onClick={() => setSelectedGroup(group)}
                    style={{
                        cursor: 'pointer',
                        background: selectedGroup?.id === group.id ? '#f0f2f5' : '#fff',
                        marginBottom: 8,
                        padding: 16,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <List.Item.Meta
                        title={`[${group.enterYear}] ${group.specNameShort} - Group ${group.groupNumber}`}
                        description={group.active ? 'Active' : 'Inactive'}
                    />
                </List.Item>
            )}
        />
    );

    return (
        <div style={{ width: '100%', padding: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <h1>Learning Groups</h1>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsGroupModalVisible(true)}>
                        Create Group
                    </Button>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} lg={8}>
                    {renderGroupList()}
                </Col>
                <Col xs={24} lg={16}>
                    {selectedGroup ? (
                        <div>
                            <Card
                                title={`Group Details: [${selectedGroup.enterYear}] ${selectedGroup.specNameShort} - Group ${selectedGroup.groupNumber}`}
                                extra={<Button variant="filled" onClick={handleEditGroup}>Edit Group</Button>}
                                style={{ marginBottom: 16 }}
                            >
                                <p>
                                    <strong>Status:</strong> {selectedGroup.active ? 'Active' : 'Inactive'}
                                </p>
                            </Card>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <StudentList
                                        students={selectedGroup.students}
                                        onEdit={() => setIsEditStudentsModalVisible(true)}
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <SubGroupList
                                        subGroups={selectedGroup.subGroups}
                                        onEdit={() => setIsEditSubGroupsModalVisible(true)}
                                    />
                                </Col>
                            </Row>
                            {/* Course List Section */}
                            <CourseList courses={groupCourses} navigate={navigate} onCreate={handleCreateCourse} />
                        </div>
                    ) : (
                        <Card>
                            <p>Select a group to view details</p>
                        </Card>
                    )}
                </Col>
            </Row>
            <CreateGroupModal
                visible={isGroupModalVisible}
                onCreate={handleCreateGroup}
                onCancel={() => setIsGroupModalVisible(false)}
                loading={loading}
            />
            {selectedGroup && (
                <EditStudentsModal
                    visible={isEditStudentsModalVisible}
                    groupStudents={selectedGroup.students}
                    availableStudents={getAvailableStudents()}
                    onAddStudent={handleAddStudent}
                    onRemoveStudent={handleRemoveStudent}
                    onCancel={() => setIsEditStudentsModalVisible(false)}
                />
            )}
            {selectedGroup && (
                <EditSubGroupsModal
                    visible={isEditSubGroupsModalVisible}
                    initialSubGroups={selectedGroup.subGroups}
                    groupStudents={selectedGroup.students}
                    onSubmit={handleUpdateSubGroups}
                    selectedGroup={selectedGroup}
                    onCancel={() => setIsEditSubGroupsModalVisible(false)}
                />
            )}
            {selectedGroup && (
                <EditGroupModal
                    visible={isEditGroupModalVisible}
                    group={selectedGroup}
                    onUpdate={handleUpdateGroup}
                    onCancel={() => setIsEditGroupModalVisible(false)}
                />
            )}
        </div>
    );
};

export default LearningGroups;
