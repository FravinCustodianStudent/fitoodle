import React, { useState } from 'react';
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
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {useHttp} from "../../../hooks/http.hook";

const { Option } = Select;

/**
 * CreateGroupModal Component
 * A modal form to create a new group.
 * It includes fields for:
 * - enterYear (number)
 * - specNameShort (text)
 * - groupNumber (number)
 * - sub-groups (with a minimum of one sub-group)
 *
 * The form is wrapped in a Form.Provider.
 * The submit button is a native <Button htmlType="submit" /> within the form.
 */
// CreateGroupModal collects group data from the user.
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
            footer={null} // Submit button is inside the form.
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
                    // Initialize with one empty subgroup
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
                <Form.Item name="active" label="Active" valuePropName="checked">
                    <Input type="checkbox" />
                </Form.Item>
                {/* Subgroup logic */}
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
 * A modal for editing students in a group.
 * Left side: List of current group students with a remove button (with confirmation).
 * Right side: A search input and list of available students (from a simulated DB) with an Add button.
 */
const EditStudentsModal = ({ visible, groupStudents, availableStudents, onAddStudent, onRemoveStudent, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAvailableStudents = availableStudents.filter((student) => {
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
                                    <Button type="link" onClick={() => onAddStudent(student)}>
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
 * Wraps a Remove button in a confirmation popup.
 */
const ModalConfirmRemoveStudent = ({ student, onConfirm }) => (
    <div>
        <Button type="link" onClick={() => {
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
 * A modal for editing sub groups of a selected group.
 * For each sub group, you can set a sub group number and assign students (from the group's student list).
 * You can add new sub groups and delete existing ones (if more than one exists).
 */
const EditSubGroupsModal = ({ visible, initialSubGroups, groupStudents, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    // Options for the multi-select come from the group's students.
    const options = groupStudents.map((student) => ({
        value: student.id,
        label: `${student.firstName} ${student.lastName}`,
    }));

    const handleFinish = (values) => {
        onSubmit(values.subGroups);
        form.resetFields();
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
            <Form form={form} layout="vertical" name="edit_subgroups_form" initialValues={{ subGroups: initialSubGroups }}>
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
                    <Button type="primary" htmlType="submit" onClick={() => form.submit()} block>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

/**
 * EditGroupModal Component
 * A modal for editing the selected group's details.
 * You can change the group's name and its active status.
 */
const EditGroupModal = ({ visible, group, onUpdate, onCancel }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onUpdate(values);
        form.resetFields();
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
 * Displays a list of students for a selected group.
 * Includes an "Edit Students" button near the header.
 */
const StudentList = ({ students, onEdit }) => (
    <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
            <Col>
                <h3>Students</h3>
            </Col>
            <Col>
                <Button type="link" onClick={onEdit}>
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
 * Displays a list of sub groups for a selected group.
 * Includes an "Edit Sub Groups" button near the header.
 */
const SubGroupList = ({ subGroups, onEdit }) => (
    <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
            <Col>
                <h3>Sub Groups</h3>
            </Col>
            <Col>
                <Button type="link" onClick={onEdit}>
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
 * LearningGroups Component
 * Main component that displays a list of groups.
 * When a group is selected, its details are shown with separate lists for students and sub groups.
 * Edit buttons are provided for Group, Students, and Sub Groups.
 * Additional modals allow editing of group details, students, and sub groups.
 */
const LearningGroups = () => {
    const { POST } = useHttp(); // Use your custom HTTP hook's POST method.
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groups, setGroups] = useState([
        {
            id: 'f383664c-zz7e-4d9d-ad2d-f1e4964a9e3a',
            enterYear: 2025,
            specNameShort: 'ІПЗ',
            groupNumber: 10,
            students: [
                {
                    id: 'f383664c-937e-4d9d-ad2d-f1e4964a9e3a',
                    firstName: 'Maksym',
                    lastName: 'Shevchuk',
                    patronomic: 'Yuriyovych',
                    contactEmail: 'www.max_shevchuk@knu.ua',
                    imageUrl:
                        'https://static.wikia.nocookie.net/boowser/images/5/5d/Morshu.jpg/revision/latest?cb=20210207011259',
                    roles: ['GUEST'],
                    active: true,
                },
            ],
            subGroups: [
                {
                    id: 'sub1',
                    subGroupNumber: 1,
                    students: ['f383664c-937e-4d9d-ad2d-f1e4964a9e3a'],
                },
            ],
            active: true,
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
    const [isEditStudentsModalVisible, setIsEditStudentsModalVisible] = useState(false);
    const [isEditSubGroupsModalVisible, setIsEditSubGroupsModalVisible] = useState(false);
    const [isEditGroupModalVisible, setIsEditGroupModalVisible] = useState(false);

    // Simulated available students in DB.
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

    // Compute available students for addition by filtering out those already in the group.
    const getAvailableStudents = () => {
        if (!selectedGroup) return [];
        const groupStudentIds = new Set(selectedGroup.students.map((s) => s.id));
        return dbAvailableStudents.filter((s) => !groupStudentIds.has(s.id));
    };
    const handleCreateGroup = (groupData) => {
        setLoading(true);

        POST({}, 'userdataresource/groups', {}, groupData)
            .then((response) => {
                // Use the returned group from the backend
                const newGroup = response.data;
                setGroups([...groups, newGroup]);
                message.success(`Group "${newGroup.specNameShort}" created successfully!`);
                setIsModalVisible(false);
            })
            .catch((error) => {
                console.error('Error creating group:', error);
                message.error('Failed to create group.');
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // Handlers for editing group details.
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
        setSelectedGroup(updatedGroup);
        setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
        message.success('Group updated.');
        setIsEditGroupModalVisible(false);
    };

    // Handlers for editing students.
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
        setSelectedGroup(updatedGroup);
        setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
        message.success(`${student.firstName} added.`);
    };

    const handleRemoveStudent = (student) => {
        if (!selectedGroup) return;
        const updatedGroup = {
            ...selectedGroup,
            students: selectedGroup.students.filter((s) => s.id !== student.id),
        };
        setSelectedGroup(updatedGroup);
        setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
        message.success(`${student.firstName} removed.`);
    };

    // Handler for updating sub groups.
    const handleUpdateSubGroups = (newSubGroups) => {
        if (!selectedGroup) return;
        const updatedGroup = {
            ...selectedGroup,
            subGroups: newSubGroups,
        };
        setSelectedGroup(updatedGroup);
        setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
        message.success('Sub Groups updated.');
        setIsEditSubGroupsModalVisible(false);
    };

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
                                extra={<Button type="link" onClick={handleEditGroup}>Edit Group</Button>}
                                style={{ marginBottom: 16 }}
                            >
                                <p>
                                    <strong>Status:</strong> {selectedGroup.active ? 'Active' : 'Inactive'}
                                </p>
                            </Card>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <StudentList students={selectedGroup.students} onEdit={() => setIsEditStudentsModalVisible(true)} />
                                </Col>
                                <Col xs={24} md={12}>
                                    <SubGroupList subGroups={selectedGroup.subGroups} onEdit={() => setIsEditSubGroupsModalVisible(true)} />
                                </Col>
                            </Row>
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
