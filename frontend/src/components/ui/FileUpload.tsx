import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon, FileAudio } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

interface FileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (url: string) => void;
  currentUrl?: string;
}

export default function FileUpload({
  label,
  accept,
  onFileSelect,
  currentUrl,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    // Preview pour les images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setFileName(file.name);
    }

    try {
      const url = await uploadService.uploadFile(file);
      onFileSelect(url);
      setUploading(false);
    } catch (err) {
      setError('Erreur lors de l\'upload du fichier.');
      setUploading(false);
      setPreview(null);
      setFileName(null);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect('');
  };

  const isImage = accept.startsWith('image/');
  const hasFile = preview || fileName || currentUrl;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        {label} <span className="text-red-400">*</span>
      </label>

      {!hasFile && !uploading && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-')}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg bg-slate-950 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <UploadCloud className="h-8 w-8 text-slate-500 mb-2" />
            <p className="text-sm text-slate-400">
              Cliquez pour sélectionner un fichier
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isImage ? 'Image (JPG, PNG, etc.)' : 'Audio (MP3, WAV, etc.)'}
            </p>
          </label>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center w-full h-32 border border-slate-700 rounded-lg bg-slate-950">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            <p className="text-sm text-slate-400">Chargement...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-2 rounded-lg text-xs">
          {error}
        </div>
      )}

      {hasFile && !uploading && (
        <div className="relative border border-slate-700 rounded-lg bg-slate-950 p-3">
          {preview || (currentUrl && isImage) ? (
            <div className="relative">
              <img
                src={preview || currentUrl || ''}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <FileAudio className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    {fileName || 'Fichier audio'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {currentUrl ? 'Fichier uploadé' : 'Prêt à être uploadé'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {currentUrl && !preview && !fileName && (
        <input
          type="hidden"
          value={currentUrl}
        />
      )}
    </div>
  );
}

