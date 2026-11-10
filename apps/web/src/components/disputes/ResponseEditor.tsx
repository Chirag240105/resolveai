'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Edit3, Link2, Sparkles } from 'lucide-react';
import type { ResponseDraft } from '@/lib/types';

interface ResponseEditorProps {
  draft?: ResponseDraft;
  onSave?: (updatedText: string) => void;
}

export const ResponseEditor: React.FC<ResponseEditorProps> = ({ draft, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bodyText, setBodyText] = useState(
    draft?.body ||
      'We are formally contesting this dispute. The order was dispatched via carrier tracking and fulfilled according to PayPal Seller Protection guidelines.'
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <CardTitle>AI-Drafted Contestation Response</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {draft?.tone && <Badge variant="blue">{draft.tone.replace(/_/g, ' ')}</Badge>}
            <Button
              variant="outline"
              size="sm"
              leftIcon={isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              onClick={() => {
                if (isEditing && onSave) onSave(bodyText);
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? 'Save Changes' : 'Edit Response'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4">
        {draft?.subject && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">Subject Header</span>
            <span className="text-sm font-semibold text-slate-800">{draft.subject}</span>
          </div>
        )}

        {isEditing ? (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Merchant Response Letter
            </label>
            <textarea
              className="w-full h-48 p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed">
            {bodyText}
          </div>
        )}

        {draft?.sections && draft.sections.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Verified Source Citations (Zero-Hallucination Grounding)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {draft.sections.flatMap((s) => s.citations).map((cit, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-blue-100 bg-blue-50/40 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-900 mb-1">
                    <Link2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{cit.source}: {cit.reference}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{cit.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

