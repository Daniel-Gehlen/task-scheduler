export default class TaskModel {
  constructor() {
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(task) {
    this.tasks.push(task);
    this.saveTasks();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  updateTask(id, newData) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...newData };
      this.saveTasks();
    }
  }
}
