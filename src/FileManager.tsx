import React, { useState } from 'react';
import { Folder, File, FolderOpen, HardDrive, Trash2, Upload, FolderPlus, Grid, List, FileText, Image as ImageIcon, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from './utils';

export function FileManager() {
  const [currentPath, setCurrentPath] = useState('/Documents');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState([
    { id: 1, name: 'Project Proposal.docx', type: 'file', path: '/Documents', size: '2.4 MB', date: 'Oct 12, 2026' },
    { id: 2, name: 'Q3 Financials.xlsx', type: 'file', path: '/Documents', size: '1.1 MB', date: 'Oct 10, 2026' },
    { id: 3, name: 'Vacation', type: 'folder', path: '/Pictures', size: '--', date: 'Sep 05, 2026' },
    { id: 4, name: 'Profile.jpg', type: 'file', path: '/Pictures', size: '840 KB', date: 'Aug 22, 2026' },
    { id: 5, name: 'Setup.exe', type: 'file', path: '/Downloads', size: '145 MB', date: 'Oct 15, 2026' },
    { id: 6, name: 'Archive', type: 'folder', path: '/Documents', size: '--', date: 'Jan 10, 2026' },
  ]);

  const currentFiles = files.filter(f => f.path === currentPath);

  const handleCreateFolder = () => {
    const name = prompt('New folder name:');
    if (name) {
      setFiles([...files, { id: Date.now(), name, type: 'folder', path: currentPath, size: '--', date: new Date().toLocaleDateString() }]);
    }
  };

  const handleDelete = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="flex h-full bg-white text-slate-800 font-sans">
      {/* Sidebar */}
      <div className="w-48 bg-slate-50 border-r border-slate-200 flex flex-col py-4 shrink-0">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Access</div>
        <button onClick={() => setCurrentPath('/Documents')} className={cn("flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-200 transition-colors", currentPath === '/Documents' && "bg-slate-200 font-medium")}>
          <FileText className="w-4 h-4 text-blue-500" /> Documents
        </button>
        <button onClick={() => setCurrentPath('/Pictures')} className={cn("flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-200 transition-colors", currentPath === '/Pictures' && "bg-slate-200 font-medium")}>
          <ImageIcon className="w-4 h-4 text-purple-500" /> Pictures
        </button>
        <button onClick={() => setCurrentPath('/Downloads')} className={cn("flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-200 transition-colors", currentPath === '/Downloads' && "bg-slate-200 font-medium")}>
          <Download className="w-4 h-4 text-emerald-500" /> Downloads
        </button>
        <div className="mt-8 px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">This PC</div>
        <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-200 transition-colors">
          <HardDrive className="w-4 h-4 text-slate-500" /> Local Disk (C:)
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-50" disabled><ArrowLeft className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-50" disabled><ArrowRight className="w-4 h-4" /></button>
            <div className="flex items-center gap-2 ml-2 px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200 text-sm min-w-[200px]">
              <FolderOpen className="w-4 h-4 text-slate-400" />
              {currentPath}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCreateFolder} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded text-sm font-medium text-slate-700 border border-slate-200">
              <FolderPlus className="w-4 h-4 text-blue-500" /> <span className="hidden sm:inline">New Folder</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded text-sm font-medium text-slate-700 border border-slate-200">
              <Upload className="w-4 h-4 text-emerald-500" /> <span className="hidden sm:inline">Upload</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded", viewMode === 'grid' ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100")}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded", viewMode === 'list' ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100")}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {/* File Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {currentFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FolderOpen className="w-16 h-16 mb-4 opacity-20" />
              <p>This folder is empty</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {currentFiles.map(file => (
                <div key={file.id} className="group flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 cursor-pointer relative">
                  {file.type === 'folder' ? (
                    <Folder className="w-12 h-12 text-blue-400 mb-2" fill="currentColor" />
                  ) : (
                    <File className="w-12 h-12 text-slate-400 mb-2" />
                  )}
                  <span className="text-xs text-center break-words w-full line-clamp-2">{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium hidden sm:table-cell">Date modified</th>
                  <th className="pb-2 font-medium hidden md:table-cell">Type</th>
                  <th className="pb-2 font-medium">Size</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map(file => (
                  <tr key={file.id} className="border-b border-slate-100 hover:bg-slate-50 group cursor-pointer">
                    <td className="py-2 flex items-center gap-3">
                      {file.type === 'folder' ? <Folder className="w-5 h-5 text-blue-400" fill="currentColor" /> : <File className="w-5 h-5 text-slate-400" />}
                      {file.name}
                    </td>
                    <td className="py-2 text-slate-500 hidden sm:table-cell">{file.date}</td>
                    <td className="py-2 text-slate-500 capitalize hidden md:table-cell">{file.type}</td>
                    <td className="py-2 text-slate-500">{file.size}</td>
                    <td className="py-2 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="p-1.5 rounded hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
