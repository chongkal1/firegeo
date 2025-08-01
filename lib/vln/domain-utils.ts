/**
 * Domain validation and utility functions for VLN
 */

export function validateDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') {
    return false;
  }

  try {
    // Clean the domain
    let cleanDomain = domain.trim().toLowerCase();
    
    // Remove protocol if present
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    
    // Remove www. if present
    cleanDomain = cleanDomain.replace(/^www\./, '');
    
    // Remove trailing slash
    cleanDomain = cleanDomain.replace(/\/$/, '');
    
    // Remove path if present (keep only domain)
    cleanDomain = cleanDomain.split('/')[0];
    
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!domainRegex.test(cleanDomain)) {
      return false;
    }
    
    // Must have at least one dot (domain.tld)
    if (!cleanDomain.includes('.')) {
      return false;
    }
    
    // Split into parts
    const parts = cleanDomain.split('.');
    
    // Must have at least 2 parts
    if (parts.length < 2) {
      return false;
    }
    
    // TLD must be at least 2 characters
    const tld = parts[parts.length - 1];
    if (tld.length < 2) {
      return false;
    }
    
    // Each part must not be empty
    if (parts.some(part => part.length === 0)) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export function normalizeDomain(domain: string): string {
  if (!domain) return '';
  
  let normalized = domain.trim().toLowerCase();
  
  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');
  
  // Remove www.
  normalized = normalized.replace(/^www\./, '');
  
  // Remove trailing slash and path
  normalized = normalized.split('/')[0];
  
  return normalized;
}

export function extractBrandName(domain: string): string {
  try {
    const normalized = normalizeDomain(domain);
    const parts = normalized.split('.');
    const brandPart = parts[0];
    
    // Capitalize first letter
    return brandPart.charAt(0).toUpperCase() + brandPart.slice(1);
  } catch (error) {
    return domain;
  }
}

export function generateFaviconUrl(domain: string): string {
  const normalized = normalizeDomain(domain);
  return `https://www.google.com/s2/favicons?domain=${normalized}&sz=64`;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function ensureProtocol(domain: string): string {
  const normalized = normalizeDomain(domain);
  return `https://${normalized}`;
}