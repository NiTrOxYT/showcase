import { createAdminClient } from "@/lib/supabase/server";

export const settingsRepository = {
  async getAll() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "global")
      .single();
    
    if (error || !data) {
      // Return sensible defaults if settings row is empty
      return {
        branding: {
          brandName: "ANNEX",
          logoUrl: "/images/logo.png",
          faviconUrl: "/favicon.ico",
        },
        seo: {
          titleTemplate: "%s | ANNEX",
          defaultTitle: "ANNEX",
          defaultDescription: "Bespoke digital platforms built for scale.",
          defaultOgImage: "/images/og.jpg",
        },
        homepage: {
          hero: {
            title: "Design that earns trust before words.",
            subtitle: "Independent Digital Studio",
            description: "A bionic design studio combining raw engineering with cinematic motion to build websites your competitors wish they launched.",
          },
        },
        contact: {
          email: "hello@annex-consultancy.com",
          phone: "+91 98765 43210",
          address: "Kolkata, India",
        },
        social: {
          instagram: "https://instagram.com/annex",
          linkedin: "https://linkedin.com/company/annex",
          github: "https://github.com/annex",
          behance: "https://behance.net/annex",
        },
        footer: {
          copyrightText: "© 2026 ANNEX. All rights reserved.",
          finalClosingCopy: "We build for the web that matters.",
        },
        analytics: {
          googleAnalyticsId: "G-XXXXXXXXXX",
        },
      };
    }

    return {
      branding: {
        brandName: data.brand_name || "ANNEX",
        logoUrl: data.logo_url || "/images/logo.png",
        faviconUrl: data.favicon_url || "/favicon.ico",
      },
      seo: {
        titleTemplate: `%s | ${data.brand_name || "ANNEX"}`,
        defaultTitle: data.meta_title || data.brand_name || "ANNEX",
        defaultDescription: data.meta_description || "Bespoke digital platforms built for scale.",
        defaultOgImage: data.default_og_image || "/images/og.jpg",
      },
      homepage: {
        hero: {
          title: data.hero_title || "Design that earns trust before words.",
          subtitle: data.hero_subtitle || "Independent Digital Studio",
          description: data.hero_description || "A bionic design studio combining raw engineering with cinematic motion to build websites your competitors wish they launched.",
        },
        contact: {
          title: data.contact_title || "Let's build something exceptional.",
          description: data.contact_description || "Whether you want to discuss a new design brief, system architecture, or schedule an initial discovery call, we are here.",
        },
      },
      contact: {
        email: data.email || "hello@annex-consultancy.com",
        phone: data.phone || "+91 98765 43210",
        address: data.address || "Kolkata, India",
      },
      social: {
        instagram: data.instagram || "https://instagram.com/annex",
        linkedin: data.linkedin || "https://linkedin.com/company/annex",
        github: data.github || "https://github.com/annex",
        behance: data.behance || "https://behance.net/annex",
      },
      footer: {
        copyrightText: `© ${new Date().getFullYear()} ${data.brand_name || "ANNEX"}. All rights reserved.`,
        finalClosingCopy: data.hero_description || "We build for the web that matters.",
      },
      analytics: {
        googleAnalyticsId: data.analytics_id || "G-XXXXXXXXXX",
      },
    };
  },

  async getModule(moduleName: string) {
    const all = await this.getAll();
    return (all as any)[moduleName] || {};
  },

  async updateModule(moduleName: string, updates: any) {
    const supabase = createAdminClient();
    
    // Map updates back to columns
    const columns: any = {};
    if (moduleName === "branding") {
      if (updates.brandName !== undefined) columns.brand_name = updates.brandName;
      if (updates.logoUrl !== undefined) columns.logo_url = updates.logoUrl;
      if (updates.faviconUrl !== undefined) columns.favicon_url = updates.faviconUrl;
    } else if (moduleName === "seo") {
      if (updates.defaultTitle !== undefined) columns.meta_title = updates.defaultTitle;
      if (updates.defaultDescription !== undefined) columns.meta_description = updates.defaultDescription;
      if (updates.defaultOgImage !== undefined) columns.default_og_image = updates.defaultOgImage;
    } else if (moduleName === "homepage") {
      if (updates.hero?.title !== undefined) columns.hero_title = updates.hero.title;
      if (updates.hero?.subtitle !== undefined) columns.hero_subtitle = updates.hero.subtitle;
      if (updates.hero?.description !== undefined) columns.hero_description = updates.hero.description;
      if (updates.contact?.title !== undefined) columns.contact_title = updates.contact.title;
      if (updates.contact?.description !== undefined) columns.contact_description = updates.contact.description;
    } else if (moduleName === "contact") {
      if (updates.email !== undefined) columns.email = updates.email;
      if (updates.phone !== undefined) columns.phone = updates.phone;
      if (updates.address !== undefined) columns.address = updates.address;
    } else if (moduleName === "social") {
      if (updates.instagram !== undefined) columns.instagram = updates.instagram;
      if (updates.linkedin !== undefined) columns.linkedin = updates.linkedin;
      if (updates.github !== undefined) columns.github = updates.github;
      if (updates.behance !== undefined) columns.behance = updates.behance;
    } else if (moduleName === "analytics") {
      if (updates.googleAnalyticsId !== undefined) columns.analytics_id = updates.googleAnalyticsId;
    }

    const { data, error } = await supabase
      .from("settings")
      .update(columns)
      .eq("id", "global")
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update settings module: ${error.message}`);
    }

    return updates;
  }
};
