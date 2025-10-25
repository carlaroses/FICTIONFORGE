import React from 'react';
import { useProjectStore } from '../../state/projectStore.js';

export function ChaptersViewer() {
  const { project } = useProjectStore();

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-500">
        No project loaded. Create a project to view chapters.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Chapters</h2>
      
      {project.chapters.length > 0 ? (
        <div className="space-y-4">
          {project.chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  Chapter {chapter.number}
                  {chapter.title && `: ${chapter.title}`}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    chapter.status === 'final' ? 'bg-green-100 text-green-800' :
                    chapter.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {chapter.status}
                  </span>
                  <span className="text-sm text-gray-500">{chapter.word_count} words</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600 mb-2">Content preview:</p>
                <p className="text-gray-800">
                  {chapter.content.length > 200 
                    ? `${chapter.content.substring(0, 200)}...` 
                    : chapter.content || 'No content yet'
                  }
                </p>
              </div>
              
              {chapter.scenes.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Scenes ({chapter.scenes.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {chapter.scenes.map((sceneId, index) => (
                      <span key={sceneId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Scene {index + 1}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border text-center">
          <p className="text-gray-500 mb-4">No chapters created yet</p>
          <p className="text-sm text-gray-400">
            Try: Generate Chapter 1
          </p>
        </div>
      )}
    </div>
  );
}
