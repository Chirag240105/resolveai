'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Edit3, Link2, Sparkles, Copy, CheckCheck } from 'lucide-react';
import type { ResponseDraft } from '@/lib/types';

interface ResponseEditorProps {
  draft?: ResponseDraft;
  onSave?: (updatedText: string) => void;
}

export const ResponseEditor: React.FC<ResponseEditorProps> = ({ draft, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bodyText, setBodyText] = useState(
    draft?.body ||
      'We are formally contesting this dispute. The order was dispatched via carrier tracking and fulfilled in accordance with PayPal Seller Protection guidelines.'
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-primary/10 border border-violet-primary/20 text-violet-light">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>AI-Drafted Contestation Response</CardTitle>
              <p className="text-xs text-text-muted mt-0.5">
                Deterministic generation grounded in verified shipment & transaction evidence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {draft?.tone && (
              <Badge variant="purple" size="sm">
                {draft.tone.replace(/_/g, ' ')}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              leftIcon={copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              onClick={() => {
                if (isEditing && onSave) onSave(bodyText);
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? 'Save Changes' : 'Edit Letter'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4 mt-2">
        {draft?.subject && (
          <div className="p-3.5 bg-bg-secondary/70 rounded-lg border border-border-subtle">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted block mb-1">
              Subject Line for PayPal Submission
            </span>
            <span className="text-sm font-semibold text-text-primary">{draft.subject}</span>
          </div>
        )}

        {isEditing ? (
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
              Contestation Letter Editor (Supports Markdown & Grounded Facts)
            </label>
            <textarea
              className="w-full h-56 p-4 text-sm bg-bg-secondary border border-violet-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-primary font-mono text-text-primary placeholder-text-muted leading-relaxed resize-y"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            />
          </div>
        ) : (
          <div className="text-sm text-text-secondary bg-bg-secondary/40 p-5 rounded-xl border border-border-subtle/70 whitespace-pre-line leading-relaxed font-sans">
            {bodyText}
          </div>
        )}

        {draft?.sections && draft.sections.length > 0 && (
          <div className="pt-4 border-t border-border-subtle">
            <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-violet-primary" />
              Verified Source Citations (Zero-Hallucination Grounding)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {draft.sections.flatMap((s) => s.citations).map((cit, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border-subtle bg-bg-secondary/50 text-xs transition-colors hover:border-violet-primary/30"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-text-primary mb-1">
                    <span className="text-violet-light font-mono">[{cit.source}]</span>
                    <span className="text-text-secondary font-mono">{cit.reference}</span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-relaxed">{cit.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
