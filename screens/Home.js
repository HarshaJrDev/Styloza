import { StyleSheet, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';  // Firebase Auth
import { TextInput, Button, Checkbox, Card, Title, Paragraph, SegmentedButtons } from 'react-native-paper';
import DatePicker from 'react-native-date-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
// For DatePicker

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('low');
  const [completed, setCompleted] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isLogin,setIsLogin]=useState(false)

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const tasksSnapshot = await firestore().collection('tasks').get();
      const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, [tasks]);

  // Add a new task
  const addTask = async () => {
    if (!title || !description || !dueDate) {
      alert('Please fill all fields!');
      return;
    }
    await firestore().collection('tasks').add({
      title,
      description,
      dueDate: dueDate.toISOString(),
      priority,
      completed,
    });
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setPriority('low');
  };

  // Delete a task
  const deleteTask = async (id) => {
    await firestore().collection('tasks').doc(id).delete();
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Sign out from Firebase
  const signOut = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('usertoken');  // Remove token from AsyncStorage
      setIsLogin(false);  // Update login state
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const statusFilter = filter.status === 'all' || (filter.status === 'completed' && task.completed) || (filter.status === 'incomplete' && !task.completed);
    const priorityFilter = filter.priority === 'all' || task.priority === filter.priority;
    return statusFilter && priorityFilter;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sorting by due date

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.Header}>
            <Text style={styles.headerText}>Task Manager</Text>
          </View>

          {/* Sign out button */}
          <Button mode="contained" onPress={signOut} style={styles.signOutButton}>
            Sign Out
          </Button>

          {/* Input Form */}
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0088D1' } }}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0088D1' } }}
          />
          <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
            <TextInput
              label="Due Date"
              value={dueDate.toDateString()}
              editable={false}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#0088D1' } }}
            />
          </TouchableOpacity>

          <DatePicker
            modal
            open={openDatePicker}
            date={dueDate}
            onConfirm={(date) => {
              setDueDate(date);
              setOpenDatePicker(false);
            }}
            onCancel={() => setOpenDatePicker(false)}
            theme="light" // Light theme for the date picker
          />

          {/* Priority Section */}
          <Text style={styles.priorityText}>Priority:</Text>
          <SegmentedButtons
            value={priority}
            onValueChange={setPriority}
            buttons={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' }
            ]}
            style={styles.priorityButtons}
            theme={{ colors: { primary: '#0088D1' } }}
          />

          <Button mode="contained" onPress={addTask} style={styles.addButton}>
            Add Task
          </Button>

          {/* Task Filtering */}
          <View style={styles.filterContainer}>
            <Text>Filter by Status:</Text>
            <SegmentedButtons
              value={filter.status}
              onValueChange={(status) => setFilter({ ...filter, status })}
              buttons={[
                { label: 'All', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Incomplete', value: 'incomplete' }
              ]}
              style={styles.filterButtons}
              theme={{ colors: { primary: '#0088D1' } }}
            />

            <Text>Filter by Priority:</Text>
            <SegmentedButtons
              value={filter.priority}
              onValueChange={(priority) => setFilter({ ...filter, priority })}
              buttons={[
                { label: 'All', value: 'all' },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' }
              ]}
              style={styles.filterButtons}
              theme={{ colors: { primary: '#0088D1' } }}
            />
          </View>

          {/* Task List */}
          <FlatList
            data={filteredTasks}
            renderItem={({ item }) => (
              <Card style={styles.taskItem}>
                <Card.Content>
                  <Title style={styles.taskTitle}>{item.title}</Title>
                  <Paragraph>{item.description}</Paragraph>
                  <Text>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
                  <Text>Priority: {item.priority}</Text>
                  <Text>Status: {item.completed ? 'Completed' : 'Incomplete'}</Text>
                  <TouchableOpacity onPress={() => toggleCompletion(item.id, item.completed)}>
                    <Text style={styles.toggleButton}>{item.completed ? 'Mark as Incomplete' : 'Mark as Completed'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  Header: {
    height: 100,
    backgroundColor: '#0088D1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    elevation: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  signOutButton: {
    marginVertical: 20,
    backgroundColor: '#ff4d4d', // You can style it accordingly
    borderRadius: 10,
    paddingVertical: 10,
  },
  priorityText: {
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  priorityButtons: {
    marginBottom: 20,
  },
  addButton: {
    marginVertical: 10,
    backgroundColor: '#0088D1',
    borderRadius: 10,
    paddingVertical: 10,
  },
  filterContainer: {
    marginVertical: 20,
  },
  filterButtons: {
    marginBottom: 20,
  },
  taskItem: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: '#fff',
    padding: 15,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    color: '#0088D1',
    fontSize: 16,
    marginTop: 10,
  },
  deleteButton: {
    color: '#d9534f',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});
