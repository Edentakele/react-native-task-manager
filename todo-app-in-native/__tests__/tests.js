import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import App from "../App"; // Make sure to adjust the path based on your project structure

describe("Add/Edit Task Flow", () => {
  test("Adding a new task", () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    
    // Find input field by placeholder text and enter a task
    const inputField = getByPlaceholderText("Enter task");
    fireEvent.changeText(inputField, "New Task");

    // Find the "Add Task" button and press it
    const addButton = getByText("Add Task");
    fireEvent.press(addButton);

    // Check if the new task is displayed in the list
    expect(getByText("New Task")).toBeTruthy();
  });

  test("Editing an existing task", () => {
    const { getByText, getByPlaceholderText } = render(<App />);

    // Find the "Edit" button of an existing task and press it
    const editButton = getByText("Edit");
    fireEvent.press(editButton);

    // Find input field by placeholder text and edit the task
    const inputField = getByPlaceholderText("Enter task");
    fireEvent.changeText(inputField, "Edited Task");

    // Find the "Update Task" button and press it
    const updateButton = getByText("Update Task");
    fireEvent.press(updateButton);

    // Check if the task is updated in the list
    expect(getByText("Edited Task")).toBeTruthy();
  });
});
