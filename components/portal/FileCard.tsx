"use client";

import React, { useState } from "react";
import { FileText, Image, Film, FileArchive, Download, Trash2, Loader2 } from "lucide-react";
import type { ProjectFile } from "@/types/portal";

interface FileCardProps {
  file: ProjectFile;
  onDelete?: (id: string) => Promise<void>;
  showDelete?: boolean;
}

const getFileIcon = (mime: string) => {
  if (mime.startsWith("image/")) return Image;
  if (mime.startsWith("video/")) return Film;
  if (mime.includes("zip") || mime.includes("tar") || mime.includes("rar") || mime.includes("7z")) return FileArchive;
  return FileText;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileCard({ file, onDelete, showDelete = false }: FileCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileIcon = getFileIcon(file.mime);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(`/api/delivery-projects/${file.project_id}/files/${file.id}/download`);
      if (!res.ok) throw new Error("Failed to get download URL");
      const { signedUrl } = await res.json();
      
      // Open signed URL or trigger native download
      const a = document.createElement("a");
      a.href = signedUrl;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !confirm(`Delete file "${file.filename}"?`)) return;
    try {
      setDeleting(true);
      await onDelete(file.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/10 bg-surface/50 hover:bg-surface transition-all select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
          {React.createElement(fileIcon, { className: "w-5 h-5" })}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-mono font-bold truncate text-foreground" title={file.filename}>
            {file.filename}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-muted">
            <span>{formatSize(file.size_bytes)}</span>
            <span>•</span>
            <span>v{file.version}</span>
            {file.uploaded_by && (
              <>
                <span>•</span>
                <span className="truncate max-w-[80px]">By {file.uploaded_by}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="p-2 hover:bg-primary/10 hover:text-primary rounded text-muted transition-all"
          title="Download"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </button>
        {showDelete && onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded text-muted transition-all"
            title="Delete"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
