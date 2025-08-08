import { PrismaClient, User } from '@/generated/prisma';
import prismaClient from '@/prisma';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async createUser(data: { name: string; email: string; phone: string }) {
    return this.prisma.user.create({
      data,
      include: {
        trustedBy: { include: { user: true } },
        trustedContacts: { include: { contact: true } }
      }
    });
  }

  public async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  public async updateUser(id: string, data: Partial<{ name: string; email: string; phone: string }>): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  public async deleteUser(id: string): Promise<User | null> {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}

export const userRepository = new UserRepository(prismaClient);
