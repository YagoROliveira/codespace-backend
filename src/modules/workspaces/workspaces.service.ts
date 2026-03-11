import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace, WorkspaceDocument, WorkspaceFile } from './schemas/workspace.schema';

// Default files for a new workspace
const DEFAULT_FILES: WorkspaceFile[] = [
  {
    path: 'src',
    content: '',
    language: 'plaintext',
    isFolder: true,
  },
  {
    path: 'src/index.js',
    content: `// 🚀 Bem-vindo ao CodeSPACE IDE!
// Este é seu ambiente de desenvolvimento pessoal.
// Crie arquivos, pastas e escreva código livremente.

function saudacao(nome) {
  return \`Olá, \${nome}! Bem-vindo ao CodeSPACE!\`;
}

console.log(saudacao("Dev"));
`,
    language: 'javascript',
    isFolder: false,
  },
  {
    path: 'README.md',
    content: `# Meu Projeto

Bem-vindo ao seu workspace no CodeSPACE IDE! 🎉

## Como usar

- Use o **explorador de arquivos** à esquerda para navegar
- Crie novos arquivos e pastas com os botões no topo
- Edite o código no editor central
- Execute JavaScript com o botão ▶ Run

Bons estudos! 🚀
`,
    language: 'markdown',
    isFolder: false,
  },
];

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
  ) { }

  /**
   * Get or create workspace for a user
   */
  async getWorkspace(userId: string): Promise<WorkspaceDocument> {
    let workspace = await this.workspaceModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!workspace) {
      workspace = await this.workspaceModel.create({
        userId: new Types.ObjectId(userId),
        name: 'Meu Projeto',
        files: DEFAULT_FILES,
      });
    }
    return workspace;
  }

  /**
   * Get workspace by user id (for mentor access)
   */
  async getWorkspaceByUserId(targetUserId: string): Promise<WorkspaceDocument> {
    let workspace = await this.workspaceModel.findOne({
      userId: new Types.ObjectId(targetUserId),
    });
    if (!workspace) {
      workspace = await this.workspaceModel.create({
        userId: new Types.ObjectId(targetUserId),
        name: 'Meu Projeto',
        files: DEFAULT_FILES,
      });
    }
    return workspace;
  }

  /**
   * Update workspace name
   */
  async updateWorkspaceName(userId: string, name: string): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspace(userId);
    workspace.name = name;
    return workspace.save();
  }

  /**
   * Create a file or folder
   */
  async createFile(
    userId: string,
    path: string,
    content: string,
    language: string,
    isFolder: boolean,
  ): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspace(userId);

    // Check if file already exists
    const exists = workspace.files.some((f) => f.path === path);
    if (exists) {
      throw new BadRequestException(`Arquivo já existe: ${path}`);
    }

    workspace.files.push({ path, content, language, isFolder });
    return workspace.save();
  }

  /**
   * Update file content
   */
  async updateFile(
    userId: string,
    path: string,
    content: string,
  ): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspace(userId);

    const file = workspace.files.find((f) => f.path === path && !f.isFolder);
    if (!file) {
      throw new NotFoundException(`Arquivo não encontrado: ${path}`);
    }

    file.content = content;
    workspace.markModified('files');
    return workspace.save();
  }

  /**
   * Rename a file or folder
   */
  async renameFile(
    userId: string,
    oldPath: string,
    newPath: string,
  ): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspace(userId);

    const file = workspace.files.find((f) => f.path === oldPath);
    if (!file) {
      throw new NotFoundException(`Arquivo não encontrado: ${oldPath}`);
    }

    // If renaming a folder, also rename all children
    if (file.isFolder) {
      const prefix = oldPath.endsWith('/') ? oldPath : oldPath + '/';
      workspace.files.forEach((f) => {
        if (f.path.startsWith(prefix)) {
          const newPrefix = newPath.endsWith('/') ? newPath : newPath + '/';
          f.path = newPrefix + f.path.slice(prefix.length);
        }
      });
    }

    file.path = newPath;
    workspace.markModified('files');
    return workspace.save();
  }

  /**
   * Delete a file or folder (and all children if folder)
   */
  async deleteFile(userId: string, path: string): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspace(userId);

    const file = workspace.files.find((f) => f.path === path);
    if (!file) {
      throw new NotFoundException(`Arquivo não encontrado: ${path}`);
    }

    if (file.isFolder) {
      const prefix = path.endsWith('/') ? path : path + '/';
      workspace.files = workspace.files.filter(
        (f) => f.path !== path && !f.path.startsWith(prefix),
      );
    } else {
      workspace.files = workspace.files.filter((f) => f.path !== path);
    }

    workspace.markModified('files');
    return workspace.save();
  }

  /**
   * Bulk save multiple files at once (for auto-save)
   */
  async bulkSaveFiles(
    userId: string,
    files: { path: string; content: string }[],
  ): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspace(userId);

    for (const update of files) {
      const file = workspace.files.find((f) => f.path === update.path && !f.isFolder);
      if (file) {
        file.content = update.content;
      }
    }

    workspace.markModified('files');
    return workspace.save();
  }

  /**
   * Save workspace for mentor editing student workspace
   */
  async updateFileAsAdmin(
    targetUserId: string,
    path: string,
    content: string,
  ): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspaceByUserId(targetUserId);

    const file = workspace.files.find((f) => f.path === path && !f.isFolder);
    if (!file) {
      throw new NotFoundException(`Arquivo não encontrado: ${path}`);
    }

    file.content = content;
    workspace.markModified('files');
    return workspace.save();
  }

  /**
   * Create file in student workspace as admin
   */
  async createFileAsAdmin(
    targetUserId: string,
    path: string,
    content: string,
    language: string,
    isFolder: boolean,
  ): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspaceByUserId(targetUserId);

    const exists = workspace.files.some((f) => f.path === path);
    if (exists) {
      throw new BadRequestException(`Arquivo já existe: ${path}`);
    }

    workspace.files.push({ path, content, language, isFolder });
    return workspace.save();
  }

  /**
   * Delete file in student workspace as admin
   */
  async deleteFileAsAdmin(
    targetUserId: string,
    path: string,
  ): Promise<WorkspaceDocument> {
    const workspace = await this.getWorkspaceByUserId(targetUserId);

    const file = workspace.files.find((f) => f.path === path);
    if (!file) {
      throw new NotFoundException(`Arquivo não encontrado: ${path}`);
    }

    if (file.isFolder) {
      const prefix = path.endsWith('/') ? path : path + '/';
      workspace.files = workspace.files.filter(
        (f) => f.path !== path && !f.path.startsWith(prefix),
      );
    } else {
      workspace.files = workspace.files.filter((f) => f.path !== path);
    }

    workspace.markModified('files');
    return workspace.save();
  }
}
