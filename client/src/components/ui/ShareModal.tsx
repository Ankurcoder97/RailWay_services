import { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  trainNumber: string;
  onClose: () => void;
}

export default function ShareModal({ trainNumber, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/?train=${trainNumber}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Live Train Tracker - Train #${trainNumber}`,
        text: `Track live running status and position of Indian Railways Train #${trainNumber} on RailGaadi!`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
      <div className="card-panel w-full max-w-md p-6 relative space-y-6 shadow-2xl border border-slate-700">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Share Journey Link</h3>
              <p className="text-xs text-slate-400">Train #{trainNumber} live status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">Shareable URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`} 
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] text-slate-400">Scan QR code with smartphone to track on mobile</p>
        </div>

        {/* Native Share CTA */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Open System Share Menu</span>
          </button>
        )}

      </div>
    </div>
  );
}
