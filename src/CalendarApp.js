import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarApp.css';

const CalendarApp = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [categories, setCategories] = useState([
    { name: 'Работа', color: '#ff5733' },
    { name: 'Личное', color: '#33c1ff' },
    { name: 'Спорт', color: '#75ff33' },
    { name: 'Учеба', color: '#ff33a1' }
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleAddEvent = () => {
    if (!eventTitle || !eventCategory) return; // Проверка на пустые значения
    const formattedDate = date.toLocaleDateString();
    const newEvent = { title: eventTitle, category: eventCategory };

    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: [...(prevEvents[formattedDate] || []), newEvent],
    }));
    setEventTitle('');
    setEventCategory('');
  };

  const tileContent = ({ date }) => {
    const formattedDate = date.toLocaleDateString();
    if (events[formattedDate]) {
      return events[formattedDate].map((event, index) => {
        if (selectedCategories.length === 0 || selectedCategories.includes(event.category)) {
          const categoryObj = categories.find(cat => cat.name === event.category);
          return categoryObj ? (
            <span key={index} className="event-marker" style={{ color: categoryObj.color }}>•</span>
          ) : null;
        }
        return null;
      });
    }
    return null;
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName && !categories.find(cat => cat.name === newCategoryName)) {
      const newCategory = { name: newCategoryName, color: newCategoryColor };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryColor('#000000'); // Сброс цвета
    } else {
      alert('Категория уже существует или введена пустая строка.');
    }
  };

  return (
    <div className="calendar-app">
      <h1>Календарь событий</h1>
      <div className="calendar-container">
        <Calendar 
          onChange={handleDateChange} 
          value={date} 
          tileContent={tileContent} 
        />
      </div>
      <div className="event-form">
        <input
          type="text"
          placeholder="Название события"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <select
          value={eventCategory}
          onChange={(e) => setEventCategory(e.target.value)}
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddEvent}>Добавить событие</button>
      </div>

      <div className="category-filter">
        <h2>Фильтр по категориям</h2>
        {categories.map((category) => (
          <label key={category.name} style={{ color: category.color }}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.name)}
              onChange={() => handleCategoryChange(category.name)}
            />
            {category.name}
          </label>
        ))}
        <div className="add-category">
          <h3>Добавить категорию</h3>
          <div className="add-category">
            <input
              type="text"
              placeholder="Название новой категории"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
            />
            <button onClick={handleAddCategory}>Добавить категорию</button>
          </div>
        </div>
      </div>

      <div className="events-list">
        <h2>События на {date.toLocaleDateString()}</h2>
        {events[date.toLocaleDateString()] ? (
          events[date.toLocaleDateString()]
            .filter(event => selectedCategories.length === 0 || selectedCategories.includes(event.category))
            .map((event, index) => {
              const categoryObj = categories.find(cat => cat.name === event.category);
              return (
                <div key={index} className="event-item" style={{ color: categoryObj.color }}>
                  <strong>{event.title}</strong> - <em>{event.category}</em>
                </div>
              );
            })
        ) : (
          <p>Нет событий на этот день.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarApp;
