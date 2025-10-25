# FictionForge Preview Guide

## 🚀 **Access the Application**
- **URL**: http://localhost:5173/
- **Status**: Development server running

## 🎯 **Quick Start Guide**

### 1. **Create Your First Project**
1. Open http://localhost:5173/ in your browser
2. In the top-left, you'll see "Untitled Project" - click to edit
3. Type your novel title (e.g., "The Great Adventure")
4. Click "Create Project" button

### 2. **Try These Commands** (in the chat interface)

#### **Basic Setup**
```
Create project "My Fantasy Novel"
```

#### **Add Characters**
```
Add character "Aria": description=brave warrior, traits=determined,loyal, arc=hero's journey
Add character "Marcus": description=wise mentor, traits=ancient,knowledgeable, arc=guide
```

#### **Add Locations**
```
Add location "Crystal Forest": description=mystical woodland, type=exterior, atmosphere=magical
Add location "Ancient Library": description=hidden knowledge vault, type=interior, atmosphere=scholarly
```

#### **Style Rules**
```
STYLE+: Use active voice, avoid passive constructions
DEVICE-: rhetorical questions
LEXICON-: very
```

#### **Generate Content**
```
Generate Chapter 1
Generate Chapter 2
```

#### **Workflow**
```
Commit
```

### 3. **Navigate the Interface**

#### **Left Panel - Chat Interface**
- **Command Input**: Type natural language commands
- **Command Chips**: Quick buttons for common commands
- **Chat History**: See your commands and responses
- **Commit/Reject**: Control staged changes

#### **Right Panel - Tabs**

**Style Tab**:
- View your style doctrine
- See preferred/avoided words
- Check banned devices
- Preview style scorecard

**Canon Tab**:
- **Characters**: Expandable list with traits and descriptions
- **Locations**: Expandable list with types and atmosphere
- **Timeline**: Events with characters and locations
- **Outline**: Story structure templates

**Chapters Tab**:
- List of generated chapters
- Word counts and status
- Content previews
- Scene organization

**Staged Tab**:
- Pending changes before commit
- Approve All or Reject All
- Individual patch details

## 🎨 **UI Features**

### **Modern Design**
- Clean, Scrivener-inspired interface
- Tailwind CSS styling
- Responsive layout
- Tabbed navigation

### **Real-time Updates**
- Instant command processing
- Live state updates
- Hot reload for development

### **Export/Import**
- Export your project as `.fictionforge` file
- Import existing projects
- Local-first data storage

## 🧪 **Testing the Features**

### **Style Analysis**
1. Generate a chapter
2. Check Style tab for analysis
3. See rule violations and metrics

### **Continuity Checking**
1. Add duplicate character names
2. Check for continuity issues
3. See warnings in the interface

### **Staging Workflow**
1. Make multiple changes
2. Review in Staged tab
3. Commit or reject as needed

## 🔧 **Technical Features**

- **Local-first**: All data stored in browser IndexedDB
- **Type-safe**: Full TypeScript implementation
- **Tested**: 10 passing tests
- **Modular**: Clean architecture with separation of concerns
- **Extensible**: Easy to add new command types and features

## 📱 **Browser Compatibility**
- Modern browsers with IndexedDB support
- Chrome, Firefox, Safari, Edge
- Mobile-responsive design

---

**Ready to start writing your novel with FictionForge!** 🎉
