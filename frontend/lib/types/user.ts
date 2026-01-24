export type User = {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    banned: boolean | null;
    role?: string | null;
    banReason?: string | null;
    banExpires?: Date | null;
    stripeCustomerId?: string | null;
  };