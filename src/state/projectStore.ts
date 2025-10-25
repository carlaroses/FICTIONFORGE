import { create } from 'zustand';
import { Project, Character, Location, Chapter, Patch } from '../schemas/project';
import { Command, Delta } from '../protocol';
import { ProjectReducer } from '../reducers';
import { CommandParser } from '../protocol';

interface ProjectStore {
  project: Project | null;
  chatHistory: Array<{
    id: string;
    timestamp: string;
    input: string;
    command: Command | null;
    response: string;
  }>;
  
  // Actions
  createProject: (title: string) => void;
  processCommand: (input: string) => void;
  commitChanges: () => void;
  rejectChanges: () => void;
  exportProject: () => string;
  importProject: (data: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  chatHistory: [],

  createProject: (title: string) => {
    const project = ProjectReducer.createProject(title);
    set({ project });
  },

  processCommand: (input: string) => {
    const command = CommandParser.parse(input);
    const { project, chatHistory } = get();
    
    if (!project) {
      set({
        chatHistory: [
          ...chatHistory,
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            input,
            command: null,
            response: 'No project loaded. Create a project first.',
          },
        ],
      });
      return;
    }

    if (!command) {
      set({
        chatHistory: [
          ...chatHistory,
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            input,
            command: null,
            response: 'Command not recognized. Try: Create project "Title", Add character "Name": description=value, Commit, etc.',
          },
        ],
      });
      return;
    }

    const delta: Delta = {
      id: Date.now().toString(),
      command,
      timestamp: new Date().toISOString(),
      status: 'staged',
    };

    const updatedProject = ProjectReducer.applyDelta(project, delta);
    
    let response = '';
    switch (command.type) {
      case 'create_project':
        response = `Created project "${command.title}"`;
        break;
      case 'style_add':
        response = `Added style rules: ${command.rules}`;
        break;
      case 'device_ban':
        response = `Banned device: ${command.device}`;
        break;
      case 'lexicon_avoid':
        response = `Added to avoid list: ${command.word}`;
        break;
      case 'add_character':
        response = `Added character "${command.name}" with properties: ${JSON.stringify(command.properties)}`;
        break;
      case 'add_location':
        response = `Added location "${command.name}" with properties: ${JSON.stringify(command.properties)}`;
        break;
      case 'use_outline':
        response = `Using outline template: ${command.template}`;
        break;
      case 'generate_chapter':
        response = `Generated Chapter ${command.number} (placeholder content)`;
        break;
      case 'commit':
        response = `Committed ${updatedProject.staged_patches.length} changes`;
        break;
      case 'reject':
        response = `Rejected ${project.staged_patches.length} staged changes`;
        break;
    }

    set({
      project: updatedProject,
      chatHistory: [
        ...chatHistory,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          input,
          command,
          response,
        },
      ],
    });
  },

  commitChanges: () => {
    const { project } = get();
    if (!project) return;

    const updatedProject = ProjectReducer.commitPatches(project);
    set({ project: updatedProject });
  },

  rejectChanges: () => {
    const { project } = get();
    if (!project) return;

    const updatedProject = ProjectReducer.rejectPatches(project);
    set({ project: updatedProject });
  },

  exportProject: () => {
    const { project } = get();
    if (!project) return '';
    
    return JSON.stringify(project, null, 2);
  },

  importProject: (data: string) => {
    try {
      const project = JSON.parse(data);
      set({ project });
    } catch (error) {
      console.error('Failed to import project:', error);
    }
  },
}));
