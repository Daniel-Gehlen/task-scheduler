export default class TaskView {
  constructor() {
    this.app = document.getElementById('app');
    this.renderBaseHTML();
  }

  renderBaseHTML() {
    this.app.innerHTML = `
      <header class="main-header">
        <h1>Agendador de Tarefas</h1>
        <div class="header-controls">
          <div class="search-container">
            <input type="text" id="task-search" placeholder="Pesquisar tarefas...">
            <span class="search-icon">🔍</span>
          </div>
          <button id="theme-toggle" class="icon-btn" title="Alternar Tema">🌓</button>
        </div>
      </header>

      <div class="container">
        <div id="task-form-container">
          <button id="toggle-form-btn" class="add-btn">+ Nova Tarefa</button>
          <div id="task-form" class="hidden">
            <h2 id="form-title">Adicionar Nova Tarefa</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="task-title">Título:</label>
                <input type="text" id="task-title" required>
              </div>
              <div class="form-group">
                <label for="task-due-date">Data e Hora:</label>
                <input type="datetime-local" id="task-due-date" required>
              </div>
              <div class="form-group">
                <label for="task-priority">Prioridade:</label>
                <select id="task-priority">
                  <option value="low">Baixa</option>
                  <option value="medium" selected>Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div class="form-group">
                <label for="task-status">Status:</label>
                <select id="task-status">
                  <option value="pending">Pendente</option>
                  <option value="in-progress">Em Progresso</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="task-description">Descrição:</label>
              <textarea id="task-description" rows="2"></textarea>
            </div>
            <div class="form-actions">
              <button id="save-task" class="add-btn">Salvar</button>
              <button id="cancel-task" class="cancel-btn">Cancelar</button>
              <button id="mock-data" class="mock-btn">Gerar Mock</button>
            </div>
          </div>
        </div>

        <div class="filter-controls">
          <button id="filter-week" class="filter-btn">Esta Semana</button>
          <button id="filter-all" class="filter-btn active">Todas</button>
        </div>

        <div class="kanban">
          <div class="column" id="pending-column">
            <div class="column-header">
              <h2>Pendente</h2>
              <span class="task-count" id="pending-count">0</span>
            </div>
            <div class="tasks" id="pending-tasks"></div>
          </div>
          <div class="column" id="in-progress-column">
            <div class="column-header">
              <h2>Em Progresso</h2>
              <span class="task-count" id="in-progress-count">0</span>
            </div>
            <div class="tasks" id="in-progress-tasks"></div>
          </div>
          <div class="column" id="completed-column">
            <div class="column-header">
              <h2>Concluído</h2>
              <span class="task-count" id="completed-count">0</span>
            </div>
            <div class="tasks" id="completed-tasks"></div>
          </div>
        </div>
      </div>

      <div id="modal-container" class="modal hidden">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div id="modal-body"></div>
        </div>
      </div>
    `;
  }

  renderTasks(tasks) {
    const pendingTasks = tasks.filter((task) => task.status === 'pending');
    const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
    const completedTasks = tasks.filter((task) => task.status === 'completed');

    this.renderTaskList('pending-tasks', pendingTasks);
    this.renderTaskList('in-progress-tasks', inProgressTasks);
    this.renderTaskList('completed-tasks', completedTasks);

    // Atualizar contadores
    document.getElementById('pending-count').textContent = pendingTasks.length;
    document.getElementById('in-progress-count').textContent = inProgressTasks.length;
    document.getElementById('completed-count').textContent = completedTasks.length;

    // Re-inicializar drag and drop após renderizar novas tarefas
    if (this._onDropHandler) {
      this.setupDragAndDrop(this._onDropHandler);
    }
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

      const priorityText = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
      }[task.priority || 'medium'];

      taskElement.innerHTML = `
        <div class="task-header">
          <h3>${task.title}</h3>
          <span class="priority-tag priority-${task.priority || 'medium'}">${priorityText}</span>
        </div>
        <p>${task.description || 'Sem descrição'}</p>
        <p class="task-date">📅 ${formattedDate}</p>
        <div class="task-actions">
          <button class="edit-btn" data-id="${task.id}" title="Editar">✏️</button>
          <button class="remind-btn" data-id="${task.id}" title="Lembrar">✉️</button>
          <button class="delete-btn" data-id="${task.id}" title="Excluir">🗑️</button>
        </div>
      `;

      container.appendChild(taskElement);
    });
  }

  getFormData() {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: document.getElementById('task-title').value.trim(),
      description: document.getElementById('task-description').value.trim(),
      dueDate: document.getElementById('task-due-date').value,
      priority: document.getElementById('task-priority').value,
      status: document.getElementById('task-status').value,
    };
  }

  clearForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-due-date').value = '';
    document.getElementById('task-priority').value = 'medium';
    document.getElementById('task-status').value = 'pending';
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
    document.getElementById('filter-all').addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      handler();
    });
  }

  bindSearch(handler) {
    document.getElementById('task-search').addEventListener('input', (e) => {
      handler(e.target.value.toLowerCase());
    });
  }

  bindThemeToggle(handler) {
    document.getElementById('theme-toggle').addEventListener('click', handler);
  }

  bindToggleForm() {
    const btn = document.getElementById('toggle-form-btn');
    const form = document.getElementById('task-form');
    btn.addEventListener('click', () => {
      form.classList.toggle('hidden');
      btn.textContent = form.classList.contains('hidden') ? '+ Nova Tarefa' : 'Fechar Formulário';
    });
    
    document.getElementById('cancel-task').addEventListener('click', () => {
      form.classList.add('hidden');
      btn.textContent = '+ Nova Tarefa';
      this.clearForm();
    });
  }

  applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌓';
  }

  showModal(content) {
    const modal = document.getElementById('modal-container');
    const body = document.getElementById('modal-body');
    body.innerHTML = content;
    modal.classList.remove('hidden');
    
    modal.querySelector('.close-modal').onclick = () => {
      modal.classList.add('hidden');
    };
    
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    };
  }

  closeModal() {
    document.getElementById('modal-container').classList.add('hidden');
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
    this._onDropHandler = onDrop;
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

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
          const newStatus = column.id.replace('-tasks', '');
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
