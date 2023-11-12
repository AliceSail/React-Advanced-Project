import React, { useState, useEffect } from "react";
import {
  Heading,
  List,
  ListItem,
  Text,
  Button,
  Input,
  Box,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import EventForm from "./EventForm";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Fetch events data
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    // Fetch categories data
    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const displayedCategoryNames = event.categoryIds
        .map((categoryId) => {
          const category = categories.find((cat) => cat.id === categoryId);
          return category ? category.name : "N/A";
        })
        .join(", ");

      const isCategoryMatch =
        selectedCategory === "All" ||
        displayedCategoryNames.includes(selectedCategory);

      const isSearchMatch = event.title
        .toLowerCase()
        .includes(searchInput.toLowerCase());

      return isCategoryMatch && isSearchMatch;
    });

    setFilteredEvents(filtered);
  }, [searchInput, selectedCategory, events, categories]);

  const handleAddEvent = (newEvent) => {
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((addedEvent) => {
        setEvents([...events, addedEvent]);
      })
      .catch((error) => console.error("Error adding event:", error));

    setIsModalOpen(false);
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  return (
    <Box maxW="100%" p="4" ml="25%" mr="25%">
      <Heading mb="4">List of Events</Heading>

      <Input
        type="text"
        placeholder="Search events"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        mb="4"
      />

      <Button onClick={() => setIsModalOpen(true)} colorScheme="teal">
        Add an Event
      </Button>

      <Box mt="4" mb="4">
        <Button
          onClick={() => setSelectedCategory("All")}
          variant={selectedCategory === "All" ? "solid" : "outline"}
          mr="2"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            variant={selectedCategory === category.name ? "solid" : "outline"}
            mr="2"
          >
            {category.name}
          </Button>
        ))}
      </Box>

      <List>
        {filteredEvents.map((event) => (
          <ListItem
            key={event.id}
            mb="4"
            position="relative"
            overflow="hidden"
            borderRadius="md"
          >
            <RouterLink
              to={`/event/${event.id}`}
              state={event}
              onClick={() => setSelectedEvent(event)}
            >
              <Box
                position="relative"
                _before={{
                  content: `""`,
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                }}
              >
                <Text
                  fontSize="5xl"
                  fontWeight="bold"
                  color="white"
                  position="absolute"
                  top="20%"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={2}
                  textAlign="center"
                >
                  {event.title}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="normal"
                  color="white"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={2}
                  textAlign="center"
                >
                  {`Start Time: ${formatDateTime(event.startTime)}`}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="normal"
                  color="white"
                  position="absolute"
                  top="55%"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={2}
                  textAlign="center"
                >
                  {`End Time: ${formatDateTime(event.endTime)}`}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="normal"
                  color="white"
                  position="absolute"
                  top="60%"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={2}
                  textAlign="center"
                >
                  Description: {event.description}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="normal"
                  color="white"
                  position="absolute"
                  top="70%"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={2}
                  textAlign="center"
                >
                  Categories:{" "}
                  {event.categoryIds && event.categoryIds.length > 0
                    ? event.categoryIds.map((categoryId, index) => {
                        const category = categories.find(
                          (cat) => cat.id === categoryId
                        );
                        const categoryName = category ? category.name : "N/A";

                        const isLastCategory =
                          index === event.categoryIds.length - 1;
                        return isLastCategory
                          ? categoryName
                          : categoryName + ", ";
                      })
                    : "No categories"}
                </Text>
                <img
                  src={
                    event.image ||
                    "https://images.pexels.com/photos/158827/field-corn-air-frisch-158827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  }
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </RouterLink>
          </ListItem>
        ))}
      </List>

      {isModalOpen && (
        <Box
          position="fixed"
          top="55%"
          left="1"
          transform="translateY(-50%)"
          zIndex={2}
          bg="white"
          p="4"
          border="2px solid black"
          borderRadius="md"
          width="30%"
        >
          <EventForm
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onAddEvent={handleAddEvent}
            categories={categories}
          />
        </Box>
      )}
      {selectedEvent && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={2}
        >
          <Text fontSize="3xl">{selectedEvent.title}</Text>
        </Box>
      )}
    </Box>
  );
};
export default EventsPage;
