import * as Sentry from '@sentry/nextjs';

export interface MetricData {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
}

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags?: Record<string, string>;
}

class MonitoringService {
  private metrics: Map<string, PerformanceMetric> = new Map();

  // Track custom metrics
  trackMetric(data: MetricData) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'custom_metric', {
        metric_name: data.name,
        value: data.value,
        unit: data.unit,
        ...data.tags,
      });
    }

    // Send to Sentry
    Sentry.addBreadcrumb({
      message: `Metric: ${data.name}`,
      category: 'metric',
      level: 'info',
      data: {
        value: data.value,
        unit: data.unit,
        ...data.tags,
      },
    });
  }

  // Start performance timing
  startTimer(name: string, tags?: Record<string, string>) {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      tags,
    });
  }

  // End performance timing
  endTimer(name: string) {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Timer ${name} was not started`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Track the performance metric
    this.trackMetric({
      name: `performance.${name}`,
      value: duration,
      unit: 'ms',
      tags: metric.tags,
    });

    // Log slow operations
    if (duration > 1000) {
      Sentry.captureMessage(`Slow operation: ${name} took ${duration}ms`, 'warning');
    }

    this.metrics.delete(name);
    return duration;
  }

  // Track user interactions
  trackInteraction(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    Sentry.addBreadcrumb({
      message: `User interaction: ${action}`,
      category: 'ui.click',
      level: 'info',
      data: {
        category,
        label,
        value,
      },
    });
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }

    Sentry.addBreadcrumb({
      message: `Page view: ${path}`,
      category: 'navigation',
      level: 'info',
      data: {
        path,
        title,
      },
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    console.error('Tracked error:', error);
    
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        ...context,
      });
    }
  }

  // Track API calls
  async trackApiCall<T>(
    url: string,
    method: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const timerName = `api.${method}.${new URL(url, 'http://localhost').pathname}`;
    
    this.startTimer(timerName, { method, url });
    
    try {
      const result = await fn();
      this.endTimer(timerName);
      return result;
    } catch (error) {
      this.endTimer(timerName);
      
      Sentry.captureException(error, {
        tags: {
          api_url: url,
          api_method: method,
        },
      });
      
      throw error;
    }
  }

  // Track Web Vitals
  trackWebVitals(metric: any) {
    const { name, value, rating, delta, id } = metric;
    
    this.trackMetric({
      name: `web_vitals.${name}`,
      value,
      tags: {
        rating,
        id,
      },
    });

    // Log poor performance
    if (rating === 'poor') {
      Sentry.captureMessage(`Poor Web Vital: ${name} = ${value}`, 'warning');
    }
  }

  // Set user context for error tracking
  setUser(user: { id: string; email?: string; username?: string }) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  // Clear user context
  clearUser() {
    Sentry.setUser(null);
  }

  // Add custom context
  setContext(key: string, context: Record<string, any>) {
    Sentry.setContext(key, context);
  }

  // Track conversion events
  trackConversion(conversionType: string, value?: number, currency?: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: process.env.NEXT_PUBLIC_GA_CONVERSION_ID,
        value: value,
        currency: currency || 'EUR',
        conversion_type: conversionType,
      });
    }

    this.trackMetric({
      name: `conversion.${conversionType}`,
      value: value || 1,
      tags: {
        currency: currency || 'EUR',
      },
    });
  }
}

// Global instance
const monitoring = new MonitoringService();

// Export service
export default monitoring;

// Export types for window
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}