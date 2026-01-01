// Circuit breaker pattern for resilient API calls with automatic fallback

export class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    
    // Configuration
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 60000; // ms
    this.resetTimeout = options.resetTimeout || 30000; // ms
  }

  // Execute function with circuit breaker protection
  async execute(fn, fallback = null) {
    if (this.state === 'OPEN') {
      // Check if timeout has passed to attempt recovery
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.log(`🔵 ${this.name} Circuit: Attempting recovery (HALF_OPEN)`);
      } else {
        // Circuit is open, use fallback
        console.warn(`🔴 ${this.name} Circuit: OPEN - Using fallback`);
        return fallback !== null ? fallback() : null;
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Circuit breaker timeout')), this.timeout)
        )
      ]);

      // Success
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      console.error(`❌ ${this.name} Circuit Breaker Error:`, error.message);

      if (this.state === 'OPEN' && fallback) {
        return fallback();
      }
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log(`✅ ${this.name} Circuit: CLOSED (recovered)`);
      }
    }
  }

  onFailure() {
    this.lastFailureTime = Date.now();
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold && this.state === 'CLOSED') {
      this.state = 'OPEN';
      console.warn(`🔴 ${this.name} Circuit: OPEN (failure threshold exceeded)`);
    }
  }

  // Get circuit status
  getStatus() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailure: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null
    };
  }

  // Reset circuit manually
  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    console.log(`↻ ${this.name} Circuit: Reset`);
  }
}

// Request retry mechanism with exponential backoff
export class RetryManager {
  constructor(maxRetries = 3, baseDelay = 100) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  async execute(fn, context = '') {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on 4xx errors (client errors)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }

        if (attempt < this.maxRetries) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          const jitter = Math.random() * delay * 0.1; // Add 10% jitter
          console.warn(`⚠️ Retry ${context} (attempt ${attempt + 1}/${this.maxRetries}) after ${delay + jitter}ms`);
          await new Promise(resolve => setTimeout(resolve, delay + jitter));
        }
      }
    }

    throw lastError;
  }
}

// Health check utility
export class HealthChecker {
  constructor(options = {}) {
    this.checks = new Map();
    this.interval = options.interval || 30000; // 30 seconds
    this.retryInterval = null;
  }

  registerCheck(name, fn) {
    this.checks.set(name, { fn, lastStatus: 'UNKNOWN', lastCheck: null });
  }

  async runChecks() {
    const results = {};

    for (const [name, check] of this.checks.entries()) {
      try {
        const startTime = Date.now();
        await Promise.race([
          check.fn(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Health check timeout')), 3000)
          )
        ]);
        
        check.lastStatus = 'HEALTHY';
        check.lastCheck = Date.now();
        results[name] = {
          status: 'HEALTHY',
          responseTime: Date.now() - startTime
        };
      } catch (error) {
        check.lastStatus = 'UNHEALTHY';
        check.lastCheck = Date.now();
        results[name] = {
          status: 'UNHEALTHY',
          error: error.message
        };
      }
    }

    return results;
  }

  getStatus() {
    const status = {};
    for (const [name, check] of this.checks.entries()) {
      status[name] = {
        status: check.lastStatus,
        lastCheck: check.lastCheck ? new Date(check.lastCheck).toISOString() : null
      };
    }
    return status;
  }

  startPeriodic() {
    this.retryInterval = setInterval(() => {
      this.runChecks();
    }, this.interval);
  }

  stopPeriodic() {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
    }
  }
}
