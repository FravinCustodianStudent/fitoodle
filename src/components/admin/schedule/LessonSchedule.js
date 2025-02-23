import React, { useState } from 'react';
import { format, startOfWeek, addDays, parse, isSameDay } from 'date-fns';
import {
    Plus,
    X,
    Clock,
    Users,
    BookOpen,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import './LessonSchedule.scss'; // Подключаем наш BEM-файл стилей

// Определяем интерфейсы / типы (если вы хотите использовать TS):
// Убираем для JS: только оставим JSDoc или просто без типов.
// Здесь оставим как комментарий:

/**
 * @typedef {Object} TimeSlot
 * @property {string} id
 * @property {string} title
 * @property {string} instructor
 * @property {string} group
 * @property {'lecture' | 'practice' | 'consultation'} type
 * @property {string} startTime
 * @property {string} endTime
 * @property {Date} day
 * @property {boolean} recurring
 */

// Компонент
const LessonSchedule = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTimeSlot, setNewTimeSlot] = useState({
        type: 'lecture',
        recurring: false,
    });

    // Текущая дата и неделя
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    // Временные слоты (каждый час с 8:00 до 20:00, например)
    const timeSlots = Array.from({ length: 12 }).map((_, i) => ({
        start: `${8 + i}:00`,
        end: `${9 + i}:00`,
    }));

    // Мок-данные расписания
    const [schedule, setSchedule] = useState([
        {
            id: '1',
            title: 'Web Development',
            instructor: 'John Smith',
            group: 'Group A',
            type: 'lecture',
            startTime: '10:00',
            endTime: '11:00',
            day: weekDays[1],
            recurring: true,
        },
    ]);

    // Клик по пустому слоту (нет existingSlot)
    const handleSlotClick = (time, day) => {
        setSelectedSlot({ time, day });
        setNewTimeSlot({
            ...newTimeSlot,
            startTime: time,
            day: day,
            endTime: parse(time, 'HH:mm', new Date()).getHours() + 1 + ':00',
        });
        setIsModalOpen(true);
    };

    // Создание нового тайм-слота
    const handleCreateTimeSlot = () => {
        if (!selectedSlot) return;

        const newSlot = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTimeSlot.title || '',
            instructor: newTimeSlot.instructor || '',
            group: newTimeSlot.group || '',
            type: newTimeSlot.type,
            startTime: newTimeSlot.startTime,
            endTime: newTimeSlot.endTime,
            day: selectedSlot.day,
            recurring: newTimeSlot.recurring,
        };

        setSchedule([...schedule, newSlot]);
        setIsModalOpen(false);

        // Сброс формы
        setNewTimeSlot({
            type: 'lecture',
            recurring: false,
        });
    };

    // Проверка, есть ли уже слот в schedule
    const getSlotForTime = (time, day) => {
        return schedule.find(
            (slot) => slot.startTime === time && isSameDay(slot.day, day)
        );
    };

    // Переключение недель (пока заглушка)
    const handlePrevWeek = () => {
        console.log('Prev week clicked');
    };
    const handleNextWeek = () => {
        console.log('Next week clicked');
    };

    return (
        <div className="lesson-schedule">
            {/* Заголовок */}
            <div className="lesson-schedule__header">
                <h1 className="lesson-schedule__title">Lesson Schedule</h1>
                <div className="lesson-schedule__nav">
                    <a
                        href="#"
                        className="lesson-schedule__nav-button"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePrevWeek();
                        }}
                    >
                        <ChevronLeft className="lesson-schedule__icon" />
                    </a>
                    <span className="lesson-schedule__week-range">
            {format(weekStart, 'MMMM d')} -{' '}
                        {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
          </span>
                    <a
                        href="#"
                        className="lesson-schedule__nav-button"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNextWeek();
                        }}
                    >
                        <ChevronRight className="lesson-schedule__icon" />
                    </a>
                </div>
            </div>

            {/* Таблица расписания */}
            <div className="lesson-schedule__table">
                {/* Заголовок с днями недели */}
                <div className="lesson-schedule__table-header">
                    <div className="lesson-schedule__time-column lesson-schedule__cell--header"></div>
                    {weekDays.map((day) => (
                        <div key={day.toString()} className="lesson-schedule__day-header lesson-schedule__cell--header">
                            <div className="lesson-schedule__day-name">
                                {format(day, 'EEEE')}
                            </div>
                            <div className="lesson-schedule__day-date">
                                {format(day, 'MMM d')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Строки с временем */}
                <div className="lesson-schedule__table-body">
                    {timeSlots.map((slot) => (
                        <div key={slot.start} className="lesson-schedule__row">
                            {/* Время слева */}
                            <div className="lesson-schedule__time-column lesson-schedule__cell--time">
                                {slot.start}
                            </div>

                            {/* Ячейки для каждого дня */}
                            {weekDays.map((day) => {
                                const existingSlot = getSlotForTime(slot.start, day);
                                return (
                                    <div
                                        key={`${day}-${slot.start}`}
                                        className="lesson-schedule__cell lesson-schedule__cell--day"
                                        onClick={() => !existingSlot && handleSlotClick(slot.start, day)}
                                    >
                                        {existingSlot ? (
                                            <div
                                                className={`lesson-schedule__slot lesson-schedule__slot--${existingSlot.type}`}
                                            >
                                                <div className="lesson-schedule__slot-title">
                                                    {existingSlot.title}
                                                </div>
                                                <div className="lesson-schedule__slot-group">
                                                    {existingSlot.group}
                                                </div>
                                                <div className="lesson-schedule__slot-instructor">
                                                    {existingSlot.instructor}
                                                </div>
                                                <div className="lesson-schedule__slot-time">
                                                    <Clock className="lesson-schedule__icon--small" />
                                                    <span>
                            {existingSlot.startTime} - {existingSlot.endTime}
                          </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="lesson-schedule__empty-slot">
                                                <Plus className="lesson-schedule__icon--faded" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Модальное окно создания слота */}
            {isModalOpen && (
                <div className="lesson-schedule__modal-overlay">
                    <div className="lesson-schedule__modal">
                        <div className="lesson-schedule__modal-header">
                            <h2 className="lesson-schedule__modal-title">Create Time Slot</h2>
                            <a
                                href="#"
                                className="lesson-schedule__modal-close"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsModalOpen(false);
                                }}
                            >
                                <X className="lesson-schedule__icon" />
                            </a>
                        </div>

                        <div className="lesson-schedule__modal-body">
                            <div className="lesson-schedule__form-group">
                                <label className="lesson-schedule__label">Title</label>
                                <input
                                    type="text"
                                    value={newTimeSlot.title || ''}
                                    onChange={(e) =>
                                        setNewTimeSlot({ ...newTimeSlot, title: e.target.value })
                                    }
                                    className="lesson-schedule__input"
                                    placeholder="Enter lesson title"
                                />
                            </div>

                            <div className="lesson-schedule__form-group">
                                <label className="lesson-schedule__label">Type</label>
                                <select
                                    value={newTimeSlot.type}
                                    onChange={(e) =>
                                        setNewTimeSlot({ ...newTimeSlot, type: e.target.value })
                                    }
                                    className="lesson-schedule__input"
                                >
                                    <option value="lecture">Lecture</option>
                                    <option value="practice">Practice</option>
                                    <option value="consultation">Consultation</option>
                                </select>
                            </div>

                            <div className="lesson-schedule__time-row">
                                <div>
                                    <label className="lesson-schedule__label">Start Time</label>
                                    <input
                                        type="time"
                                        value={newTimeSlot.startTime || ''}
                                        onChange={(e) =>
                                            setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })
                                        }
                                        className="lesson-schedule__input"
                                    />
                                </div>
                                <div>
                                    <label className="lesson-schedule__label">End Time</label>
                                    <input
                                        type="time"
                                        value={newTimeSlot.endTime || ''}
                                        onChange={(e) =>
                                            setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })
                                        }
                                        className="lesson-schedule__input"
                                    />
                                </div>
                            </div>

                            <div className="lesson-schedule__form-group">
                                <label className="lesson-schedule__label">Instructor</label>
                                <input
                                    type="text"
                                    value={newTimeSlot.instructor || ''}
                                    onChange={(e) =>
                                        setNewTimeSlot({ ...newTimeSlot, instructor: e.target.value })
                                    }
                                    className="lesson-schedule__input"
                                    placeholder="Enter instructor name"
                                />
                            </div>

                            <div className="lesson-schedule__form-group">
                                <label className="lesson-schedule__label">Group</label>
                                <input
                                    type="text"
                                    value={newTimeSlot.group || ''}
                                    onChange={(e) =>
                                        setNewTimeSlot({ ...newTimeSlot, group: e.target.value })
                                    }
                                    className="lesson-schedule__input"
                                    placeholder="Enter group name"
                                />
                            </div>

                            <div className="lesson-schedule__checkbox-row">
                                <input
                                    type="checkbox"
                                    id="recurring"
                                    checked={newTimeSlot.recurring || false}
                                    onChange={(e) =>
                                        setNewTimeSlot({ ...newTimeSlot, recurring: e.target.checked })
                                    }
                                    className="lesson-schedule__checkbox"
                                />
                                <label htmlFor="recurring" className="lesson-schedule__checkbox-label">
                                    Recurring weekly
                                </label>
                            </div>
                        </div>

                        <div className="lesson-schedule__modal-footer">
                            <a
                                href="#"
                                className="lesson-schedule__btn lesson-schedule__btn--outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsModalOpen(false);
                                }}
                            >
                                Cancel
                            </a>
                            <a
                                href="#"
                                className="lesson-schedule__btn lesson-schedule__btn--primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCreateTimeSlot();
                                }}
                            >
                                Create
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonSchedule;
