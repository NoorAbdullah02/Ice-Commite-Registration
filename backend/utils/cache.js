// Advanced caching system with TTL, invalidation, and memory management

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttls = new Map();
    this.timers = new Map();
    this.maxSize = 50 * 1024 * 1024; // 50MB max cache
    this.currentSize = 0;
  }

  // Set cache with TTL (milliseconds)
  set(key, value, ttlMs = 30000) {
    try {
      // Estimate size (rough calculation)
      const size = JSON.stringify(value).length;
      
      // Check if adding this would exceed max size
      if (this.currentSize + size > this.maxSize) {
        this.evictLRU();
      }

      // Clear existing timer
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
      }

      // Store value
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
        hitCount: 0
      });
      this.ttls.set(key, ttlMs);
      this.currentSize += size;

      // Set auto-expiry timer
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttlMs);
      this.timers.set(key, timer);

      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Get from cache with hit tracking
  get(key) {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      entry.hitCount++;
      entry.lastAccess = Date.now();
      return entry.value;
    }
    return null;
  }

  // Check if key exists and not expired
  has(key) {
    return this.cache.has(key);
  }

  // Delete cache entry
  delete(key) {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      const size = JSON.stringify(entry.value).length;
      this.currentSize -= size;
      
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
        this.timers.delete(key);
      }
      
      this.cache.delete(key);
      this.ttls.delete(key);
      return true;
    }
    return false;
  }

  // Invalidate by pattern
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
        count++;
      }
    }
    
    return count;
  }

  // Clear all cache
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.ttls.clear();
    this.timers.clear();
    this.currentSize = 0;
  }

  // Evict Least Recently Used
  evictLRU() {
    let lruKey = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      const accessTime = entry.lastAccess || entry.timestamp;
      if (accessTime < lruTime) {
        lruTime = accessTime;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      memoryUsage: this.currentSize,
      maxSize: this.maxSize,
      utilization: ((this.currentSize / this.maxSize) * 100).toFixed(2) + '%',
      topHits: Array.from(this.cache.entries())
        .sort((a, b) => b[1].hitCount - a[1].hitCount)
        .slice(0, 10)
        .map(([key, entry]) => ({ key, hits: entry.hitCount }))
    };
  }
}

export const cacheManager = new CacheManager();

// Middleware factory for caching responses
export function cacheMiddleware(ttlMs = 30000, keyGenerator = null) {
  return (req, res, next) => {
    const cacheKey = keyGenerator ? keyGenerator(req) : `${req.method}:${req.path}`;
    
    // Check cache for GET requests only
    if (req.method === 'GET') {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return res.json({ ...cached, _cached: true });
      }
    }

    // Intercept res.json to cache response
    const originalJson = res.json;
    res.json = function(data) {
      if (req.method === 'GET' && data.success !== false) {
        cacheManager.set(cacheKey, data, ttlMs);
      }
      return originalJson.call(this, data);
    };

    next();
  };
}

// Function to warm cache with commonly accessed data
export async function warmCache(prisma) {
  try {
    // Cache total student count
    const studentCount = await prisma.student.count();
    cacheManager.set('stats:totalStudents', { count: studentCount }, 60000);

    // Cache selected students count
    const selectedCount = await prisma.student.count({ where: { selected: true } });
    cacheManager.set('stats:selectedStudents', { count: selectedCount }, 60000);

    // Cache department breakdown
    const departments = await prisma.student.groupBy({
      by: ['department'],
      _count: true
    });
    cacheManager.set('stats:departments', departments, 60000);

    console.log('✅ Cache warmed successfully');
  } catch (error) {
    console.warn('⚠️ Cache warming failed:', error.message);
  }
}
