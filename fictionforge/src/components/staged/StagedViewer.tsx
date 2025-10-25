import React from 'react';
import { useProjectStore } from '../../state/projectStore.js';

export function StagedViewer() {
  const { project, commitChanges, rejectChanges } = useProjectStore();

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-500">
        No project loaded. Create a project to view staged changes.
      </div>
    );
  }

  const { staged_patches } = project;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Staged Changes</h2>
        {staged_patches.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={commitChanges}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Approve All ({staged_patches.length})
            </button>
            <button
              onClick={rejectChanges}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reject All
            </button>
          </div>
        )}
      </div>

      {staged_patches.length > 0 ? (
        <div className="space-y-4">
          {staged_patches.map((patch) => (
            <div key={patch.id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    patch.operation === 'create' ? 'bg-green-100 text-green-800' :
                    patch.operation === 'update' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {patch.operation}
                  </span>
                  <span className="text-sm font-medium">{patch.section}</span>
                </div>
                <span className="text-xs text-gray-500">{patch.timestamp}</span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600 mb-2">Path: {patch.path}</p>
                <div className="text-sm">
                  <pre className="whitespace-pre-wrap text-gray-800">
                    {typeof patch.data === 'object' 
                      ? JSON.stringify(patch.data, null, 2)
                      : String(patch.data)
                    }
                  </pre>
                </div>
              </div>
              
              {/* TODO: Field-level Diff Panel */}
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  TODO: Field-level diff panel for granular approval
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border text-center">
          <p className="text-gray-500 mb-4">No staged changes</p>
          <p className="text-sm text-gray-400">
            Make changes using commands to see them staged here
          </p>
        </div>
      )}
    </div>
  );
}
