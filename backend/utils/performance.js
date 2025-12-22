// Performance monitoring and metrics collection

export class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.maxMetrics = 10000;
    this.slowQueryThreshold = 100; // ms
  }

  // Record request metrics
  recordRequest(endpoint, method, responseTime, statusCode, requestSize, responseSize) {
    const metric = {
      endpoint,
      method,
      responseTime,
      statusCode,
      requestSize,
      responseSize,
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Keep only recent metrics to prevent memory bloat
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow queries
    if (responseTime > this.slowQueryThreshold) {
      console.warn(`⚠️ SLOW QUERY: ${method} ${endpoint} (${responseTime}ms)`);
    }

    return metric;
  }

  // Get performance statistics
  getStats(lastNMinutes = 60) {
    const cutoffTime = Date.now() - (lastNMinutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoffTime);

    if (recentMetrics.length === 0) {
      return { message: 'No metrics available' };
    }

    const responseTimes = recentMetrics.map(m => m.responseTime);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    const p95ResponseTime = this.percentile(responseTimes, 0.95);
    const p99ResponseTime = this.percentile(responseTimes, 0.99);

    const avgRequestSize = recentMetrics.reduce((a, b) => a + b.requestSize, 0) / recentMetrics.length;
    const avgResponseSize = recentMetrics.reduce((a, b) => a + b.responseSize, 0) / recentMetrics.length;

    // Errors (4xx, 5xx)
    const errors = recentMetrics.filter(m => m.statusCode >= 400);
    const errorRate = ((errors.length / recentMetrics.length) * 100).toFixed(2);

    // Group by endpoint
    const byEndpoint = {};
    recentMetrics.forEach(m => {
      if (!byEndpoint[m.endpoint]) {
        byEndpoint[m.endpoint] = { count: 0, totalTime: 0, errors: 0 };
      }
      byEndpoint[m.endpoint].count++;
      byEndpoint[m.endpoint].totalTime += m.responseTime;
      if (m.statusCode >= 400) byEndpoint[m.endpoint].errors++;
    });

    const topEndpoints = Object.entries(byEndpoint)
      .sort((a, b) => b[1].totalTime - a[1].totalTime)
      .slice(0, 10)
      .map(([endpoint, stats]) => ({
        endpoint,
        avgTime: (stats.totalTime / stats.count).toFixed(2),
        totalRequests: stats.count,
        errors: stats.errors
      }));

    return {
      timeRange: `${lastNMinutes} minutes`,
      totalRequests: recentMetrics.length,
      avgResponseTime: avgResponseTime.toFixed(2),
      minResponseTime,
      maxResponseTime,
      p95ResponseTime: p95ResponseTime.toFixed(2),
      p99ResponseTime: p99ResponseTime.toFixed(2),
      avgRequestSize: avgRequestSize.toFixed(0),
      avgResponseSize: avgResponseSize.toFixed(0),
      errorRate: `${errorRate}%`,
      topEndpoints
    };
  }

  // Calculate percentile
  percentile(arr, p) {
    if (arr.length === 0) return 0;
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }

  // Get slow queries
  getSlowQueries(limit = 20) {
    return this.metrics
      .filter(m => m.responseTime > this.slowQueryThreshold)
      .sort((a, b) => b.responseTime - a.responseTime)
      .slice(0, limit);
  }

  // Reset metrics
  reset() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Simplified middleware to track performance (no circular reference issues)
export function performanceTrackerMiddleware(monitor) {
  return (req, res, next) => {
    if (!monitor) return next();
    
    const startHrTime = process.hrtime();
    let requestSize = 0;
    
    // Safely estimate request size
    try {
      if (req.body && typeof req.body === 'object') {
        try {
          requestSize = JSON.stringify(req.body).length;
        } catch (e) {
          requestSize = 0;
        }
      }
      requestSize += (req.url || '').length + 200; // Add overhead for headers
    } catch (error) {
      // Silently ignore size calculation errors
    }

    // Store original json function
    const originalJson = res.json;
    
    // Override json function
    res.json = function(data) {
      try {
        // Calculate response time
        const endHrTime = process.hrtime(startHrTime);
        const responseTime = endHrTime[0] * 1000 + endHrTime[1] / 1000000;
        
        let responseSize = 0;
        try {
          if (data && typeof data === 'object') {
            responseSize = JSON.stringify(data).length;
          }
        } catch (e) {
          responseSize = 0;
        }

        // Safely record the metric
        try {
          monitor.recordRequest(
            req.path || req.url || 'unknown',
            req.method || 'GET',
            Math.round(responseTime),
            res.statusCode || 200,
            requestSize,
            responseSize
          );
        } catch (recordError) {
          // Silently fail if recording doesn't work
        }
      } catch (error) {
        // Silently fail - don't interrupt the request
      }

      // Call the original json function
      return originalJson.call(this, data);
    };

    next();
  };
}
