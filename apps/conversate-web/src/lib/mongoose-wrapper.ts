// Simple type-safe wrappers for Mongoose operations
import { Model } from 'mongoose'

export class MongooseWrapper<T> {
  constructor(private model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data as any) as T
    } catch (error) {
      throw new Error(`Failed to create document: ${error}`)
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).lean() as T | null
    } catch (error) {
      throw new Error(`Failed to find document by id: ${error}`)
    }
  }

  async find(query: Partial<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(query as any).lean() as T[]
    } catch (error) {
      throw new Error(`Failed to find documents: ${error}`)
    }
  }

  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update as any, { new: true }).lean() as T | null
    } catch (error) {
      throw new Error(`Failed to update document: ${error}`)
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id)
      return !!result
    } catch (error) {
      throw new Error(`Failed to delete document: ${error}`)
    }
  }

  async count(query: Partial<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(query as any)
    } catch (error) {
      throw new Error(`Failed to count documents: ${error}`)
    }
  }
}
