export interface MediaFile {
  id: string;
  name: string;
  url: string;
}

// MediaRepository stub implementation
export const MediaRepository = {
  async getAll(): Promise<MediaFile[]> {
    return [];
  },

  async create(file: Omit<MediaFile, "id">): Promise<MediaFile> {
    return {
      ...file,
      id: Math.random().toString(36).substring(2, 9),
    };
  },

  async delete(id: string): Promise<boolean> {
    return true;
  },
};
