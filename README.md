# 🚀 To-do App - Task Manager

Một ứng dụng quản lý công việc (To-do App) với giao diện đẹp mắt, hiệu ứng mượt mà và đầy đủ tính năng.

## ✨ Tính năng

### 🎯 Quản lý Task
- ➕ **Thêm task mới** - Thêm công việc cần làm nhanh chóng
- ✏️ **Chỉnh sửa task** - Sửa nội dung task bất kỳ lúc nào
- ✅ **Đánh dấu hoàn thành** - Click checkbox để đánh dấu task đã xong
- 🗑️ **Xóa task** - Xóa task không cần thiết với animation mượt mà
- 🔄 **Drag & Drop** - Kéo thả để sắp xếp lại thứ tự task

### 🎨 Giao diện & Trải nghiệm
- 🌓 **Dark/Light Mode** - Chuyển đổi theme sáng/tối
- 📊 **Thống kê real-time** - Hiển thị số task tổng/đang làm/hoàn thành
- 🎭 **Animations mượt mà** - Hiệu ứng chuyển động đẹp mắt
- 📱 **Responsive** - Hoạt động hoàn hảo trên mọi thiết bị
- 🎨 **Gradient đẹp mắt** - Sử dụng gradient hiện đại

### 🔧 Chức năng nâng cao
- 🔍 **Lọc task** - Hiển thị All/Active/Completed
- 🧹 **Xóa hàng loạt** - Xóa tất cả task đã hoàn thành
- 💾 **Local Storage** - Lưu dữ liệu tự động, không mất khi reload
- ⌨️ **Keyboard shortcuts** - ESC để đóng modal
- 🎯 **Empty state** - Giao diện đẹp khi chưa có task

## 🛠️ Công nghệ sử dụng

- **HTML5** - Cấu trúc semantic
- **CSS3** - Variables, Flexbox, Grid, Animations
- **JavaScript ES6+** - Class, Arrow functions, Destructuring
- **Local Storage API** - Lưu trữ dữ liệu local

## 📦 Cấu trúc dự án

```
To-do-App/
├── index.html              # File HTML chính
├── README.md              # File này
├── WARP.md               # Hướng dẫn cho Warp AI
└── assets/
    ├── css/
    │   └── style.css      # Toàn bộ styles
    └── js/
        └── main.js        # Logic ứng dụng
```

## 🚀 Cách chạy

### Cách 1: Mở trực tiếp
Mở file `index.html` bằng trình duyệt (double-click hoặc right-click > Open with > Browser)

### Cách 2: Sử dụng Live Server (Khuyến nghị)
```bash
# Với Python 3
py -3 -m http.server 5500

# Với Node.js (npx)
npx http-server -p 5500 .

# Với VS Code Extension
# Cài đặt "Live Server" extension, sau đó right-click index.html > "Open with Live Server"
```

Sau đó mở trình duyệt tại: `http://localhost:5500`

## 🎮 Hướng dẫn sử dụng

### Thêm Task
1. Nhập nội dung task vào ô input "What needs to be done?"
2. Nhấn nút "Add Task" hoặc Enter
3. Task mới sẽ xuất hiện ở đầu danh sách với animation

### Quản lý Task
- **Đánh dấu hoàn thành**: Click vào checkbox tròn bên trái task
- **Chỉnh sửa**: Hover vào task, click icon bút chì ✏️
- **Xóa**: Hover vào task, click icon thùng rác 🗑️
- **Sắp xếp**: Kéo và thả task để thay đổi thứ tự

### Lọc Task
- **All**: Hiển thị tất cả task
- **Active**: Chỉ hiển thị task chưa hoàn thành
- **Completed**: Chỉ hiển thị task đã hoàn thành

### Xóa hàng loạt
Khi có task đã hoàn thành, nút "Clear Completed" sẽ hiện ra ở cuối trang

### Đổi Theme
Click vào nút tròn ở góc trên bên phải (☀️/🌙) để chuyển đổi Dark/Light mode

## 🎨 Thiết kế

### Color Palette (Light Mode)
- Background: `#f8fafc` (slate-50)
- Surface: `#ffffff` (white)
- Text: `#0f172a` (slate-900)
- Accent: Gradient `#667eea` → `#764ba2`

### Color Palette (Dark Mode)
- Background: `#0f172a` (slate-900)
- Surface: `#1e293b` (slate-800)
- Text: `#f1f5f9` (slate-100)
- Accent: Gradient `#667eea` → `#764ba2`

### Typography
- Font Family: System UI Stack (-apple-system, Segoe UI, Roboto...)
- Base Size: 16px
- Line Height: 1.6

### Animations
- Fade In/Out: 0.3s ease
- Slide In: 0.4s cubic-bezier
- Hover Transform: 0.3s cubic-bezier
- Number Counter: 300ms

## 💡 Chi tiết kỹ thuật

### Class Structure (TodoApp)
```javascript
class TodoApp {
  // State
  tasks: Array          // Danh sách task
  currentFilter: String // Filter hiện tại (all/active/completed)
  editingTaskId: String // ID task đang edit
  
  // Methods
  - handleAddTask()     // Thêm task mới
  - toggleTask()        // Toggle trạng thái complete
  - deleteTask()        // Xóa task
  - openEditModal()     // Mở modal edit
  - handleEditTask()    // Xử lý edit task
  - clearCompleted()    // Xóa tất cả completed
  - initDragAndDrop()   // Khởi tạo drag & drop
  - render()           // Render UI
  - saveTasks()        // Lưu vào localStorage
  - loadTasks()        // Load từ localStorage
}
```

### Local Storage Schema
```javascript
{
  "todoTasks": [
    {
      "id": "1234567890",
      "text": "Task content",
      "completed": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "theme": "light" // or "dark"
}
```

## 🎯 Điểm nổi bật về code

### 1. Clean Architecture
- Tách biệt rõ ràng giữa logic và UI
- Sử dụng ES6 Class để organize code
- Methods được group theo chức năng

### 2. Performance
- Event delegation cho dynamic elements
- Debounce cho animations
- Efficient DOM manipulation

### 3. UX Details
- Loading states
- Error handling
- Keyboard shortcuts
- Smooth animations
- Visual feedback

### 4. Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management

## 🔥 Demo các tính năng

### Stats Counter Animation
```javascript
animateValue(element, start, end) {
  // Animate số từ start đến end trong 300ms
  // Tạo hiệu ứng mượt mà khi thay đổi
}
```

### Drag & Drop
```javascript
initDragAndDrop() {
  // Cho phép kéo thả task
  // Cập nhật thứ tự và lưu vào localStorage
}
```

### Theme Toggle with Animation
```javascript
toggleTheme() {
  // Chuyển đổi theme
  // Rotate 360° cho nút toggle
  // Lưu preference vào localStorage
}
```

## 📝 Notes cho Developer

### Customize Colors
Thay đổi colors trong `:root` và `[data-theme="dark"]` ở `style.css`

### Add New Features
Tất cả logic nằm trong class `TodoApp`, dễ dàng extend

### Debug
App instance được expose qua `window.todoApp` - có thể inspect trong DevTools Console

### Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- IE11: ❌ Not supported (ES6 class)

## 🎓 Kỹ năng JavaScript được thể hiện

- ✅ ES6+ Class & Methods
- ✅ Arrow Functions
- ✅ Template Literals
- ✅ Array Methods (map, filter, find, reduce)
- ✅ Destructuring
- ✅ Local Storage API
- ✅ Drag & Drop API
- ✅ DOM Manipulation
- ✅ Event Handling & Delegation
- ✅ Animations & Transitions
- ✅ State Management
- ✅ Data Persistence

## 🚀 Deployment cho Portfolio

Dự án này hoàn toàn STATIC (HTML/CSS/JS), deploy cực kỳ dễ dàng và MIỄN PHÍ:

### **Khuyến nghị: Netlify hoặc Vercel**

**Netlify (Drag & Drop - 30 giây):**
1. Vào [netlify.com](https://netlify.com)
2. Drag folder `To-do-App` vào
3. Done! 🎉

**Vercel (CLI - 1 phút):**
```bash
npm i -g vercel
vercel
vercel --prod
```

**GitHub Pages (Free hosting):**
```bash
git init
git add .
git commit -m "To-do App v2.0"
git branch -M main
git remote add origin https://github.com/USERNAME/todo-app.git
git push -u origin main
# Enable Pages trong Settings > Pages
```

📖 **Chi tiết đầy đủ:** Xem [DEPLOYMENT.md](DEPLOYMENT.md)

## 🌟 Future Improvements

- [x] ~~Add priority levels~~ ✅ (Done in v2.0!)
- [x] ~~Add search functionality~~ ✅ (Done in v2.0!)
- [ ] Add categories/tags for tasks
- [ ] Add due dates & reminders
- [ ] Add export/import JSON
- [ ] Add keyboard shortcuts list
- [ ] Add task notes/description
- [ ] Add undo/redo functionality
- [ ] PWA support (offline mode)
- [ ] Sync with cloud storage

## 📄 License

MIT License - Free to use for learning and personal projects

## 👤 Author

Created with ❤️ as a portfolio project demonstrating HTML, CSS & JavaScript skills

---

**⭐ Nếu bạn thấy project này hữu ích, hãy star repo này!**
