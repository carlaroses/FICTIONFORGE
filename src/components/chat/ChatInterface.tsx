import React, { useState } from 'react';
import { useProjectStore } from '../../state/projectStore';

export function ChatInterface() {
  const { project, chatHistory, processCommand, commitChanges, rejectChanges } = useProjectStore();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input.trim());
      setInput('');
    }
  };

  const commandChips = [
    { label: 'Add Character', command: 'Add character "Name": description=value' },
    { label: 'Add Location', command: 'Add location "Name": description=value' },
    { label: 'STYLE+', command: 'STYLE+: Add style rules here' },
    { label: 'Commit', command: 'Commit' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Command Interface</h2>
        <p className="text-sm text-gray-600">Type commands or use chips below</p>
      </div>

      {/* Command Chips */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {commandChips.map((chip, index) => (
            <button
              key={index}
              onClick={() => setInput(chip.command)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {chatHistory.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-700">You:</div>
              <div className="text-gray-900">{entry.input}</div>
            </div>
            {entry.command && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-700">Command:</div>
                <div className="text-blue-900">{entry.command.type}</div>
              </div>
            )}
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-700">Response:</div>
              <div className="text-green-900">{entry.response}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={!input.trim() || !project}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Send
            </button>
            {project && project.staged_patches.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={commitChanges}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Commit ({project.staged_patches.length})
                </button>
                <button
                  type="button"
                  onClick={rejectChanges}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
