import React, { useState } from 'react';
import { useProjectStore } from '../../state/projectStore';

export function CanonViewer() {
  const { project } = useProjectStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['characters', 'locations']));

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-500">
        No project loaded. Create a project to view canon information.
      </div>
    );
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Project Canon</h2>
      
      {/* Characters */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => toggleSection('characters')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Characters ({project.characters.length})</h3>
          <span className="text-gray-500">
            {expandedSections.has('characters') ? '▼' : '▶'}
          </span>
        </button>
        {expandedSections.has('characters') && (
          <div className="p-4 border-t border-gray-200">
            {project.characters.length > 0 ? (
              <div className="space-y-3">
                {project.characters.map((character) => (
                  <div key={character.id} className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium">{character.name}</h4>
                    {character.description && (
                      <p className="text-sm text-gray-600 mt-1">{character.description}</p>
                    )}
                    {character.traits.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Traits: </span>
                        {character.traits.map((trait, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No characters added yet</p>
            )}
          </div>
        )}
      </div>

      {/* Locations */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => toggleSection('locations')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Locations ({project.locations.length})</h3>
          <span className="text-gray-500">
            {expandedSections.has('locations') ? '▼' : '▶'}
          </span>
        </button>
        {expandedSections.has('locations') && (
          <div className="p-4 border-t border-gray-200">
            {project.locations.length > 0 ? (
              <div className="space-y-3">
                {project.locations.map((location) => (
                  <div key={location.id} className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium">{location.name}</h4>
                    {location.description && (
                      <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                    )}
                    {location.type && (
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-1">
                        {location.type}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No locations added yet</p>
            )}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => toggleSection('timeline')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Timeline ({project.timeline.length})</h3>
          <span className="text-gray-500">
            {expandedSections.has('timeline') ? '▼' : '▶'}
          </span>
        </button>
        {expandedSections.has('timeline') && (
          <div className="p-4 border-t border-gray-200">
            {project.timeline.length > 0 ? (
              <div className="space-y-3">
                {project.timeline.map((event) => (
                  <div key={event.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{event.event}</h4>
                      <span className="text-xs text-gray-500">{event.timestamp}</span>
                    </div>
                    {event.characters.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        Characters: {event.characters.join(', ')}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-gray-600">Location: {event.location}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No timeline events added yet</p>
            )}
          </div>
        )}
      </div>

      {/* Outline */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => toggleSection('outline')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Outline</h3>
          <span className="text-gray-500">
            {expandedSections.has('outline') ? '▼' : '▶'}
          </span>
        </button>
        {expandedSections.has('outline') && (
          <div className="p-4 border-t border-gray-200">
            {project.outline_template ? (
              <div className="space-y-3">
                <h4 className="font-medium">{project.outline_template.name}</h4>
                <div className="space-y-2">
                  {project.outline_template.beats.map((beat) => (
                    <div key={beat.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{beat.name}</h5>
                        <span className="text-xs text-gray-500">#{beat.order}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{beat.description}</p>
                      {beat.chapter_hint && (
                        <p className="text-xs text-blue-600 mt-1">Chapter hint: {beat.chapter_hint}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No outline template selected</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
