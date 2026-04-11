"use client"

import React, { useState } from "react"
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from "lucide-react"

interface FileExplorerProps {
  files: any; // The WebContainer files object
  currentPath?: string;
  onSelectFile: (path: string, content: string) => void;
  selectedPath?: string;
}

export function FileExplorer({ files, currentPath = "", onSelectFile, selectedPath }: FileExplorerProps) {
  // Sort files: directories first, then files
  const entries = Object.entries(files || {}).sort(([aName, aVal]: any, [bName, bVal]: any) => {
    const isADir = 'directory' in aVal;
    const isBDir = 'directory' in bVal;
    if (isADir && !isBDir) return -1;
    if (!isADir && isBDir) return 1;
    return aName.localeCompare(bName);
  });

  return (
    <div className="text-sm font-mono overflow-y-auto w-full">
      {entries.map(([name, node]) => {
        const fullPath = currentPath ? `${currentPath}/${name}` : name;
        const isDir = 'directory' in (node as any);

        if (isDir) {
          return (
            <FolderNode
              key={fullPath}
              name={name}
              node={(node as any).directory}
              fullPath={fullPath}
              onSelectFile={onSelectFile}
              selectedPath={selectedPath}
            />
          )
        }

        return (
          <FileNode
            key={fullPath}
            name={name}
            content={(node as any).file?.contents || ""}
            fullPath={fullPath}
            onSelectFile={onSelectFile}
            selectedPath={selectedPath}
          />
        )
      })}
    </div>
  )
}

function FolderNode({ name, node, fullPath, onSelectFile, selectedPath }: any) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      <div 
        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted/50 cursor-pointer text-muted-foreground transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 transition-transform" /> : <ChevronRight className="w-4 h-4 shrink-0 transition-transform" />}
        {isOpen ? <FolderOpen className="w-4 h-4 shrink-0 text-primary" /> : <Folder className="w-4 h-4 shrink-0 text-primary" />}
        <span className="truncate select-none font-medium">{name}</span>
      </div>
      {isOpen && (
        <div className="pl-4 border-l border-border/50 ml-[11px]">
          <FileExplorer files={node} currentPath={fullPath} onSelectFile={onSelectFile} selectedPath={selectedPath} />
        </div>
      )}
    </div>
  )
}

function FileNode({ name, content, fullPath, onSelectFile, selectedPath }: any) {
  const isSelected = selectedPath === fullPath;
  
  return (
    <div 
      className={`flex items-center gap-1.5 px-2 py-1.5 pl-6 cursor-pointer transition-colors ${isSelected ? "bg-primary/10 text-primary border-r-2 border-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
      onClick={() => onSelectFile(fullPath, content)}
    >
      <File className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
      <span className="truncate select-none">{name}</span>
    </div>
  )
}
