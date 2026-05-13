import { z } from 'zod';
import constants from '../constant/constants.js';
import messages from '../constant/message.js';

const loginSchema = z.object({
    phoneNumber: z.string().trim().min(1, messages.phoneNumberAndPasswordRequired),
    password: z.string().min(1, messages.phoneNumberAndPasswordRequired),
});

const signUpSchema = z.object({
    name: z.string().trim().min(1, messages.signupRequiredFields),
    phoneNumber: z.string().trim().min(1, messages.signupRequiredFields),
    password: z.string().min(1, messages.signupRequiredFields),
    role: z.enum([constants.roles.admin, constants.roles.supplier], {
        error: () => ({ message: messages.invalidRole }),
    }),
});

export default {
    loginSchema,
    signUpSchema,
};
