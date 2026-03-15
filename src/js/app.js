import TaskModel from './model.js';
import TaskView from './view.js';
import TaskController from './controller.js';
import Logger from './utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const model = new TaskModel();
    const view = new TaskView();
    new TaskController(model, view);
    Logger.info('Aplicação inicializada com sucesso');
  } catch (error) {
    Logger.error('Erro crítico na inicialização da aplicação', { error: error.message });
    alert('Ocorreu um erro ao carregar a aplicação. Verifique o console para mais detalhes.');
  }
});

window.addEventListener('error', (event) => {
  Logger.error('Erro não capturado detectado', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  Logger.error('Rejeição de promessa não capturada', { reason: event.reason });
});
