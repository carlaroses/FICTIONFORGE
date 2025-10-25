import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Project } from './schemas/project';

interface FictionForgeDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
  };
}

class IDBPersistence {
  private db: IDBPDatabase<FictionForgeDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<FictionForgeDB>('fictionforge', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
      },
    });
  }

  async saveProject(project: Project): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('projects', project);
  }

  async loadProject(id: string): Promise<Project | null> {
    if (!this.db) await this.init();
    return await this.db!.get('projects', id) || null;
  }

  async listProjects(): Promise<Project[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('projects');
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('projects', id);
  }

  async exportProject(project: Project): Promise<string> {
    return JSON.stringify(project, null, 2);
  }

  async importProject(data: string): Promise<Project> {
    const project = JSON.parse(data);
    await this.saveProject(project);
    return project;
  }
}

export const idbPersistence = new IDBPersistence();
