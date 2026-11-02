export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = 'Please provide your name.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }

  const trimmedEmail = data.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Please provide your email address.';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address (e.g., name@domain.com).';
  }

  const trimmedSubject = data.subject.trim();
  if (!trimmedSubject) {
    errors.subject = 'Please specify a subject.';
  } else if (trimmedSubject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters long.';
  }

  const trimmedMessage = data.message.trim();
  if (!trimmedMessage) {
    errors.message = 'Please provide a message.';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters so I can understand your inquiry.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function generateMailtoUrl(recipient: string, data: ContactFormData): string {
  const subject = encodeURIComponent(`[Portfolio Inquiry] ${data.subject.trim()}`);
  const body = encodeURIComponent(
    `Hello Kai,\n\n${data.message.trim()}\n\n---\nSender: ${data.name.trim()} (${data.email.trim()})`
  );
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

export function validateNewsletterEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your email address.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. dev@domain.com).' };
  }
  return { isValid: true };
}
