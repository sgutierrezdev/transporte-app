import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const persona = await prisma.persona.findUnique({
          where: { email: credentials.email },
        });

        if (!persona || !persona.password) return null;
        if (persona.estado !== "ACTIVO") return null;

        const passwordValida = await bcrypt.compare(
          credentials.password,
          persona.password
        );
        if (!passwordValida) return null;

        return {
          id: persona.id,
          name: persona.nombre,
          email: persona.email ?? undefined,
          rol: persona.rol,
          empresaId: persona.empresaId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as any).rol;
        token.empresaId = (user as any).empresaId;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).rol = token.rol;
        (session.user as any).empresaId = token.empresaId;
      }
      return session;
    },
  },
};
