import React, { useEffect} from 'react';
 import { Form, Input, Select, DatePicker, Switch, Button ,Table,FormInstance, notification} from 'antd';
 import axios from 'axios';
 const { Option } = Select;

   interface Task { 
    key: string; 
    taskTitle: string; 
    priority: string; 
    dueDate: string; 
    status: boolean; 
   }

     interface TaskFormProps {
            form:FormInstance;
            columns: any; 
            tasks: Task[]; 
            setTasks: React.Dispatch<React.SetStateAction<Task[]>>
            onFinish:(value:any)=>void;
      }

 const TaskForm: React.FC<TaskFormProps>= ({form,columns,tasks, setTasks,onFinish}) => 
{

  useEffect(() =>  {
     axios.get('https://jsonplaceholder.typicode.com/todos')
     .then(response => { 
      const fetchedTasks = response.data.slice(0,21 ).map((task: any) =>( { 
     key: task.id.toString(),
     taskTitle: task.title, 
     priority: 'medium', 
     dueDate: '2024-12-31', 
     status: task.completed          
       })); 
       setTasks(fetchedTasks) })
       .catch((error) => {
        notification.error({
       message:"Error in fetcing the data",
       description:`There was an error fetching the task: ${error.message}`
        })
      });
    }, []);

 return (
 <div className="flex flex-col container mx-auto  px-4 py-10 space-y-5 ">
     <h1 className="text-2xl font-semibold text-center">Task Managment App</h1>

      <Form
      form={form}
      className="w-[93%] mx-auto bg-white shadow-xl p-6 sm:p-10 rounded-lg"
      layout="vertical"
      onFinish={onFinish}
     >
      <Form.Item
      className="font-semibold"
        label="Task Title"
        name="taskTitle"
        rules={[{ required: true, message: 'Please input the task title!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        rules={[{ required: true, message: 'Please select the priority!' }]}
      >
        <Select>
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[{ required: true, message: 'Please select the due date!' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        valuePropName="checked"
      >
        <Switch checkedChildren="Completed" unCheckedChildren="Not Completed" />
      </Form.Item>

      <Form.Item>
        <Button
         className="w-full "
          type="primary" htmlType="submit">
          Add Task
         </Button>
       </Form.Item>

      </Form>
    

     <div className="overflow-x-auto  sm:p-10 rounded-lg w-[93%] mx-auto bg-white shadow-xl  shadow-gray-200">
         <Table 
         className=" rounded-md text-sm"
         dataSource={tasks}
         columns={columns}
          rowKey="key"
          pagination={{
          pageSize:4,
          showSizeChanger: false,
          pageSizeOptions: ['10', '20', '50'], }}
         scroll={{ x: 500 }}
         />
     </div>
 </div>
  )
};

export default TaskForm;
