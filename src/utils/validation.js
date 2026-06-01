export const nameReg = /^[A-Za-z ]{3,}$/;
export const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
export const phoneReg = /^[6-9]\d{9}$/;
export const passReg = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

export const validate = (regex, value) => regex.test(value?.trim() || '');

export const validateEmail = (email) => validate(emailReg, email);
export const validatePassword = (password) => validate(passReg, password);
export const validateName = (name) => validate(nameReg, name);
export const validatePhone = (phone) => validate(phoneReg, phone);
