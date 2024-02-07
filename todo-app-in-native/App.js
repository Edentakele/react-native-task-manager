import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const groupTasksByDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const groupedTasks = {
      Today: [],
      Tomorrow: [],
      Upcoming: [],
    };

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      if (isSameDate(taskDate, today)) {
        groupedTasks.Today.push(task);
      } else if (isSameDate(taskDate, tomorrow)) {
        groupedTasks.Tomorrow.push(task);
      } else if (taskDate > tomorrow) {
        groupedTasks.Upcoming.push(task);
      }
    });

    return groupedTasks;
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleAddTask = () => {
    if (task) {
      const newTask = { text: task, date: new Date().toISOString() };
      if (editIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = newTask;
        setTasks(updatedTasks);
        setEditIndex(-1);
      } else {
        setTasks([...tasks, newTask]);
      }
      setTask("");
      saveTasks([...tasks, newTask]);
    }
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit.text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.task}>
      <Text style={styles.itemList}>{item.text}</Text>
      <View style={styles.taskButtons}>
        <TouchableOpacity onPress={() => handleEditTask(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(index)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGroupedTasks = () => {
    const groupedTasks = groupTasksByDate();
    return Object.entries(groupedTasks).map(([group, tasks]) => (
      <View key={group}>
        <Text style={styles.sectionHeading}>{group}</Text>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verenda</Text>
      <Text style={styles.title}>ToDo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>
      {renderGroupedTasks()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  itemList: {
    fontSize: 18,
    color: "#333",
  },
  taskButtons: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "blue",
  },
});


export default App;
