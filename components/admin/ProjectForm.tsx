"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { z } from "zod";
import type { Project, Technology, GalleryItem } from "@/types/project";
import { Heading } from "@/components/typography/Heading";
import { Plus, Trash2, ChevronRight } from "lucide-react";

// Centralized Validation Schema
const technologySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  website: z.string().optional(),
});

const galleryItemSchema = z.object({
  id: z.string(),
  image: z.string().min(1, "Image URL is required"),
  alt: z.string().min(1, "Alt is required"),
  device: z.enum(["desktop", "laptop", "tablet", "mobile", "browser"]),
  title: z.string().min(1, "Title is required"),
  order: z.number().int().min(1),
});

const projectFormSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  subtitle: z.string().min(2, "Subtitle is too short"),
  slug: z.string().min(2, "Slug must be valid"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  client: z.string().min(1, "Client is required"),
  industry: z.string().min(1, "Industry is required"),
  shortDescription: z.string().min(10, "Short description is too short"),
  fullDescription: z.string().min(10, "Full description is too short"),
  completionDate: z.string().min(10, "Completion date is required"),
  status: z.enum(["Draft", "Published"]),
  featured: z.boolean(),
  featuredOrder: z.number().int().optional(),
  order: z.number().int().min(1),
  platform: z.string().min(1),
  duration: z.string().optional(),
  teamSize: z.number().int().min(1).optional(),
  services: z.array(z.string()),
  deliverables: z.array(z.string()),
  technologies: z.array(technologySchema),
  gallery: z.array(galleryItemSchema),
  coverImage: z.string().min(1, "Cover image is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  testimonial: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
  }).optional(),
});

interface ProjectFormProps {
  initialData?: Project;
  availableTechnologies: Technology[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({
  initialData,
  availableTechnologies,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize fields
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Website",
    type: initialData?.type || "Website",
    client: initialData?.client || "",
    industry: initialData?.industry || "",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    completionDate: initialData?.completionDate || "",
    status: initialData?.status || "Draft",
    featured: initialData?.featured || false,
    featuredOrder: initialData?.featuredOrder || 1,
    order: initialData?.order || 1,
    platform: initialData?.platform || "Web",
    duration: initialData?.duration || "",
    teamSize: initialData?.teamSize || 1,
    coverImage: initialData?.coverImage || "",
    thumbnail: initialData?.thumbnail || "",
    liveUrl: initialData?.liveUrl || "",
    githubUrl: initialData?.githubUrl || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    ogImage: initialData?.ogImage || "",
  });

  const [servicesText, setServicesText] = useState(initialData?.services?.join(", ") || "");
  const [deliverablesText, setDeliverablesText] = useState(initialData?.deliverables?.join(", ") || "");
  const [testimonial, setTestimonial] = useState({
    quote: initialData?.testimonial?.quote || "",
    author: initialData?.testimonial?.author || "",
    role: initialData?.testimonial?.role || "",
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(initialData?.gallery || []);
  const [selectedTech, setSelectedTech] = useState<Technology[]>(initialData?.technologies || []);

  const [newTech, setNewTech] = useState({ name: "", category: "", website: "" });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    folder: "projects" | "gallery" | "logos" | "uploads" = "projects"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    const result = await uploadImage(supabaseClient, file, folder);

    if (!result.ok) {
      alert(result.error);
      setUploadingField(null);
      return;
    }

    const publicUrl = result.publicUrl!;

    if (fieldName === "coverImage" || fieldName === "thumbnail" || fieldName === "ogImage") {
      setFormData((prev) => ({ ...prev, [fieldName]: publicUrl }));
    } else if (fieldName.startsWith("gallery-")) {
      const index = parseInt(fieldName.split("-")[1], 10);
      setGallery((prev) =>
        prev.map((item, idx) => (idx === index ? { ...item, image: publicUrl } : item))
      );
    }

    setUploadingField(null);
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "content", label: "Content" },
    { id: "gallery", label: "Gallery" },
    { id: "tech", label: "Technologies" },
    { id: "seo", label: "SEO & Extra" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    // Auto-generate slug from title
    if (name === "title" && !initialData) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleTechToggle = (tech: Technology) => {
    const exists = selectedTech.some((t) => t.name === tech.name);
    if (exists) {
      setSelectedTech((prev) => prev.filter((t) => t.name !== tech.name));
    } else {
      setSelectedTech((prev) => [...prev, tech]);
    }
  };

  const handleAddCustomTech = () => {
    if (newTech.name && newTech.category) {
      setSelectedTech((prev) => [...prev, { ...newTech }]);
      setNewTech({ name: "", category: "", website: "" });
    }
  };

  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      id: Math.random().toString(36).substring(2, 9),
      image: "",
      alt: "",
      device: "browser",
      title: "",
      order: gallery.length + 1,
    };
    setGallery((prev) => [...prev, newItem]);
  };

  const handleRemoveGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGalleryItemChange = (id: string, field: keyof GalleryItem, value: any) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      ...formData,
      featuredOrder: Number(formData.featuredOrder),
      order: Number(formData.order),
      teamSize: Number(formData.teamSize),
      services: servicesText.split(",").map((s) => s.trim()).filter(Boolean),
      deliverables: deliverablesText.split(",").map((d) => d.trim()).filter(Boolean),
      technologies: selectedTech,
      gallery,
      testimonial: testimonial.quote ? testimonial : undefined,
    };

    // Run schema parsing checks
    const check = projectFormSchema.safeParse(payload);
    if (!check.success) {
      const errMap: Record<string, string> = {};
      check.error.errors.forEach((err) => {
        const path = err.path.join(".");
        errMap[path] = err.message;
      });
      setErrors(errMap);
      setLoading(false);
      
      // Auto switch active view to direct visibility of error scopes
      const firstErrPath = Object.keys(errMap)[0];
      if (firstErrPath.includes("shortDescription") || firstErrPath.includes("fullDescription")) {
        setActiveTab("content");
      } else if (firstErrPath.includes("gallery")) {
        setActiveTab("gallery");
      } else if (firstErrPath.includes("technologies")) {
        setActiveTab("tech");
      } else if (firstErrPath.includes("seo") || firstErrPath.includes("testimonial")) {
        setActiveTab("seo");
      }
      return;
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error(err);
      setErrors({ form: "Operation sync failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="flex flex-col gap-8 max-w-4xl">
      {/* Header operations */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <Heading level={2} className="text-xl font-mono uppercase tracking-widest text-foreground">
            {initialData ? `Configure / ${formData.title}` : "Declare New Project"}
          </Heading>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-border rounded text-muted hover:text-foreground transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 bg-primary text-background rounded hover:bg-primary/90 font-bold transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Save Configuration"}
          </button>
        </div>
      </div>

      {errors.form && (
        <div className="bg-destructive/10 border border-destructive/20 rounded p-4 text-xs font-mono text-destructive">
          Error: {errors.form}
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-border/10 pb-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border-b-2 transition-all duration-300 ${
              activeTab === tab.id
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS VIEWS */}
      <div className="glassmorphism p-6 md:p-8 rounded-xl border border-border/40 min-h-[50vh]">
        {/* Tab 1: General fields */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Project Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
              />
              {errors.title && <span className="text-[10px] font-mono text-destructive">{errors.title}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Project Slug</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
              />
              {errors.slug && <span className="text-[10px] font-mono text-destructive">{errors.slug}</span>}
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Subtitle Line</label>
              <input
                type="text"
                name="subtitle"
                required
                value={formData.subtitle}
                onChange={handleInputChange}
                className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
              />
              {errors.subtitle && <span className="text-[10px] font-mono text-destructive">{errors.subtitle}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Category Label</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-muted focus:outline-none cursor-pointer focus:border-primary/80 w-full"
              >
                <option value="Website">Website</option>
                <option value="Web App">Web App</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Mobile App">Mobile App</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Completion Date</label>
              <input
                type="date"
                name="completionDate"
                required
                value={formData.completionDate}
                onChange={handleInputChange}
                className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Client Name</label>
              <input
                type="text"
                name="client"
                required
                value={formData.client}
                onChange={handleInputChange}
                className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Industry Sector</label>
              <input
                type="text"
                name="industry"
                required
                value={formData.industry}
                onChange={handleInputChange}
                className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Status Code</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-muted focus:outline-none cursor-pointer focus:border-primary/80 w-full"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Featured Work</label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-border bg-surface/20 focus:ring-primary/40 text-primary cursor-pointer"
                />
                <label htmlFor="featured-checkbox" className="font-mono text-[11px] text-muted cursor-pointer">
                  Feature in Homepage highlights
                </label>
              </div>
            </div>

            {formData.featured && (
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Featured Ordering Index</label>
                <input
                  type="number"
                  name="featuredOrder"
                  value={formData.featuredOrder}
                  onChange={handleInputChange}
                  className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Database Priority Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Copy content */}
        {activeTab === "content" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Short Description (1-2 sentences)</label>
              <textarea
                name="shortDescription"
                required
                rows={2}
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full resize-none"
              />
              {errors.shortDescription && <span className="text-[10px] font-mono text-destructive">{errors.shortDescription}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Full Case Study Vision (Markdown compatible)</label>
              <textarea
                name="fullDescription"
                required
                rows={8}
                value={formData.fullDescription}
                onChange={handleInputChange}
                className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full resize-y"
              />
              {errors.fullDescription && <span className="text-[10px] font-mono text-destructive">{errors.fullDescription}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Services List (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Design Strategy, Frontend Code, Optimization"
                  value={servicesText}
                  onChange={(e) => setServicesText(e.target.value)}
                  className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Deliverables List (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js App, Analytics Dashboard"
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mockups Gallery */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/10">
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60 flex justify-between items-center">
                  <span>Thumbnail Image URL</span>
                  {uploadingField === "thumbnail" && <span className="text-primary text-[9px] uppercase animate-pulse">Uploading...</span>}
                </label>
                <div className="flex gap-4 items-center">
                  {formData.thumbnail && (
                    <img src={formData.thumbnail} alt="Thumbnail Preview" className="w-12 h-12 object-cover rounded border border-border/20 bg-surface/10" />
                  )}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      name="thumbnail"
                      required
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
                    />
                    <label className="cursor-pointer flex items-center justify-center font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 bg-surface/30 border border-border/40 rounded hover:bg-surface/50 text-muted hover:text-foreground transition-all duration-300">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "thumbnail")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60 flex justify-between items-center">
                  <span>Cover Header Image URL</span>
                  {uploadingField === "coverImage" && <span className="text-primary text-[9px] uppercase animate-pulse">Uploading...</span>}
                </label>
                <div className="flex gap-4 items-center">
                  {formData.coverImage && (
                    <img src={formData.coverImage} alt="Cover Preview" className="w-12 h-12 object-cover rounded border border-border/20 bg-surface/10" />
                  )}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      name="coverImage"
                      required
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
                    />
                    <label className="cursor-pointer flex items-center justify-center font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 bg-surface/30 border border-border/40 rounded hover:bg-surface/50 text-muted hover:text-foreground transition-all duration-300">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "coverImage")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery items collection */}
            <div className="flex justify-between items-center">
              <Heading level={3} className="text-xs font-mono uppercase tracking-widest text-foreground">
                Gallery Renders List ({gallery.length})
              </Heading>
              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-border rounded text-muted hover:text-foreground hover:bg-surface/30 transition-all duration-300"
              >
                <Plus className="w-3 h-3" /> Add Image Render
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {gallery.map((item, index) => (
                <div key={item.id} className="p-5 rounded border border-border/20 bg-surface/5 flex flex-col gap-4 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryItem(item.id)}
                    className="absolute top-4 right-4 text-muted/40 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-bold">
                    [ Image Render #{index + 1} ]
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60 flex justify-between items-center">
                        <span>Image Address URL</span>
                        {uploadingField === `gallery-${index}` && <span className="text-primary text-[8px] uppercase animate-pulse">Uploading...</span>}
                      </label>
                      <div className="flex gap-3 items-center">
                        {item.image && (
                          <img src={item.image} alt="Preview" className="w-8 h-8 object-cover rounded border border-border/20 bg-surface/10" />
                        )}
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            required
                            value={item.image}
                            onChange={(e) => handleGalleryItemChange(item.id, "image", e.target.value)}
                            className="font-mono text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none w-full"
                          />
                          <label className="cursor-pointer flex items-center justify-center font-mono text-[9px] uppercase tracking-widest px-3 py-2 bg-surface/30 border border-border/40 rounded hover:bg-surface/50 text-muted hover:text-foreground transition-all duration-300">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, `gallery-${index}`)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-3 flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Device Mockup Frame</label>
                      <select
                        value={item.device}
                        onChange={(e) => handleGalleryItemChange(item.id, "device", e.target.value)}
                        className="font-mono text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-muted cursor-pointer focus:outline-none"
                      >
                        <option value="browser">Browser Window</option>
                        <option value="desktop">Desktop Stand</option>
                        <option value="laptop">Laptop Tray</option>
                        <option value="tablet">Tablet Screen</option>
                        <option value="mobile">Mobile Screen</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Priority Order</label>
                      <input
                        type="number"
                        required
                        value={item.order}
                        onChange={(e) => handleGalleryItemChange(item.id, "order", Number(e.target.value))}
                        className="font-mono text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-6 flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Title / Action caption</label>
                      <input
                        type="text"
                        required
                        value={item.title}
                        onChange={(e) => handleGalleryItemChange(item.id, "title", e.target.value)}
                        className="font-sans text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-6 flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-muted/60">Alt Description Text</label>
                      <input
                        type="text"
                        required
                        value={item.alt}
                        onChange={(e) => handleGalleryItemChange(item.id, "alt", e.target.value)}
                        className="font-sans text-xs px-3 py-2 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Tech Stack selection */}
        {activeTab === "tech" && (
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs text-muted uppercase tracking-widest border-b border-border/10 pb-2">
              Select Frameworks & Libraries
            </span>

            {/* Checkbox grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableTechnologies.map((tech) => {
                const isChecked = selectedTech.some((t) => t.name.toLowerCase() === tech.name.toLowerCase());
                return (
                  <button
                    key={tech.name}
                    type="button"
                    onClick={() => handleTechToggle(tech)}
                    className={`flex items-center gap-3 p-3.5 rounded border transition-all duration-300 text-left ${
                      isChecked
                        ? "border-primary/80 bg-primary/5 text-foreground font-bold"
                        : "border-border/30 bg-surface/5 text-muted hover:border-border hover:text-foreground"
                    }`}
                  >
                    <ChevronRight className={`w-3.5 h-3.5 text-primary ${isChecked ? "opacity-100" : "opacity-30"}`} />
                    <div className="flex flex-col">
                      <span className="font-sans text-xs">{tech.name}</span>
                      <span className="font-mono text-[9px] text-muted/50 uppercase mt-0.5">{tech.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom addition */}
            <div className="pt-6 border-t border-border/10 flex flex-col gap-4 mt-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Add Custom Library</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Library Name..."
                  value={newTech.name}
                  onChange={(e) => setNewTech((prev) => ({ ...prev, name: e.target.value }))}
                  className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Database)..."
                  value={newTech.category}
                  onChange={(e) => setNewTech((prev) => ({ ...prev, category: e.target.value }))}
                  className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTech}
                  className="font-mono text-[10px] uppercase tracking-widest py-2 bg-surface/30 hover:bg-surface/50 border border-border/40 rounded text-foreground font-bold transition-all duration-200"
                >
                  Declare Technology
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: SEO and Testimonials */}
        {activeTab === "seo" && (
          <div className="flex flex-col gap-8">
            {/* Action Anchors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border/10 pb-6">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Live Product Address</label>
                <input
                  type="text"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">GitHub Source Address</label>
                <input
                  type="text"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none focus:border-primary/80 transition-colors w-full"
                />
              </div>
            </div>

            {/* SEO configs */}
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ SEO Configurations ]</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Custom SEO Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60 flex justify-between items-center">
                    <span>OG Metadata Image URL</span>
                    {uploadingField === "ogImage" && <span className="text-primary text-[9px] uppercase animate-pulse">Uploading...</span>}
                  </label>
                  <div className="flex gap-4 items-center">
                    {formData.ogImage && (
                      <img src={formData.ogImage} alt="OG Preview" className="w-12 h-12 object-cover rounded border border-border/20 bg-surface/10" />
                    )}
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        name="ogImage"
                        value={formData.ogImage}
                        onChange={handleInputChange}
                        className="font-mono text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none w-full"
                      />
                      <label className="cursor-pointer flex items-center justify-center font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 bg-surface/30 border border-border/40 rounded hover:bg-surface/50 text-muted hover:text-foreground transition-all duration-300">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "ogImage")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Custom SEO Description</label>
                  <textarea
                    name="seoDescription"
                    rows={2}
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="pt-6 border-t border-border/10 flex flex-col gap-4">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ Client Feedback ]</span>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Quote Text</label>
                  <textarea
                    rows={3}
                    value={testimonial.quote}
                    onChange={(e) => setTestimonial((prev) => ({ ...prev, quote: e.target.value }))}
                    className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Author Name</label>
                    <input
                      type="text"
                      value={testimonial.author}
                      onChange={(e) => setTestimonial((prev) => ({ ...prev, author: e.target.value }))}
                      className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60">Author Position / Role</label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => setTestimonial((prev) => ({ ...prev, role: e.target.value }))}
                      className="font-sans text-xs px-3.5 py-2.5 bg-surface/20 border border-border/40 rounded text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
