import { BowStorage, Bow } from '../database/storage';

export class BowRepository {
  static async getAll(): Promise<Bow[]> {
    return BowStorage.getAll();
  }

  static async getById(id: number): Promise<Bow | null> {
    return BowStorage.getById(id);
  }

  static async getDefault(): Promise<Bow | null> {
    return BowStorage.getDefault();
  }

  static async create(bow: Omit<Bow, 'id' | 'createdAt'>): Promise<number> {
    return BowStorage.create(bow);
  }

  static async update(id: number, bow: Partial<Bow>): Promise<void> {
    return BowStorage.update(id, bow);
  }

  static async delete(id: number): Promise<void> {
    return BowStorage.delete(id);
  }

  static async setDefault(id: number): Promise<void> {
    return BowStorage.setDefault(id);
  }
}