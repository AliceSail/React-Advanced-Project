import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";
import {
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  Box,
  Flex,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { eventId } = useParams();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    location: "",
    createdBy: "",
  });

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const onCloseDeleteConfirmation = () => setIsDeleteConfirmationOpen(false);
  const cancelRef = React.useRef();

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Convert startTime and endTime to Date objects
        data.startTime = new Date(data.startTime);
        data.endTime = new Date(data.endTime);

        setEvent(data);

        // Fetch creator details using the createdBy field from the event
        if (data.createdBy) {
          fetch(`http://localhost:3000/users/${data.createdBy}`)
            .then((creatorResponse) => creatorResponse.json())
            .then((creatorData) => setCreator(creatorData))
            .catch((creatorError) =>
              console.error("Error fetching creator details:", creatorError)
            );
        }

        // Fetch categories based on categoryIds
        Promise.all(
          data.categoryIds.map((categoryIds) =>
            fetch(`http://localhost:3000/categories/${categoryIds}`).then(
              (response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              }
            )
          )
        )
          .then((categoryData) => setCategories(categoryData))
          .catch((categoryError) =>
            console.error("Error fetching categories:", categoryError)
          );
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        toast({
          title: "Error fetching event details",
          status: "error",
        });
      });
  }, [eventId, toast]);

  const handleEditClick = () => {
    if (event) {
      setEditedEvent({
        title: event.title,
        description: event.description,
        image: event.image,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        createdBy: event.createdBy,
        categoryIds: event.categoryIds,
      });

      setEditMode(true);
    }
  };

  const handleSave = () => {
    // Validate required fields before saving changes
    if (
      editedEvent.title &&
      editedEvent.description &&
      editedEvent.startTime &&
      editedEvent.endTime &&
      editedEvent.location &&
      editedEvent.createdBy
    ) {
      fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedEvent),
      })
        .then((response) => {
          if (response.ok) {
            // Reload the page after saving changes
            window.location.reload();
            toast({
              title: "Event updated successfully!",
              status: "success",
              duration: 3000,
            });
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => {
          console.error("Error updating event:", error);
          toast({
            title: "Error updating event",
            status: "error",
          });
        });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    onCloseDeleteConfirmation(); // Close the confirmation dialog
    handleDeleteEvent(eventId); // Perform the actual deletion

    // Redirect to the events page
    window.location.href = "/";
  };

  const handleDeleteEvent = (eventId) => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          toast({
            title: "Event deleted successfully!",
            status: "success",
            duration: 3000,
          });
        } else {
          console.error("Error deleting event:", response.statusText);
          toast({
            title: "Error deleting event",
            status: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        toast({
          title: "Error deleting event",
          status: "error",
        });
      });
  };

  if (!event || categories.length !== event.categoryIds.length) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Link to="/">
        <ArrowBackIcon boxSize={6} mb={2} mt={2} ml={2} />
      </Link>
      <div>
        <img
          src={
            event.image || // default image
            "https://images.pexels.com/photos/158827/field-corn-air-frisch-158827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          alt={event.title}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <Text ml="5" fontSize="2xl">
          {new Date(event.startTime).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Flex justify="center" align="center" ml="60%">
          <Text mr="5" fontWeight="bold">
            Categories:{" "}
          </Text>
          <Box>
            {event.categoryIds.map((categoryId) => {
              const category = categories.find((cat) => cat.id === categoryId);
              const categoryName = category ? category.name : "N/A";

              return (
                <Badge
                  key={categoryId}
                  borderRadius="full"
                  px="2"
                  mr="5"
                  mb="1"
                  colorScheme="teal"
                >
                  {categoryName}
                </Badge>
              );
            })}
          </Box>
        </Flex>
        <Heading as="h1" ml="5" fontSize="5xl" fontWeight="bold" mb={2}>
          {event.title}
        </Heading>
        <Text fontSize="lg" mb={4} ml="5" style={{ fontStyle: "italic" }}>
          {event.description}
        </Text>
        <Text ml="5" mb={2}>
          <strong>Start Time:</strong>{" "}
          {event.startTime.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Text>
        <Text ml="5" mb={4}>
          <strong>End Time:</strong>{" "}
          {event.endTime.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Text>
        <Text ml="5">
          <strong>Location: </strong> {event.location}
        </Text>{" "}
        {creator && (
          <Flex justify="center" align="center" ml="60%">
            <Text mr="5" fontWeight="bold">
              Created By:{" "}
              {event.createdBy === 1 || event.createdBy === 2 ? (
                creator.name
              ) : (
                <span style={{ fontStyle: "italic" }}>{event.createdBy}</span>
              )}
            </Text>{" "}
          </Flex>
        )}
        <Flex justify="center" align="center" ml="60%">
          {creator && creator.image && (
            <img
              src={creator.image}
              alt={`Creator: ${creator.name}`}
              style={{
                maxWidth: "100px",
                borderRadius: "50%",
              }}
            />
          )}{" "}
        </Flex>
        <Button ml="5" onClick={handleEditClick}>
          Edit
        </Button>
        <Button colorScheme="red" onClick={handleDeleteClick}>
          Delete
        </Button>
        <Modal isOpen={editMode} onClose={() => setEditMode(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit this event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Title of the event</FormLabel>
                <Input
                  type="text"
                  value={editedEvent.title}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, title: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  value={editedEvent.description}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL (if available)</FormLabel>
                <Input
                  type="text"
                  value={editedEvent.image}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, image: e.target.value })
                  }
                />
              </FormControl>
              <Box mb={2} display="flex" flexDirection="row">
                <Box mr={4}>
                  <Text>Start Date:</Text>
                  <DatePicker
                    selected={editedEvent.startTime}
                    onChange={(date) =>
                      setEditedEvent({ ...editedEvent, startTime: date })
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Start Date"
                  />
                </Box>

                <Box>
                  <Text>Start Time:</Text>
                  <DatePicker
                    selected={editedEvent.startTime}
                    onChange={(date) =>
                      setEditedEvent({ ...editedEvent, startTime: date })
                    }
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
                    selected={editedEvent.endTime}
                    onChange={(date) =>
                      setEditedEvent({ ...editedEvent, endTime: date })
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select End Date"
                  />
                </Box>

                <Box>
                  <Text>End Time:</Text>
                  <DatePicker
                    selected={editedEvent.endTime}
                    onChange={(date) =>
                      setEditedEvent({ ...editedEvent, endTime: date })
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    placeholderText="Select End Time"
                  />
                </Box>
              </Box>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  type="text"
                  value={editedEvent.location}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, location: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Created By</FormLabel>
                <Input
                  type="text"
                  value={editedEvent.createdBy}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      createdBy: e.target.value,
                    })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSave}>
                Save
              </Button>
              <Button colorScheme="red" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AlertDialog
          isOpen={isDeleteConfirmationOpen}
          leastDestructiveRef={cancelRef}
          onClose={onCloseDeleteConfirmation}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Event
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this event? This action cannot
                be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseDeleteConfirmation}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </Box>
  );
};
