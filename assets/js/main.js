// ===== STATE MANAGEMENT =====
class TodoApp {
  constructor() {
    this.tasks = this.loadTasks();
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.editingTaskId = null;
    this.draggedElement = null;
    
    this.init();
  }

  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.initTheme();
    this.render();
  }

  cacheElements() {
    // Form elements
    this.addTaskForm = document.getElementById('add-task-form');
    this.taskInput = document.getElementById('task-input');
    this.prioritySelect = document.getElementById('priority-select');
    
    // Search elements
    this.searchInput = document.getElementById('search-input');
    this.clearSearchBtn = document.getElementById('clear-search');
    
    // List elements
    this.taskList = document.getElementById('task-list');
    this.emptyState = document.getElementById('empty-state');
    
    // Filter elements
    this.filterBtns = document.querySelectorAll('.filter-btn');
    
    // Stat elements
    this.totalTasksEl = document.getElementById('total-tasks');
    this.activeTasksEl = document.getElementById('active-tasks');
    this.completedTasksEl = document.getElementById('completed-tasks');
    
    // Progress elements
    this.progressBar = document.getElementById('progress-bar');
    this.progressText = document.getElementById('progress-text');
    
    // Action elements
    this.clearCompletedBtn = document.getElementById('clear-completed');
    this.actionsSection = document.getElementById('actions-section');
    
    // Modal elements
    this.modal = document.getElementById('edit-modal');
    this.editTaskForm = document.getElementById('edit-task-form');
    this.editTaskInput = document.getElementById('edit-task-input');
    this.editPrioritySelect = document.getElementById('edit-priority-select');
    this.modalClose = this.modal.querySelector('.modal-close');
    this.btnCancel = this.modal.querySelector('.btn-cancel');
    
    // Toast container
    this.toastContainer = document.getElementById('toast-container');
    
    // Theme toggle
    this.themeToggle = document.querySelector('.theme-toggle');
  }

  attachEventListeners() {
    // Add task
    this.addTaskForm.addEventListener('submit', (e) => this.handleAddTask(e));
    
    // Search
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
    
    // Filters
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilterChange(btn));
    });
    
    // Clear completed
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    
    // Modal
    this.editTaskForm.addEventListener('submit', (e) => this.handleEditTask(e));
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.btnCancel.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
    
    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  // ===== TASK OPERATIONS =====
  handleAddTask(e) {
    e.preventDefault();
    
    const text = this.taskInput.value.trim();
    if (!text) return;
    
    const task = {
      id: Date.now().toString(),
      text: text,
      priority: this.prioritySelect.value,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.unshift(task);
    this.saveTasks();
    this.taskInput.value = '';
    this.prioritySelect.value = 'medium';
    this.render();
    
    // Show success toast
    this.showToast('success', 'Task added!', `"${this.truncateText(text, 30)}" has been added to your list.`);
    
    // Animation feedback
    this.taskInput.focus();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
      
      if (task.completed) {
        this.showToast('success', 'Well done!', `Task completed: "${this.truncateText(task.text, 30)}"`);
      }
    }
  }

  deleteTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    
    // Add fade out animation
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
      taskElement.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
        this.showToast('info', 'Task deleted', `"${this.truncateText(task.text, 30)}" has been removed.`);
      }, 300);
    }
  }

  openEditModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      this.editingTaskId = id;
      this.editTaskInput.value = task.text;
      this.editPrioritySelect.value = task.priority || 'medium';
      this.modal.classList.add('active');
      this.editTaskInput.focus();
      this.editTaskInput.select();
    }
  }

  handleEditTask(e) {
    e.preventDefault();
    
    const text = this.editTaskInput.value.trim();
    if (!text || !this.editingTaskId) return;
    
    const task = this.tasks.find(t => t.id === this.editingTaskId);
    if (task) {
      task.text = text;
      task.priority = this.editPrioritySelect.value;
      this.saveTasks();
      this.render();
      this.closeModal();
      this.showToast('success', 'Task updated!', 'Your changes have been saved.');
    }
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.editingTaskId = null;
    this.editTaskInput.value = '';
  }

  clearCompleted() {
    const completedCount = this.tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) return;
    
    // Use custom toast instead of confirm
    this.showToast(
      'info', 
      'Clear completed tasks?', 
      `${completedCount} task${completedCount > 1 ? 's' : ''} will be deleted.`,
      () => {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
        this.render();
        this.showToast('success', 'Cleared!', `${completedCount} task${completedCount > 1 ? 's' : ''} removed.`);
      }
    );
  }

  // ===== SEARCH OPERATIONS =====
  handleSearch(e) {
    this.searchQuery = e.target.value.trim().toLowerCase();
    this.clearSearchBtn.style.display = this.searchQuery ? 'flex' : 'none';
    this.render();
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchInput.value = '';
    this.clearSearchBtn.style.display = 'none';
    this.render();
  }

  // ===== FILTER OPERATIONS =====
  handleFilterChange(btn) {
    this.currentFilter = btn.dataset.filter;
    
    // Update active button
    this.filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    this.render();
  }

  getFilteredTasks() {
    let filtered = [...this.tasks];
    
    // Apply status filter
    switch (this.currentFilter) {
      case 'active':
        filtered = filtered.filter(t => !t.completed);
        break;
      case 'completed':
        filtered = filtered.filter(t => t.completed);
        break;
    }
    
    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(t => 
        t.text.toLowerCase().includes(this.searchQuery)
      );
    }
    
    return filtered;
  }

  // ===== DRAG & DROP =====
  initDragAndDrop() {
    const taskItems = this.taskList.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
      item.draggable = true;
      
      item.addEventListener('dragstart', (e) => {
        this.draggedElement = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        this.draggedElement = null;
      });
      
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = this.getDragAfterElement(e.clientY);
        if (afterElement == null) {
          this.taskList.appendChild(this.draggedElement);
        } else {
          this.taskList.insertBefore(this.draggedElement, afterElement);
        }
      });
      
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        this.updateTaskOrder();
      });
    });
  }

  getDragAfterElement(y) {
    const draggableElements = [...this.taskList.querySelectorAll('.task-item:not(.dragging)')];
    
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

  updateTaskOrder() {
    const taskElements = [...this.taskList.querySelectorAll('.task-item')];
    const newOrder = taskElements.map(el => el.dataset.id);
    
    this.tasks.sort((a, b) => {
      return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
    });
    
    this.saveTasks();
  }

  // ===== RENDERING =====
  render() {
    this.updateStats();
    this.updateProgress();
    this.renderTasks();
    this.updateActionsVisibility();
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;
    
    this.animateValue(this.totalTasksEl, parseInt(this.totalTasksEl.textContent), total);
    this.animateValue(this.activeTasksEl, parseInt(this.activeTasksEl.textContent), active);
    this.animateValue(this.completedTasksEl, parseInt(this.completedTasksEl.textContent), completed);
  }

  updateProgress() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    this.progressBar.style.width = `${percentage}%`;
    this.progressText.textContent = `${percentage}% completed`;
  }

  animateValue(element, start, end) {
    if (start === end) return;
    
    const duration = 300;
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = end;
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current);
      }
    }, 16);
  }

  renderTasks() {
    const filteredTasks = this.getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      this.taskList.style.display = 'none';
      this.emptyState.style.display = 'block';
    } else {
      this.taskList.style.display = 'flex';
      this.emptyState.style.display = 'none';
      
      this.taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
      
      // Attach events to task items
      this.attachTaskEvents();
      
      // Initialize drag and drop
      this.initDragAndDrop();
    }
  }

  createTaskHTML(task) {
    const priorityIcon = {
      low: '🟢',
      medium: '🟡',
      high: '🔴'
    };
    
    const timeAgo = this.getTimeAgo(task.createdAt);
    
    return `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''}
          data-id="${task.id}"
        />
        <div class="task-content">
          <span class="task-text">${this.escapeHtml(task.text)}</span>
          <span class="priority-badge ${task.priority}">${priorityIcon[task.priority]} ${task.priority}</span>
          <span class="task-timestamp">${timeAgo}</span>
        </div>
        <div class="task-actions">
          <button class="btn-action btn-edit" data-id="${task.id}" aria-label="Edit task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn-action btn-delete" data-id="${task.id}" aria-label="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </li>
    `;
  }

  attachTaskEvents() {
    // Checkboxes
    this.taskList.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.toggleTask(e.target.dataset.id);
      });
    });
    
    // Edit buttons
    this.taskList.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditModal(btn.dataset.id);
      });
    });
    
    // Delete buttons
    this.taskList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteTask(btn.dataset.id);
      });
    });
  }

  updateActionsVisibility() {
    const hasCompleted = this.tasks.some(t => t.completed);
    this.actionsSection.style.display = hasCompleted ? 'block' : 'none';
  }

  // ===== TOAST NOTIFICATIONS =====
  showToast(type, title, message, onConfirm = null) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '<path d="M20 6L9 17l-5-5"/>',
      error: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          ${icons[type]}
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      ${onConfirm ? `<button class="toast-confirm" style="padding: 0.5rem 1rem; background: var(--accent-primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">Yes</button>` : ''}
      <button class="toast-close" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.removeToast(toast));
    
    // Confirm button
    if (onConfirm) {
      const confirmBtn = toast.querySelector('.toast-confirm');
      confirmBtn.addEventListener('click', () => {
        onConfirm();
        this.removeToast(toast);
      });
    }
    
    // Auto remove after 4 seconds (unless it has confirm button)
    if (!onConfirm) {
      setTimeout(() => this.removeToast(toast), 4000);
    }
  }

  removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }

  // ===== UTILITY FUNCTIONS =====
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return then.toLocaleDateString();
  }

  // ===== LOCAL STORAGE =====
  loadTasks() {
    try {
      const tasks = localStorage.getItem('todoTasks');
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  // ===== THEME MANAGEMENT =====
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    this.showToast('info', 'Theme changed', `Switched to ${newTheme} mode`);
    
    // Add rotation animation
    this.themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      this.themeToggle.style.transform = '';
    }, 300);
  }
}

// ===== ADD SLIDE OUT ANIMATION =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
  const app = new TodoApp();
  
  // Make app globally accessible for debugging
  window.todoApp = app;
  
  console.log('🚀 To-do App v2.0 loaded successfully!');
  console.log('✨ New features: Priority levels, Search, Toast notifications, Progress bar');
});
