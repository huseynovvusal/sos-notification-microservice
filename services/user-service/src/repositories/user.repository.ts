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

  public async userExistsWithEmailOrPassword(email: string, phone: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });

    return !!user;
  }

  public async updateUserById(id: string, data: Partial<{ name: string; email: string; phone: string }>): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  public async addTrustedContactToUserById(userId: string, contactId: string): Promise<User | null> {
    const user = await this.prisma.$transaction(async (prisma) => {
      await prisma.trustedContact.upsert({
        where: {
          userId_contactId: {
            userId,
            contactId
          }
        },
        create: {
          user: { connect: { id: userId } },
          contact: { connect: { id: contactId } }
        },
        update: {
          user: { connect: { id: userId } },
          contact: { connect: { id: contactId } }
        }
      });

      return prisma.user.findUnique({
        where: { id: userId },
        include: {
          trustedBy: { include: { user: true } },
          trustedContacts: { include: { contact: true } }
        }
      });
    });

    return user;
  }

  public async removeTrustedContactFromUserById(userId: string, contactId: string): Promise<User | null> {
    const user = await this.prisma.$transaction(async (prisma) => {
      await prisma.trustedContact.delete({
        where: {
          userId_contactId: {
            userId,
            contactId
          }
        }
      });

      return prisma.user.findUnique({
        where: { id: userId },
        include: {
          trustedBy: { include: { user: true } },
          trustedContacts: { include: { contact: true } }
        }
      });
    });

    return user;
  }

  public async deleteUser(id: string): Promise<User | null> {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}

export const userRepository = new UserRepository(prismaClient);
