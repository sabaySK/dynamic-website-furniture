import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

/**
 * Payload to send when creating a contact message
 */
export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  [key: string]: any;
}

/**
 * Response shape from the API - keep generic to accept wrapped or unwrapped responses
 */
export type ContactMessageResponse = any;

const CONTACT_MESSAGES_ENDPOINT = "/websites/contact-messages";

/**
 * Send a contact message to the backend.
 * The apiClient will handle JSON parsing and errors.
 */
export const sendContactMessage = async (
  payload: ContactMessagePayload,
  config?: RequestConfig
): Promise<ContactMessageResponse> => {
  return apiClient.post<ContactMessageResponse>(CONTACT_MESSAGES_ENDPOINT, payload, {
    // contact messages are public endpoints — don't send auth headers by default
    skipAuth: true,
    ...(config ?? {}),
  });
};

export default {
  sendContactMessage,
};

