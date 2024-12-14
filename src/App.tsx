import React, {useState, useRef } from 'react';
import './App.css';
import TaskForm from './components/TaskForm.tsx';
import { Button, Form, notification, Space } from 'antd'; 
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

interface Task { 
  key: string; 
  taskTitle: string;
  priority: string;
  dueDate: string;
   status: boolean; 
  }

const App: React.FC=() =>{
const [editingTask, setEditingTask] = useState<Task | null>(null);
const [tasks, setTasks] = useState<Task[]>([]);
const [form] = Form.useForm();
const formRef = useRef<HTMLDivElement>(null);

const columns = [
    {
     title: 'Task Title', 
     dataIndex: 'taskTitle', 
     key: 'taskTitle',  
     render: (text: string) => <span className="break-words">{text}</span>,
    }, 
    { 
      title: 'Priority', 
       dataIndex: 'priority',
       key: 'priority', 
    }, 
    {
         title: 'Due Date',
          dataIndex: 'dueDate', 
          key: 'dueDate', 
    }, 
    { 
          title: 'Status', 
          dataIndex: 'status', 
          key: 'status', 
          render: (status: boolean) => ( <span>{status ? 'Completed' : 'Not Completed'}</span> ),
    }, 
    {
           title: 'Actions', 
           key: 'actions', 
           render: (text, record) => ( <Space size="middle">
           <Button icon={<EditOutlined />} onClick={() => handleEditTask(record)} type="primary">Edit</Button>
            <Button icon={<DeleteOutlined />}   onClick={() => handleDeleteTask(record.key)} >Delete</Button> </Space> ),
    }
  ];

    const onFinish = (values: any) => {
      const updatedTask: Task = { key: editingTask ? editingTask.key : `${Date.now()}`, ...values, dueDate: values.dueDate.format('YYYY-MM-DD'), };
      if (editingTask) { 
        // Update existing task 
          axios.put(`https://jsonplaceholder.typicode.com/todos/${editingTask.key}`, updatedTask) 
          .then(() => { setTasks(tasks.map(task => task.key === editingTask.key ? updatedTask : task));
          notification.success({ 
          message: 'Task Updated', 
          description: 'Your task was updated successfully!', 
          });
         setEditingTask(null); 
          form.resetFields(); 
            }).catch((error) => {
              notification.error({
             message:"Error Updating",
             description:`There was an error updating the task: ${error.message}`
              })
            });
        } 
      else { 
        // Add new task
         axios.post('https://jsonplaceholder.typicode.com/todos', updatedTask)
          .then(() =>{ setTasks([...tasks, updatedTask]);
          notification.success({ 
          message: 'Task Added', 
          description: 'Your task was added successfully!',
           });
           form.resetFields()
          }) .catch((error) => {
            notification.error({
           message:"Error for adding a task",
           description:`There was an error adding the task: ${error.message}`
            })
          });
        };
    };

    const handleDeleteTask = (key: string) => {
       axios.delete(`https://jsonplaceholder.typicode.com/todos/${key}`) 
     .then(() => { setTasks(tasks.filter(task => task.key !== key));
      notification.success({
      message: 'Task Deleted', 
      description: 'Your task was deleted successfully!', 
        })
      }) .catch((error) => {
        notification.error({
       message:"Error Deleting",
       description:`There was an error deleting the task: ${error.message}`
        })
      }); 
   };

  const handleEditTask = (task: Task) => { 
  setEditingTask(task); 
   form.setFieldsValue({ 
    taskTitle: task.taskTitle, 
    priority: task.priority, 
    dueDate:moment(task.dueDate), 
    status: task.status, 

  });
  // when edit button is clicked it reachs the form and then u can edit
  formRef.current?.scrollIntoView({ behavior: 'smooth' });
};

 return (
<div 
    className="bg-gray-100"

    >
      <div ref={formRef}>
   <TaskForm
   form={form}
   tasks={tasks}
   setTasks={setTasks}
   columns={columns}
   onFinish={onFinish}
   />
   </div>
</div>
  );
}

export default App;
