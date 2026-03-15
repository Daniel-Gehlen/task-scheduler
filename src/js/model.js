export default class TaskModel {
  constructor() {
    this._tasksCache = this.loadTasks();
  }

  get tasks() {
    return this._tasksCache;
  }

  loadTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this._tasksCache));
  }

  addTask(task) {
    this._tasksCache.push(task);
    this.saveTasks();
  }

  deleteTask(id) {
    this._tasksCache = this._tasksCache.filter((task) => task.id !== id);
    this.saveTasks();
  }

  updateTask(id, newData) {
    const taskIndex = this._tasksCache.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this._tasksCache[taskIndex] = { ...this._tasksCache[taskIndex], ...newData };
      this.saveTasks();
    }
  }
}
