import axios from 'axios';

export const getInfo = (session) => axios.get(`${process.env.NEXT_PUBLIC_URL}/api/info/${session.user.email}`);

export const sendInfo = (session, data) => axios.post(`${process.env.NEXT_PUBLIC_URL}/api/info/${session.user.email}`, data);
