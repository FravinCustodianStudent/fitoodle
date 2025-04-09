import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Input,
    List,
    Button,
    Table,
    Drawer,
    Form,
    Select,
    Checkbox,
    Tooltip,
    Typography,
    Modal,
    Skeleton,
    Popover
} from 'antd';
import {
    FilterOutlined,
    PlusOutlined,
    EditOutlined
} from '@ant-design/icons';
import { format, startOfWeek, addDays } from 'date-fns';
import {useHttp} from "../../../hooks/http.hook";

const { Option } = Select;
const { Title } = Typography;

// Fixed time slots for the schedule grid.
const timeSlots = [
    { start: '9:00', end: '10:20' },
    { start: '10:30', end: '11:50' },
    { start: '12:10', end: '13:30' },
    { start: '13:40', end: '15:00' },
    { start: '15:10', end: '16:30' },
    { start: '16:40', end: '18:00' },
    { start: '18:10', end: '19:30' },
];

const LessonSchedule = () => {
    const { GET } = useHttp();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [tempSelectedGroup, setTempSelectedGroup] = useState(null);
    const [groupSearch, setGroupSearch] = useState('');

    // State for filter parameters.
    const [filterParams, setFilterParams] = useState({});

    // Function to fetch groups from the API with given filter parameters.
    const fetchGroups = (params = {}) => {
        GET(params, "userdataresource/groups", {})
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                console.error("Error fetching groups", error);
            });
    };

    // Initially fetch groups if no group is selected.
    useEffect(() => {
        if (!selectedGroup) {
            fetchGroups({});
        }
    }, [selectedGroup, GET]);

    // Apply local filtering on top of API filtering.
    const filteredGroups = groups.filter((group) => {
        const displayName = `${group.specNameShort} ${group.groupNumber} (${group.enterYear})`;
        return displayName.toLowerCase().includes(groupSearch.toLowerCase());
    });

    // Compact filter form content inside a Popover.
    const filterContent = (
        <Form
            layout="vertical"
            onFinish={(values) => {
                setFilterParams(values);
                fetchGroups(values);
            }}
            initialValues={filterParams}
        >
            <Form.Item label="Год поступления" name="enterYear">
                <Input type="number" placeholder="Год" />
            </Form.Item>
            <Form.Item label="Специальность" name="specNameShort">
                <Input placeholder="Специальность" />
            </Form.Item>
            <Form.Item label="Номер группы" name="groupNumber">
                <Input type="number" placeholder="Номер группы" />
            </Form.Item>
            <Form.Item name="active" valuePropName="checked" label="Активные группы">
                <Checkbox />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" size="small">
                    Применить
                </Button>
                <Button
                    style={{ marginLeft: 8 }}
                    size="small"
                    onClick={() => {
                        setFilterParams({});
                        fetchGroups({});
                    }}
                >
                    Сбросить
                </Button>
            </Form.Item>
        </Form>
    );

    // Schedule items now follow the new structure.
    const [schedule, setSchedule] = useState([
        {
            id: '1',
            eduItem: 'Web Development',
            teacher: 'John Smith',
            conferenceUrl: '',
            practice: false,
            shared: false,
            // Example: if placed in the second row and second column, its timeSlot is:
            timeSlot: 1 * 7 + 1,
        },
    ]);

    const [lessonDrawerVisible, setLessonDrawerVisible] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [form] = Form.useForm();

    // Calculate week days for the schedule grid.
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    // Prepare the data for the schedule table.
    const dataSource = timeSlots.map((slot, rowIndex) => {
        const row = { key: slot.start, time: `${slot.start} - ${slot.end}` };
        weekDays.forEach((day, colIndex) => {
            const cellTimeSlot = rowIndex * weekDays.length + colIndex;
            const lesson = schedule.find(item => item.timeSlot === cellTimeSlot);
            row[day.toDateString()] = lesson || null;
        });
        return row;
    });

    // Build the table columns.
    const columns = [
        {
            title: 'Время',
            dataIndex: 'time',
            key: 'time',
            fixed: 'left',
            width: 120,
            render: text => <strong>{text}</strong>,
        },
        ...weekDays.map((day, colIndex) => ({
            title: (
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {format(day, 'EEEE')}
                </div>
            ),
            dataIndex: day.toDateString(),
            key: day.toDateString(),
            render: (lesson, record, rowIndex) => {
                const cellTimeSlot = rowIndex * weekDays.length + colIndex;
                return lesson ? (
                    <Tooltip title="Редактировать занятие">
                        <motion.div
                            onClick={() => openLessonDrawer(lesson, cellTimeSlot)}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                backgroundColor: 'rgb(43,45,66)',
                                color: 'rgb(255,255,255)'
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                                border: '1px dashed rgba(0, 0, 0, 0.23)',
                                backgroundColor: 'rgb(255,255,255)',
                                color: 'rgb(0,0,0)',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                margin: '4px'
                            }}
                        >
                            <div>{lesson.eduItem}</div>
                            <div style={{ fontSize: '12px' }}>Slot: {lesson.timeSlot}</div>
                        </motion.div>
                    </Tooltip>
                ) : (
                    <Tooltip title="Добавить занятие">
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => openLessonDrawer(null, cellTimeSlot)}
                        />
                    </Tooltip>
                );
            },
        })),
    ];

    // Opens the drawer to add or edit a lesson.
    const openLessonDrawer = (lesson, cellTimeSlot) => {
        setSelectedLesson(lesson);
        setSelectedTimeSlot(cellTimeSlot);
        if (lesson && lesson.id) {
            form.setFieldsValue({
                eduItem: lesson.eduItem,
                teacher: lesson.teacher,
                conferenceUrl: lesson.conferenceUrl,
                type: lesson.practice ? 'practice' : 'lecture',
                shared: lesson.shared,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                type: 'lecture',
                shared: false,
            });
        }
        setLessonDrawerVisible(true);
    };

    // Transform and update schedule on form submission.
    const onLessonFinish = (values) => {
        const newLesson = {
            id: selectedLesson && selectedLesson.id ? selectedLesson.id : Math.random().toString(36).substr(2, 9),
            eduItem: values.eduItem,
            teacher: values.teacher,
            conferenceUrl: values.conferenceUrl || '',
            practice: values.type === 'practice',
            shared: values.shared,
            timeSlot: selectedTimeSlot,
        };

        if (selectedLesson && selectedLesson.id) {
            setSchedule(schedule.map(item => item.id === selectedLesson.id ? newLesson : item));
        } else {
            setSchedule([...schedule, newLesson]);
        }
        setLessonDrawerVisible(false);
    };

    return (
        <div style={{ width: '100%', padding: '24px 0' }}>
            {!selectedGroup && <Skeleton active paragraph={{ rows: 5 }} />}

            <Modal
                visible={!selectedGroup}
                title="Выберите группу"
                centered
                closable={false}
                footer={null}
                maskStyle={{ backdropFilter: 'blur(2px)' }}
            >
                <Input
                    placeholder="Поиск групп"
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    suffix={
                        <Popover placement={"right"} content={filterContent} title="Фильтр групп" trigger="click">
                            <FilterOutlined style={{ cursor: 'pointer' }} />
                        </Popover>
                    }
                />

                <List
                    style={{ marginTop: 12, maxHeight: 300, overflowY: 'auto' }}
                    bordered
                    dataSource={filteredGroups}
                    renderItem={(group) => {
                        const displayName = `${group.specNameShort} ${group.groupNumber} (${group.enterYear})`;
                        return (
                            <List.Item
                                onClick={() => setTempSelectedGroup(group)}
                                style={{
                                    backgroundColor: tempSelectedGroup?.id === group.id ? '#e6f7ff' : 'transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                {displayName}
                            </List.Item>
                        );
                    }}
                />
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            if (tempSelectedGroup) {
                                setSelectedGroup(tempSelectedGroup);
                            }
                        }}
                        disabled={!tempSelectedGroup}
                    >
                        OK
                    </Button>
                </div>
            </Modal>

            {selectedGroup && (
                <>
                    <div
                        style={{
                            marginBottom: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Title level={2} style={{ margin: 0, color: '#2B2D42' }}>
                            Расписание занятий для группы: {`${selectedGroup.specNameShort} ${selectedGroup.groupNumber} (${selectedGroup.enterYear})`}
                        </Title>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedGroup(null);
                                setTempSelectedGroup(null);
                            }}
                        >
                            Изменить группу
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        bordered
                        scroll={{ x: 'max-content' }}
                    />
                    <Drawer
                        title={selectedLesson && selectedLesson.id ? 'Редактировать занятие' : 'Добавить занятие'}
                        placement="right"
                        width={400}
                        onClose={() => setLessonDrawerVisible(false)}
                        visible={lessonDrawerVisible}
                    >
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onLessonFinish}
                            initialValues={{
                                type: 'lecture',
                                shared: false,
                            }}
                        >
                            <Form.Item
                                label="Название занятия"
                                name="eduItem"
                                rules={[{ required: true, message: 'Введите название занятия!' }]}
                            >
                                <Input placeholder="Название занятия" />
                            </Form.Item>
                            <Form.Item
                                label="Преподаватель"
                                name="teacher"
                                rules={[{ required: true, message: 'Введите имя преподавателя!' }]}
                            >
                                <Input placeholder="Имя преподавателя" />
                            </Form.Item>
                            <Form.Item label="Тип занятия" name="type">
                                <Select>
                                    <Option value="lecture">Лекция</Option>
                                    <Option value="practice">Практика</Option>
                                    <Option value="consultation">Консультация</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ссылка на конференцию" name="conferenceUrl">
                                <Input placeholder="URL конференции" />
                            </Form.Item>
                            <Form.Item name="shared" valuePropName="checked">
                                <Checkbox>Доступно всем</Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                    {selectedLesson && selectedLesson.id ? 'Обновить' : 'Добавить'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </>
            )}
        </div>
    );
};

export default LessonSchedule;
