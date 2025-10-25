import React from 'react';
import { useProjectStore } from '../../state/projectStore.js';

export function StyleViewer() {
  const { project } = useProjectStore();

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-500">
        No project loaded. Create a project to view style information.
      </div>
    );
  }

  const { style_doctrine } = project;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Style Doctrine</h2>
      
      {/* Register */}
      {style_doctrine.register && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Register</h3>
          <p className="text-gray-700">{style_doctrine.register}</p>
        </div>
      )}

      {/* Cadence */}
      {style_doctrine.cadence && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Cadence</h3>
          <div className="space-y-2">
            {style_doctrine.cadence.avg_sentence_length && (
              <p className="text-gray-700">
                Target sentence length: {style_doctrine.cadence.avg_sentence_length} words
              </p>
            )}
            {style_doctrine.cadence.rhythm_pattern && (
              <p className="text-gray-700">
                Rhythm pattern: {style_doctrine.cadence.rhythm_pattern}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Lexicon Preferences */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Lexicon</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-700 mb-2">Preferred Words</h4>
            <div className="space-y-1">
              {style_doctrine.lexicon_prefer.length > 0 ? (
                style_doctrine.lexicon_prefer.map((word, index) => (
                  <span key={index} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-1">
                    {word}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No preferred words set</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-2">Avoided Words</h4>
            <div className="space-y-1">
              {style_doctrine.lexicon_avoid.length > 0 ? (
                style_doctrine.lexicon_avoid.map((word, index) => (
                  <span key={index} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm mr-1">
                    {word}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No avoided words set</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banned Devices */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Banned Devices</h3>
        <div className="space-y-1">
          {style_doctrine.devices_ban.length > 0 ? (
            style_doctrine.devices_ban.map((device, index) => (
              <span key={index} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm mr-1">
                {device}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No banned devices set</p>
          )}
        </div>
      </div>

      {/* POV/Tense */}
      {style_doctrine.pov_tense && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">POV & Tense</h3>
          <div className="space-y-2">
            {style_doctrine.pov_tense.pov && (
              <p className="text-gray-700">
                Point of View: {style_doctrine.pov_tense.pov}
              </p>
            )}
            {style_doctrine.pov_tense.tense && (
              <p className="text-gray-700">
                Tense: {style_doctrine.pov_tense.tense}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Scorecard Preview Placeholder */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Style Scorecard</h3>
        <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
          <p>Style analysis will appear here when chapters are analyzed</p>
          <p className="text-sm mt-2">Try: Generate Chapter 1</p>
        </div>
      </div>
    </div>
  );
}
