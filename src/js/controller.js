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

    // Inicialização
    this.view.renderTasks(this.model.tasks);
    this.view.setupDragAndDrop(this.handleDrop.bind(this));
  }

  handleAddTask() {
    const taskData = this.view.getFormData();
    if (!taskData.title || !taskData.dueDate) {
      alert("Título e data são obrigatórios!");
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

  handleDeleteTask(id) {
    this.model.deleteTask(id);
    this.view.renderTasks(this.model.tasks);
  }

  handleEditTask(id) {
    const task = this.model.tasks.find((t) => t.id === id);
    if (task) {
      document.getElementById("task-title").value = task.title;
      document.getElementById("task-description").value =
        task.description || "";
      document.getElementById("task-due-date").value = task.dueDate;
      document.getElementById("task-status").value = task.status;
      this.model.deleteTask(id);
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
    this.model.updateTask(id, { status: newStatus.replace(" ", "-") });
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
