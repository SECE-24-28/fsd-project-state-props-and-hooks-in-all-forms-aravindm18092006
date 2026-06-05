import { GAPI } from './axios';

export const sendContactForm = async (formData) => {
  const { data } = await GAPI.post('/contact', formData);
  return data;
};
