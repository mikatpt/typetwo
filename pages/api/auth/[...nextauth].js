import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.Email({
      server: process.env.EMAIL_SERVER_URL,
      from: process.env.EMAIL_FROM,
    }),
  ],
  database: {
    type: 'postgres',
    host: process.env.DB_URL || 'localhost',
    port: 5432,
    username: 'student',
    password: process.env.DB_PASS,
    database: 'typetwo',
  },
  session: { jwt: false },
  jwt: { signingKey: process.env.JWT_SIGNING_PRIVATE_KEY },
};

export default (req, res) => NextAuth(req, res, options);
