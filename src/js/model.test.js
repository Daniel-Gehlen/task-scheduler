import TaskModel from './model';

describe('TaskModel', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize with empty tasks if localStorage is empty', () => {
    const model = new TaskModel();
    expect(model.tasks).toEqual([]);
  });

  test('should load tasks from localStorage', () => {
    const mockTasks = [{ id: '1', title: 'Test Task', status: 'pending' }];
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
    const model = new TaskModel();
    expect(model.tasks).toEqual(mockTasks);
  });

  test('should add a task and save to localStorage', () => {
    const model = new TaskModel();
    const newTask = { id: '2', title: 'New Task', status: 'pending' };
    model.addTask(newTask);
    expect(model.tasks).toContainEqual(newTask);
    expect(JSON.parse(localStorage.getItem('tasks'))).toContainEqual(newTask);
  });

  test('should delete a task and save to localStorage', () => {
    const mockTasks = [{ id: '1', title: 'Test Task', status: 'pending' }];
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
    const model = new TaskModel();
    model.deleteTask('1');
    expect(model.tasks).toEqual([]);
    expect(localStorage.getItem('tasks')).toBe('[]');
  });

  test('should update a task and save to localStorage', () => {
    const mockTasks = [{ id: '1', title: 'Test Task', status: 'pending' }];
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
    const model = new TaskModel();
    model.updateTask('1', { title: 'Updated Task' });
    expect(model.tasks[0].title).toBe('Updated Task');
    expect(JSON.parse(localStorage.getItem('tasks'))[0].title).toBe('Updated Task');
  });
});
