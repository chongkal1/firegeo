import { z } from 'zod';

// Domain validation schema
const domainSchema = z.string()
  .min(1, 'Domain is required')
  .max(253, 'Domain is too long')
  .refine((domain) => {
    // Remove protocol and www prefix for validation
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .toLowerCase();
    
    // Basic domain format validation
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    
    return domainRegex.test(cleanDomain);
  }, 'Please enter a valid domain (e.g., example.com)')
  .refine((domain) => {
    // Ensure it has at least one dot (TLD)
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');
    
    return cleanDomain.includes('.');
  }, 'Domain must include a top-level domain (e.g., .com, .org)')
  .refine((domain) => {
    // Check for common invalid patterns
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');
    
    const invalidPatterns = [
      /^\./,           // starts with dot
      /\.$/,           // ends with dot
      /\.\./,          // consecutive dots
      /^-/,            // starts with hyphen
      /-$/,            // ends with hyphen
      /[^a-zA-Z0-9.-]/ // invalid characters
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(cleanDomain));
  }, 'Domain contains invalid characters or format');

// Brand analysis request schema
export const brandAnalysisRequestSchema = z.object({
  brand: domainSchema,
  competitors: z.array(domainSchema)
    .max(10, 'Maximum 10 competitors allowed')
    .optional()
    .default([])
});

// Validation result types
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export interface DomainValidationResult {
  isValid: boolean;
  cleanDomain: string;
  errors: string[];
}

// Domain validation function
export function validateDomain(domain: string): DomainValidationResult {
  try {
    // Clean and normalize the domain
    const cleanDomain = domain
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .toLowerCase();

    // Validate using schema
    domainSchema.parse(domain);
    
    return {
      isValid: true,
      cleanDomain,
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        cleanDomain: domain,
        errors: error.errors.map(err => err.message)
      };
    }
    
    return {
      isValid: false,
      cleanDomain: domain,
      errors: ['Invalid domain format']
    };
  }
}

// Validate multiple domains
export function validateDomains(domains: string[]): ValidationResult<string[]> {
  const validDomains: string[] = [];
  const errors: string[] = [];
  
  for (const domain of domains) {
    if (!domain.trim()) continue; // Skip empty domains
    
    const result = validateDomain(domain);
    if (result.isValid) {
      validDomains.push(result.cleanDomain);
    } else {
      errors.push(`${domain}: ${result.errors.join(', ')}`);
    }
  }
  
  return {
    success: errors.length === 0,
    data: validDomains,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Validate brand analysis request
export function validateBrandAnalysisRequest(
  brand: string, 
  competitors: string[]
): ValidationResult<{ brand: string; competitors: string[] }> {
  try {
    // Validate the request
    const result = brandAnalysisRequestSchema.parse({
      brand,
      competitors: competitors.filter(c => c.trim()) // Remove empty competitors
    });
    
    // Clean domains
    const cleanBrand = brand
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .toLowerCase();
    
    const cleanCompetitors = result.competitors.map(comp =>
      comp
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .toLowerCase()
    );
    
    // Check for duplicates
    const allDomains = [cleanBrand, ...cleanCompetitors];
    const uniqueDomains = new Set(allDomains);
    
    if (uniqueDomains.size !== allDomains.length) {
      return {
        success: false,
        errors: ['Duplicate domains detected. Each domain should be unique.']
      };
    }
    
    return {
      success: true,
      data: {
        brand: cleanBrand,
        competitors: cleanCompetitors
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    
    return {
      success: false,
      errors: ['Invalid request format']
    };
  }
}

// Sanitize domain for display
export function sanitizeDomainForDisplay(domain: string): string {
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .toLowerCase()
    .trim();
}

// Check if domain is likely to be a real website
export function isDomainRealistic(domain: string): boolean {
  const cleanDomain = sanitizeDomainForDisplay(domain);
  
  // Common TLDs that suggest real websites
  const commonTlds = [
    '.com', '.org', '.net', '.edu', '.gov', '.co', '.io', '.ai',
    '.uk', '.de', '.fr', '.jp', '.cn', '.br', '.au', '.ca'
  ];
  
  return commonTlds.some(tld => cleanDomain.endsWith(tld));
}

// Rate limit validation for API requests
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
}

// Simple in-memory rate limiter (for demo purposes)
const rateLimitStore = new Map<string, { count: number; resetTime: Date }>();

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMinutes: number = 60
): RateLimitResult {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
  
  const current = rateLimitStore.get(identifier);
  
  if (!current || current.resetTime < now) {
    // Reset or initialize
    const resetTime = new Date(now.getTime() + windowMinutes * 60 * 1000);
    rateLimitStore.set(identifier, { count: 1, resetTime });
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime
    };
  }
  
  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  // Increment count
  current.count++;
  
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime
  };
}

// Error response helpers
export class VLNError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'VLNError';
  }
}

export const VLN_ERRORS = {
  INVALID_DOMAIN: 'INVALID_DOMAIN',
  DUPLICATE_DOMAINS: 'DUPLICATE_DOMAINS',
  TOO_MANY_COMPETITORS: 'TOO_MANY_COMPETITORS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  AI_PROVIDER_ERROR: 'AI_PROVIDER_ERROR',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED'
} as const;

export function createVLNError(code: keyof typeof VLN_ERRORS, message: string, statusCode?: number): VLNError {
  return new VLNError(message, VLN_ERRORS[code], statusCode);
}