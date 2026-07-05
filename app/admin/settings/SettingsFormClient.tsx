"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

interface SettingsFormClientProps {
  initialSettings: any;
}

export function SettingsFormClient({ initialSettings }: SettingsFormClientProps) {
  const router = useRouter();
  const [branding, setBranding] = useState(initialSettings.branding || { brandName: "ANNEX", logo: "ANNEX" });
  const [contact, setContact] = useState(initialSettings.contact || { address: "", email: "" });
  const [social, setSocial] = useState(initialSettings.social || { github: "", twitter: "", linkedin: "" });
  
  const [homepage, setHomepage] = useState(initialSettings.homepage || {
    hero: { title: "", subtitle: "" },
    process: { title: "" },
    contact: { title: "", description: "" },
  });


  const [savingModule, setSavingModule] = useState<string | null>(null);
  const [successModule, setSuccessModule] = useState<string | null>(null);

  const saveModule = async (moduleName: string, updates: any) => {
    setSavingModule(moduleName);
    setSuccessModule(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleName, updates }),
      });

      if (res.ok) {
        setSuccessModule(moduleName);
        router.refresh();
      } else {
        // failed
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingModule(null);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      {/* Header section */}
      <div className="pb-6 border-b border-border/10">
        <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
          [ Site System Configs ]
        </span>
        <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono">
          Global Configurations
        </Heading>
        <Text className="text-muted/60 text-xs">
          Edit public contacts, navigation brand parameters, and homepage section titles.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Module 1: Branding & Identity */}
        <div className="p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-6">
          <div className="flex justify-between items-start border-b border-border/10 pb-4">
            <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground">
              Branding & Identity
            </Heading>
            {successModule === "branding" && <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">[ Synced ]</span>}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Brand Name</label>
              <input
                type="text"
                value={branding.brandName}
                onChange={(e) => setBranding((prev: any) => ({ ...prev, brandName: e.target.value }))}
                className="font-sans text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Logo text</label>
              <input
                type="text"
                value={branding.logo}
                onChange={(e) => setBranding((prev: any) => ({ ...prev, logo: e.target.value }))}
                className="font-sans text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => saveModule("branding", branding)}
            disabled={savingModule === "branding"}
            className="font-mono text-[10px] uppercase tracking-widest py-2 bg-primary text-background rounded font-bold hover:bg-primary/95 transition-all duration-200"
          >
            {savingModule === "branding" ? "Saving..." : "Save Identity"}
          </button>
        </div>

        {/* Module 2: Contact Specifications */}
        <div className="p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-6">
          <div className="flex justify-between items-start border-b border-border/10 pb-4">
            <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground">
              Contact Details
            </Heading>
            {successModule === "contact" && <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">[ Synced ]</span>}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Support Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact((prev: any) => ({ ...prev, email: e.target.value }))}
                className="font-mono text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Address location</label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => setContact((prev: any) => ({ ...prev, address: e.target.value }))}
                className="font-sans text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => saveModule("contact", contact)}
            disabled={savingModule === "contact"}
            className="font-mono text-[10px] uppercase tracking-widest py-2 bg-primary text-background rounded font-bold hover:bg-primary/95 transition-all duration-200"
          >
            {savingModule === "contact" ? "Saving..." : "Save Coordinates"}
          </button>
        </div>

        {/* Module 3: Social Links */}
        <div className="p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-6">
          <div className="flex justify-between items-start border-b border-border/10 pb-4">
            <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground">
              Social Handles
            </Heading>
            {successModule === "social" && <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">[ Synced ]</span>}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">GitHub URL</label>
              <input
                type="text"
                value={social.github}
                onChange={(e) => setSocial((prev: any) => ({ ...prev, github: e.target.value }))}
                className="font-mono text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Twitter URL</label>
              <input
                type="text"
                value={social.twitter}
                onChange={(e) => setSocial((prev: any) => ({ ...prev, twitter: e.target.value }))}
                className="font-mono text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">LinkedIn URL</label>
              <input
                type="text"
                value={social.linkedin}
                onChange={(e) => setSocial((prev: any) => ({ ...prev, linkedin: e.target.value }))}
                className="font-mono text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => saveModule("social", social)}
            disabled={savingModule === "social"}
            className="font-mono text-[10px] uppercase tracking-widest py-2 bg-primary text-background rounded font-bold hover:bg-primary/95 transition-all duration-200"
          >
            {savingModule === "social" ? "Saving..." : "Save Links"}
          </button>
        </div>

        {/* Module 4: Homepage Copies */}
        <div className="p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-6 md:col-span-2">
          <div className="flex justify-between items-start border-b border-border/10 pb-4">
            <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground">
              Homepage Content
            </Heading>
            {successModule === "homepage" && <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">[ Synced ]</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Hero title</label>
              <input
                type="text"
                value={homepage.hero.title}
                onChange={(e) =>
                  setHomepage((prev: any) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))
                }
                className="font-sans text-xs px-3 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Hero subtitle</label>
              <textarea
                value={homepage.hero.subtitle}
                rows={2}
                onChange={(e) =>
                  setHomepage((prev: any) => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))
                }
                className="font-sans text-xs px-3 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Process fold title</label>
              <input
                type="text"
                value={homepage.process.title}
                onChange={(e) =>
                  setHomepage((prev: any) => ({ ...prev, process: { ...prev.process, title: e.target.value } }))
                }
                className="font-sans text-xs px-3 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Contact fold title</label>
              <input
                type="text"
                value={homepage.contact.title}
                onChange={(e) =>
                  setHomepage((prev: any) => ({ ...prev, contact: { ...prev.contact, title: e.target.value } }))
                }
                className="font-sans text-xs px-3 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Contact description</label>
              <textarea
                value={homepage.contact.description}
                rows={2}
                onChange={(e) =>
                  setHomepage((prev: any) => ({ ...prev, contact: { ...prev.contact, description: e.target.value } }))
                }
                className="font-sans text-xs px-3 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => saveModule("homepage", homepage)}
            disabled={savingModule === "homepage"}
            className="font-mono text-[10px] uppercase tracking-widest py-2.5 bg-primary text-background rounded font-bold hover:bg-primary/95 transition-all duration-200"
          >
            {savingModule === "homepage" ? "Saving..." : "Save Content Configs"}
          </button>
        </div>
      </div>
    </div>
  );
}
