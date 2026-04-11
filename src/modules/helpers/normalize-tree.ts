import { FileSystemTree } from '@webcontainer/api';

/**
 * Flattens a nested FileSystemTree into a simple { "path/to/file": "content" } map.
 * Saves massive token cost when sending to the LLM.
 */
export function flattenTree(tree: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [name, node] of Object.entries(tree)) {
    const path = prefix ? `${prefix}/${name}` : name;
    if (node?.directory) {
      Object.assign(result, flattenTree(node.directory, path));
    } else if (node?.file) {
      result[path] = node.file.contents;
    }
  }
  return result;
}

export interface FilePatch {
  type: 'write' | 'delete';
  path: string;
  content?: string;
}


export function applyPatchesToTree(originalTree: FileSystemTree, patches: FilePatch[]): FileSystemTree {
  const newTree: Record<string, any> = structuredClone(originalTree);

  for (const patch of patches) {
    const { type, path, content } = patch;

    const parts = path.split('/');
    const fileName = parts.pop()!;
    let currentDir = newTree;

    for (const dirName of parts) {
      if (!currentDir[dirName]) {
        currentDir[dirName] = { directory: {} };
      }
      currentDir = currentDir[dirName].directory;
    }


    if (type === 'write' && content !== undefined) {
      currentDir[fileName] = {
        file: { contents: content }
      };
    } else if (type === 'delete') {
      delete currentDir[fileName];
    }
  }

  return newTree as FileSystemTree;
}