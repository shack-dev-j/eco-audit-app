import React, { useState, useRef } from 'react';
import { Upload, Plus, X, Image as ImageIcon, Check, Sparkles } from 'lucide-react';
import BespokeInput from './design-system/BespokeInput';
import BespokeButton from './design-system/BespokeButton';

export default function CustomPhotoUploader({ onCustomScenarioCreated, onClose }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [title, setTitle] = useState('Our Campus Scene');
  const [customIssues, setCustomIssues] = useState([]);
  const [newIssueName, setNewIssueName] = useState('');
  const [pendingCoords, setPendingCoords] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e) => {
    if (!imageSrc) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPendingCoords({ x: xPct, y: yPct });
  };

  const handleAddHotspot = (e) => {
    e.preventDefault();
    if (!newIssueName.trim() || !pendingCoords) return;

    const newIssue = {
      id: `custom-issue-${Date.now()}`,
      title: newIssueName.trim(),
      category: 'Campus Observation',
      x: pendingCoords.x,
      y: pendingCoords.y,
      icon: 'AlertCircle',
      severity: 'Medium',
      description: `Observed at coordinates (${pendingCoords.x}%, ${pendingCoords.y}%)`,
      practicalAction: 'Investigate, fix or report to school committee',
      rationales: ['Immediate local fix', 'Improves our campus sustainability']
    };

    setCustomIssues([...customIssues, newIssue]);
    setNewIssueName('');
    setPendingCoords(null);
  };

  const handleSaveScenario = () => {
    if (!imageSrc) return;
    const customScenario = {
      id: `custom-scenario-${Date.now()}`,
      title: title || 'Custom School Photo Audit',
      subtitle: 'Custom uploaded campus environment',
      badge: 'Custom Photo Audit',
      description: 'Audit based on an uploaded photograph of our physical school or office.',
      difficulty: `${customIssues.length} Custom Eco-Hazards`,
      accentColor: '#10b981',
      coverImage: imageSrc,
      customImageUrl: imageSrc,
      issues: customIssues.length > 0 ? customIssues : [
        {
          id: 'custom-1',
          title: 'Campus Waste Observation',
          category: 'Waste',
          x: 50,
          y: 50,
          icon: 'Trash2',
          severity: 'Medium',
          description: 'Identified sustainability issue in this photo.',
          practicalAction: 'Take realistic action step',
          rationales: ['Quick win']
        }
      ]
    };
    onCustomScenarioCreated(customScenario);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-600/40 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg sm:text-xl font-bold">
              Upload Custom School/Office Photo
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title Input */}
        <BespokeInput
          label="Scenario / Location Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Science Lab 3, Staff Breakroom, South Courtyard"
          theme="solarpunk"
        />

        {/* Image Uploader or Preview */}
        {!imageSrc ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400/80 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-emerald-950/20"
          >
            <Upload className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Click to select photo</h4>
            <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP up to 10MB</p>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-emerald-300 font-semibold flex items-center justify-between">
              <span>Click anywhere on the photo to place an eco-issue marker:</span>
              <button
                onClick={() => { setImageSrc(null); setCustomIssues([]); }}
                className="text-xs text-red-400 hover:underline"
              >
                Change photo
              </button>
            </div>

            {/* Clickable Image Surface */}
            <div 
              onClick={handleImageClick}
              className="relative w-full aspect-[16/9] max-h-[340px] rounded-2xl overflow-hidden border-2 border-emerald-600/50 cursor-crosshair bg-black"
            >
              <img 
                src={imageSrc} 
                alt="Custom Scenario" 
                className="w-full h-full object-cover" 
              />

              {/* Existing Hotspots */}
              {customIssues.map((issue, idx) => (
                <div
                  key={issue.id}
                  style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-lg border-2 border-white"
                >
                  {idx + 1}
                </div>
              ))}

              {/* Pending Coord Marker */}
              {pendingCoords && (
                <div
                  style={{ left: `${pendingCoords.x}%`, top: `${pendingCoords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-lg animate-ping"
                />
              )}
            </div>

            {/* Add Hotspot Form */}
            {pendingCoords && (
              <form onSubmit={handleAddHotspot} className="flex gap-2 p-3 rounded-xl bg-slate-950 border border-amber-500/50">
                <input
                  type="text"
                  placeholder="Name of eco-issue at this spot (e.g. Broken recycling lid)"
                  value={newIssueName}
                  onChange={(e) => setNewIssueName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newIssueName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors disabled:opacity-40"
                >
                  Save Marker #{customIssues.length + 1}
                </button>
              </form>
            )}

            {/* Hotspots summary list */}
            {customIssues.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {customIssues.map((ci, idx) => (
                  <span key={ci.id} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                    <span className="font-bold text-emerald-400">#{idx + 1}</span>
                    <span>{ci.title}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <BespokeButton
            onClick={handleSaveScenario}
            disabled={!imageSrc}
            theme="solarpunk"
            size="sm"
          >
            Launch Audit with This Photo
          </BespokeButton>
        </div>

      </div>
    </div>
  );
}
