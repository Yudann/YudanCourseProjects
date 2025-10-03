class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.showNotification('Aplikasi Todo List siap digunakan!', 'success');
    }

    bindEvents() {
        // Tombol tambah
        document.getElementById('add-todo-btn').addEventListener('click', () => this.addTodo());
        
        // Input enter
        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Aksi
        document.getElementById('clear-completed').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAll());

        // Character count
        document.getElementById('todo-input').addEventListener('input', (e) => {
            this.updateCharCount(e.target.value.length);
        });
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const taskText = input.value.trim();

        if (taskText === '') {
            this.showNotification('Tugas tidak boleh kosong!', 'error');
            return;
        }

        if (taskText.length > 100) {
            this.showNotification('Tugas maksimal 100 karakter!', 'error');
            return;
        }

        const todo = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveToLocalStorage();
        this.render();
        input.value = '';
        this.updateCharCount(0);
        this.showNotification('Tugas berhasil ditambahkan!', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.classList.add('removing');
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveToLocalStorage();
                this.render();
                this.showNotification('Tugas dihapus!', 'info');
            }, 300);
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.render();
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('Tidak ada tugas yang selesai!', 'info');
            return;
        }

        if (confirm(`Hapus ${completedCount} tugas yang selesai?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToLocalStorage();
            this.render();
            this.showNotification(`${completedCount} tugas selesai dihapus!`, 'success');
        }
    }

    clearAll() {
        if (this.todos.length === 0) {
            this.showNotification('Tidak ada tugas untuk dihapus!', 'info');
            return;
        }

        if (confirm('Hapus semua tugas?')) {
            this.todos = [];
            this.saveToLocalStorage();
            this.render();
            this.showNotification('Semua tugas dihapus!', 'success');
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todo-list');
        const emptyState = document.getElementById('empty-state');
        const filteredTodos = this.getFilteredTodos();

        // Toggle empty state
        emptyState.style.display = filteredTodos.length === 0 ? 'block' : 'none';

        // Render todos
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox" onclick="app.toggleTodo(${todo.id})"></div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="delete-btn" onclick="app.deleteTodo(${todo.id})" title="Hapus tugas">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');

        // Update stats
        this.updateStats();
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('total-tasks').textContent = total;
        document.getElementById('completed-tasks').textContent = completed;
        document.getElementById('pending-tasks').textContent = pending;
    }

    updateCharCount(count) {
        document.getElementById('char-count').textContent = `${count}/100`;
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the app
const app = new TodoApp();