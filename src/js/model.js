import Logger from './utils/logger.js';

export default class TaskModel {
  constructor() {
    this._tasksCache = this.loadTasks();
  }

  get tasks() {
    return this._tasksCache;
  }

  loadTasks() {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      Logger.info('Tarefas carregadas com sucesso', { count: tasks.length });
      return tasks;
    } catch (error) {
      Logger.error('Erro ao carregar tarefas do localStorage', { error: error.message });
      return [];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('tasks', JSON.stringify(this._tasksCache));
      Logger.info('Tarefas salvas com sucesso');
    } catch (error) {
      Logger.error('Erro ao salvar tarefas no localStorage', { error: error.message });
      alert('Não foi possível salvar as tarefas. O armazenamento local pode estar cheio.');
    }
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
