export default class TaskView {
  constructor() {
    this.app = document.getElementById('app');
    this.renderBaseHTML();
  }

  renderBaseHTML() {
    this.app.innerHTML = `
      <h1>Agendador de Tarefas</h1>

      <div id="task-form">
        <h2>Adicionar Nova Tarefa</h2>
        <div class="form-group">
          <label for="task-title">Título:</label>
          <input type="text" id="task-title" required>
        </div>
        <div class="form-group">
          <label for="task-description">Descrição:</label>
          <textarea id="task-description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="task-due-date">Data e Hora:</label>
          <input type="datetime-local" id="task-due-date" required>
        </div>
        <div class="form-group">
          <label for="task-status">Status:</label>
          <select id="task-status">
            <option value="pending">Pendente</option>
            <option value="in-progress">Em Progresso</option>
            <option value="completed">Concluído</option>
          </select>
        </div>
        <button id="save-task" class="add-btn">Salvar Tarefa</button>
        <button id="mock-data" class="add-btn" style="background: #9c27b0;">Gerar Dados de Teste</button>
      </div>

      <div class="filter-controls">
        <button id="filter-week">Mostrar Esta Semana</button>
        <button id="filter-all">Mostrar Todas</button>
      </div>

      <div class="kanban">
        <div class="column" id="pending-column">
          <h2>Pendente</h2>
          <div class="tasks" id="pending-tasks"></div>
        </div>
        <div class="column" id="in-progress-column">
          <h2>Em Progresso</h2>
          <div class="tasks" id="in-progress-tasks"></div>
        </div>
        <div class="column" id="completed-column">
          <h2>Concluído</h2>
          <div class="tasks" id="completed-tasks"></div>
        </div>
      </div>
    `;
  }

  renderTasks(tasks) {
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    this.renderTaskList('pending-tasks', pendingTasks);
    this.renderTaskList('in-progress-tasks', inProgressTasks);
    this.renderTaskList('completed-tasks', completedTasks);
  }

  renderTaskList(containerId, tasks) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (tasks.length === 0) {
      container.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
      return;
    }

    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const formattedDate = dueDate.toLocaleDateString() + ' ' + dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      const taskElement = document.createElement('div');
      taskElement.className = `task status-${task.status.replace(' ', '-')}`;
      taskElement.draggable = true;
      taskElement.dataset.id = task.id;

      taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || 'Sem descrição'}</p>
        <p><strong>Data:</strong> ${formattedDate}</p>
        <div class="task-actions">
          <button class="edit-btn" data-id="${task.id}">Editar</button>
          <button class="delete-btn" data-id="${task.id}">Excluir</button>
          <button class="remind-btn" data-id="${task.id}">Lembrar</button>
        </div>
      `;

      container.appendChild(taskElement);
    });
  }

  getFormData() {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title: document.getElementById('task-title').value,
      description: document.getElementById('task-description').value,
      dueDate: document.getElementById('task-due-date').value,
      status: document.getElementById('task-status').value
    };
  }

  clearForm() {
    document.getElementById('task-form').reset();
  }

  bindAddTask(handler) {
    document.getElementById('save-task').addEventListener('click', handler);
  }

  bindMockData(handler) {
    document.getElementById('mock-data').addEventListener('click', handler);
  }

  bindFilterWeek(handler) {
    document.getElementById('filter-week').addEventListener('click', handler);
  }

  bindFilterAll(handler) {
    document.getElementById('filter-all').addEventListener('click', handler);
  }

  bindDeleteTask(handler) {
    this.app.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        handler(e.target.dataset.id);
      }
    });
  }

  bindEditTask(handler) {
    this.app.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        handler(e.target.dataset.id);
      }
    });
  }

  bindRemindTask(handler) {
    this.app.addEventListener('click', (e) => {
      if (e.target.classList.contains('remind-btn')) {
        handler(e.target.dataset.id);
      }
    });
  }

  setupDragAndDrop(onDrop) {
    const tasks = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.column .tasks');

    tasks.forEach(task => {
      task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
      });

      task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
      });
    });

    columns.forEach(column => {
      column.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
          const afterElement = this.getDragAfterElement(column, e.clientY);
          if (afterElement) {
            column.insertBefore(draggingTask, afterElement);
          } else {
            column.appendChild(draggingTask);
          }
        }
      });

      column.addEventListener('drop', () => {
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
          const newStatus = column.parentElement.id.replace('-column', '').replace('-', ' ');
          onDrop(draggingTask.dataset.id, newStatus);
        }
      });
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}
