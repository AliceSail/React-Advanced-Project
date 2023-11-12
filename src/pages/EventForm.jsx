import React, { useState } from "react";
import { Input, IconButton, Text, Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EventForm.css";

const EventForm = ({ onRequestClose, onAddEvent, categories }) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    image: "",
    location: "",
    categoryIds: [],
    createdBy: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleCategoryChange = (categoryId) => {
    const updatedCategoryIds = eventData.categoryIds.includes(categoryId)
      ? eventData.categoryIds.filter((id) => id !== categoryId)
      : [...eventData.categoryIds, categoryId];

    setEventData({
      ...eventData,
      categoryIds: updatedCategoryIds,
    });
  };

  const handleTimeChange = (date, fieldName) => {
    setEventData({
      ...eventData,
      [fieldName]: date,
    });
  };

  const handleAddEvent = () => {
    if (
      eventData.title &&
      eventData.description &&
      eventData.startTime &&
      eventData.endTime &&
      eventData.location &&
      eventData.createdBy
    ) {
      onAddEvent(eventData);
      onRequestClose();
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <Box p={4}>
      <IconButton
        icon={<CloseIcon />}
        aria-label="Close"
        onClick={onRequestClose}
        position="absolute"
        right="8px"
        top="8px"
      />
      <h2>Add Event</h2>
      <Input
        type="text"
        name="title"
        value={eventData.title}
        onChange={handleInputChange}
        placeholder="Title"
        mb={2}
      />
      <Input
        type="text"
        name="description"
        value={eventData.description}
        onChange={handleInputChange}
        placeholder="Description"
        mb={2}
      />
      <Input
        type="text"
        name="location"
        value={eventData.location}
        onChange={handleInputChange}
        placeholder="Location"
        mb={2}
      />
      <Box mb={2} display="flex" flexDirection="row">
        <Box mr={4}>
          <Text>Start Date:</Text>
          <DatePicker
            selected={eventData.startTime}
            onChange={(date) => handleTimeChange(date, "startTime")}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Start Date"
          />
        </Box>

        <Box>
          <Text>Start Time:</Text>
          <DatePicker
            selected={eventData.startTime}
            onChange={(date) => handleTimeChange(date, "startTime")}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            placeholderText="Select Start Time"
          />
        </Box>
      </Box>

      <Box mb={2} display="flex" flexDirection="row">
        <Box mr={4}>
          <Text>End Date:</Text>
          <DatePicker
            selected={eventData.endTime}
            onChange={(date) => handleTimeChange(date, "endTime")}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select End Date"
          />
        </Box>

        <Box>
          <Text>End Time:</Text>
          <DatePicker
            selected={eventData.endTime}
            onChange={(date) => handleTimeChange(date, "endTime")}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            placeholderText="Select End Time"
          />
        </Box>
      </Box>

      <Input
        type="text"
        name="image"
        value={eventData.image}
        onChange={handleInputChange}
        placeholder="Add an image for your event (if available)"
        mb={2}
      />
      <Input
        type="text"
        name="createdBy"
        value={eventData.createdBy}
        onChange={handleInputChange}
        placeholder="Your Name"
        mb={2}
      />

      <Box mb={4}>
        <h3>Categories:</h3>
        {categories.map((category) => (
          <div key={category.id}>
            <input
              type="checkbox"
              checked={eventData.categoryIds.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
            />
            <label>{category.name}</label>
          </div>
        ))}
      </Box>

      <button onClick={handleAddEvent}>Add Event</button>
    </Box>
  );
};

export default EventForm;
