"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Plus, Trash2, Edit2, Check, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ProposalTemplate } from "@/types/portal";

export default function ProposalTemplatesPage() {
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<any[]>([]);
  const [pricingBlocks, setPricingBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/proposals"); // Let's check where templates are. We should create GET /api/admin/proposals/templates or implement it in /api/proposals.
      // Wait, let's write a dedicated API endpoint for proposal templates!
      // In the implementation plan: GET/POST /api/proposals/templates or local fallback. Let's write the route POST/GET /api/proposal-templates/route.ts and update references.
      const templatesRes = await fetch("/api/proposal-templates");
      if (templatesRes.ok) {
        const data = await templatesRes.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      sections,
      pricing_blocks: pricingBlocks,
      deliverables: [],
      timeline: [],
      faqs: [],
      terms: {},
    };

    try {
      const url = editingId ? `/api/proposal-templates/${editingId}` : "/api/proposal-templates";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save template");
      
      setEditingId(null);
      setTitle("");
      setDescription("");
      setSections([]);
      setPricingBlocks([]);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert("Failed to save template");
    }
  };

  const handleEdit = (tpl: ProposalTemplate) => {
    setEditingId(tpl.id);
    setTitle(tpl.title);
    setDescription(tpl.description ?? "");
    setSections(tpl.sections ?? []);
    setPricingBlocks(tpl.pricing_blocks ?? []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    try {
      const res = await fetch(`/api/proposal-templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert("Failed to delete template");
    }
  };

  const addSection = () => {
    setSections([...sections, { heading: "", body: "" }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addPricing = () => {
    setPricingBlocks([...pricingBlocks, { item: "", price: "", unit: "project" }]);
  };

  const removePricing = (index: number) => {
    setPricingBlocks(pricingBlocks.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 font-mono text-xs text-muted gap-2">
        <RefreshCw className="w-4 h-4 animate-spin" />
        Loading templates...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Templates ]
          </span>
          <Heading level={1} className="mt-2">Proposal Builder</Heading>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Form */}
        <div className="lg:col-span-2 bg-surface/30 p-6 rounded-2xl border border-border/10">
          <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2 mb-4">
            {editingId ? "Edit Template" : "Create New Template"}
          </h3>
          
          <form onSubmit={handleSave} className="flex flex-col gap-6 font-mono text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-[10px] uppercase font-bold">Template Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Enterprise Web App"
                className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-[10px] uppercase font-bold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary..."
                rows={2}
                className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

            {/* Sections builder */}
            <div className="flex flex-col gap-4 border-t border-border/5 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-muted text-[10px] uppercase font-bold">Proposal Sections</label>
                <button
                  type="button"
                  onClick={addSection}
                  className="bg-surface hover:bg-surface/80 border border-border/10 text-foreground px-2.5 py-1 rounded text-[10px] flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  Add Section
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {sections.map((sec, idx) => (
                  <div key={idx} className="bg-background border border-border/10 p-4 rounded-xl flex flex-col gap-3 relative">
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="absolute right-3 top-3 text-muted hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      required
                      placeholder="Section Heading"
                      value={sec.heading}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[idx].heading = e.target.value;
                        setSections(updated);
                      }}
                      className="bg-surface border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50 w-[90%]"
                    />
                    <textarea
                      required
                      placeholder="Section body text..."
                      value={sec.body}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[idx].body = e.target.value;
                        setSections(updated);
                      }}
                      rows={3}
                      className="bg-surface border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing builder */}
            <div className="flex flex-col gap-4 border-t border-border/5 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-muted text-[10px] uppercase font-bold">Pricing Estimation</label>
                <button
                  type="button"
                  onClick={addPricing}
                  className="bg-surface hover:bg-surface/80 border border-border/10 text-foreground px-2.5 py-1 rounded text-[10px] flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  Add Item
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {pricingBlocks.map((prc, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-background border border-border/10 p-3 rounded-lg">
                    <input
                      type="text"
                      required
                      placeholder="Item name"
                      value={prc.item}
                      onChange={(e) => {
                        const updated = [...pricingBlocks];
                        updated[idx].item = e.target.value;
                        setPricingBlocks(updated);
                      }}
                      className="bg-surface border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50 flex-1"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Price (e.g. $5,000)"
                      value={prc.price}
                      onChange={(e) => {
                        const updated = [...pricingBlocks];
                        updated[idx].price = e.target.value;
                        setPricingBlocks(updated);
                      }}
                      className="bg-surface border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50 w-24 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => removePricing(idx)}
                      className="text-muted hover:text-destructive transition-colors p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border/5 pt-4">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                    setSections([]);
                    setPricingBlocks([]);
                  }}
                  className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-primary text-background font-bold px-6 py-2 rounded-lg hover:opacity-90"
              >
                Save Template
              </button>
            </div>
          </form>
        </div>

        {/* Existing list */}
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-sm font-bold text-foreground">Saved Templates</h3>
          
          {templates.length === 0 ? (
            <div className="text-muted text-xs font-mono py-8 text-center border border-dashed border-border/10 rounded-xl">
              No proposal templates built.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="flex justify-between items-center p-4 bg-surface/30 hover:bg-surface/50 border border-border/10 rounded-xl transition-all"
                >
                  <div className="font-mono text-xs truncate max-w-[80%]">
                    <p className="font-bold text-foreground truncate">{tpl.title}</p>
                    <p className="text-[10px] text-muted truncate">{tpl.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(tpl)}
                      className="p-1.5 hover:bg-primary/10 hover:text-primary rounded text-muted transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded text-muted transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
