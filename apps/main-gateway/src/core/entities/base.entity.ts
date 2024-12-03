export abstract class BaseEntity {
  id!: string;
  createdAt: Date = new Date();
  updatedAt: Date | null = null;
  deletedAt: Date | null = null;
}