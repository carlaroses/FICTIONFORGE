import React, { useState } from 'react';
import { useProjectStore } from '../state/projectStore';
import { ChatInterface } from '../components/chat/ChatInterface';
import { StyleViewer } from '../components/viewers/StyleViewer';
import { CanonViewer } from '../components/viewers/CanonViewer';
import { ChaptersViewer } from '../components/viewers/ChaptersViewer';
import { StagedViewer } from '../components/staged/StagedViewer';

function App() {
  const { project, createProject, exportProject, importProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'style' | 'canon' | 'chapters' | 'staged'>('style');
  const [title, setTitle] = useState(project?.title || '');

  const handleExport = () => {
    const data = exportProject();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.title || 'fictionforge'}.fictionforge`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        importProject(data);
        setTitle(project?.title || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none outline-none"
              placeholder="Untitled Project"
            />
            {!project && (
              <button
                onClick={() => createProject(title || 'Untitled Project')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Project
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".fictionforge"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
            >
              Import
            </label>
            <button
              onClick={handleExport}
              disabled={!project}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Pane - Chat */}
        <div className="w-1/3 border-r border-gray-200 bg-white">
          <ChatInterface />
        </div>

        {/* Right Pane - Tabs */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'style', label: 'Style' },
                { id: 'canon', label: 'Canon' },
                { id: 'chapters', label: 'Chapters' },
                { id: 'staged', label: 'Staged' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'style' && <StyleViewer />}
            {activeTab === 'canon' && <CanonViewer />}
            {activeTab === 'chapters' && <ChaptersViewer />}
            {activeTab === 'staged' && <StagedViewer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
