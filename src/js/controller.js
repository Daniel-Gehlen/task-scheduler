export default class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bindings
    this.view.bindAddTask(this.handleAddTask.bind(this));
    this.view.bindMockData(this.handleMockData.bind(this));
    this.view.bindFilterWeek(this.handleFilterWeek.bind(this));
    this.view.bindFilterAll(this.handleFilterAll.bind(this));
    this.view.bindDeleteTask(this.handleDeleteTask.bind(this));
    this.view.bindEditTask(this.handleEditTask.bind(this));
    this.view.bindRemindTask(this.handleRemindTask.bind(this));
    this.view.bindSearch(this.handleSearch.bind(this));
    this.view.bindThemeToggle(this.handleThemeToggle.bind(this));
    this.view.bindToggleForm();

    // Inicialização
    this.theme = localStorage.getItem('theme') || 'light';
    this.view.applyTheme(this.theme);
    this.view.renderTasks(this.model.tasks);
    this.view.setupDragAndDrop(this.handleDrop.bind(this));
  }

  handleAddTask() {
    const taskData = this.view.getFormData();
    if (!taskData.title || taskData.title.length === 0) {
      alert('O título da tarefa não pode estar vazio!');
      return;
    }
    if (!taskData.dueDate) {
      alert('A data de entrega é obrigatória!');
      return;
    }
    this.model.addTask(taskData);
    this.view.renderTasks(this.model.tasks);
    this.view.clearForm();
  }

  handleMockData() {
    const mockTasks = [
      {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        title: "Reunião com cliente",
        description: "Discutir requisitos do projeto",
        dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        status: "pending",
      },
      {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        title: "Entregar relatório",
        description: "Relatório trimestral de vendas",
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 16),
        status: "in-progress",
      },
    ];

    mockTasks.forEach((task) => this.model.addTask(task));
    this.view.renderTasks(this.model.tasks);
  }

  handleEditTask(id) {
    const task = this.model.tasks.find((t) => t.id === id);
    if (task) {
      const content = `
        <h2>Editar Tarefa</h2>
        <div class="form-group">
          <label>Título:</label>
          <input type="text" id="edit-title" value="${task.title}">
        </div>
        <div class="form-group">
          <label>Descrição:</label>
          <textarea id="edit-description" rows="3">${task.description || ''}</textarea>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Prioridade:</label>
            <select id="edit-priority">
              <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Baixa</option>
              <option value="medium" ${task.priority === 'medium' || !task.priority ? 'selected' : ''}>Média</option>
              <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Alta</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status:</label>
            <select id="edit-status">
              <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pendente</option>
              <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>Em Progresso</option>
              <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Concluído</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button id="update-task-btn" class="add-btn">Atualizar</button>
        </div>
      `;
      this.view.showModal(content);
      
      document.getElementById('update-task-btn').onclick = () => {
        const title = document.getElementById('edit-title').value.trim();
        const description = document.getElementById('edit-description').value.trim();
        const priority = document.getElementById('edit-priority').value;
        const status = document.getElementById('edit-status').value;
        
        if (title) {
          this.model.updateTask(id, { title, description, priority, status });
          this.view.renderTasks(this.model.tasks);
          this.view.closeModal();
        } else {
          alert('O título não pode estar vazio!');
        }
      };
    }
  }

  handleSearch(query) {
    const filteredTasks = this.model.tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    );
    this.view.renderTasks(filteredTasks);
  }

  handleThemeToggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.view.applyTheme(this.theme);
  }

  handleDeleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.model.deleteTask(id);
      this.view.renderTasks(this.model.tasks);
    }
  }

  handleRemindTask(id) {
    const task = this.model.tasks.find((t) => t.id === id);
    if (task) {
      const dueDate = new Date(task.dueDate);
      const formattedDate =
        dueDate.toLocaleDateString() +
        " " +
        dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const subject = encodeURIComponent(`Lembrete: ${task.title}`);
      const body = encodeURIComponent(
        `Descrição: ${task.description || "Sem descrição"}\n` +
          `Data: ${formattedDate}\n` +
          `Status: ${this.getStatusText(task.status)}`
      );

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  }

  handleDrop(id, newStatus) {
    this.model.updateTask(id, { status: newStatus });
    this.view.renderTasks(this.model.tasks);
  }

  handleFilterWeek() {
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const filteredTasks = this.model.tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= now && taskDate <= oneWeekLater;
    });
    this.view.renderTasks(filteredTasks);
  }

  handleFilterAll() {
    this.view.renderTasks(this.model.tasks);
  }

  getStatusText(status) {
    const statusMap = {
      pending: "Pendente",
      "in-progress": "Em Progresso",
      completed: "Concluído",
    };
    return statusMap[status] || status;
  }
}
