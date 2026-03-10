// Circuit Breaker — prevents cascading failures from external API calls
import { createLogger } from './logger.js';
const log = createLogger('circuit');

const _breakers = new Map();

const STATE = { CLOSED: 'closed', OPEN: 'open', HALF_OPEN: 'half_open' };

/**
 * Get or create a circuit breaker for a named service.
 * @param {string} name - Service name (e.g. 'nordpool', 'github', 'makerworld')
 * @param {Object} [opts]
 * @param {number} [opts.failureThreshold=5] - Failures before opening
 * @param {number} [opts.resetTimeout=60000] - ms before trying half-open
 * @param {number} [opts.successThreshold=2] - Successes in half-open to close
 * @returns {CircuitBreaker}
 */
export function getBreaker(name, opts = {}) {
  if (!_breakers.has(name)) {
    _breakers.set(name, new CircuitBreaker(name, opts));
  }
  return _breakers.get(name);
}

/**
 * Execute a function through a circuit breaker.
 * @param {string} name - Service name
 * @param {Function} fn - Async function to execute
 * @param {*} [fallback] - Value to return when circuit is open
 * @returns {Promise<*>}
 */
export async function withBreaker(name, fn, fallback = null) {
  const breaker = getBreaker(name);
  return breaker.exec(fn, fallback);
}

class CircuitBreaker {
  constructor(name, opts = {}) {
    this.name = name;
    this.state = STATE.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.failureThreshold = opts.failureThreshold || 5;
    this.resetTimeout = opts.resetTimeout || 60000;
    this.successThreshold = opts.successThreshold || 2;
    this._nextAttempt = 0;
    this._lastError = null;
  }

  async exec(fn, fallback = null) {
    if (this.state === STATE.OPEN) {
      if (Date.now() < this._nextAttempt) {
        log.debug(`${this.name}: circuit open, returning fallback`);
        return fallback;
      }
      // Try half-open
      this.state = STATE.HALF_OPEN;
      log.info(`${this.name}: circuit half-open, testing...`);
    }

    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (err) {
      this._onFailure(err);
      return fallback;
    }
  }

  _onSuccess() {
    if (this.state === STATE.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = STATE.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        log.info(`${this.name}: circuit closed (recovered)`);
      }
    } else {
      this.failureCount = 0;
    }
  }

  _onFailure(err) {
    this._lastError = err;
    this.failureCount++;
    this.successCount = 0;

    if (this.state === STATE.HALF_OPEN || this.failureCount >= this.failureThreshold) {
      this.state = STATE.OPEN;
      this._nextAttempt = Date.now() + this.resetTimeout;
      log.warn(`${this.name}: circuit opened after ${this.failureCount} failures`, err.message);
    } else {
      log.debug(`${this.name}: failure ${this.failureCount}/${this.failureThreshold}`, err.message);
    }
  }

  getStatus() {
    return {
      name: this.name,
      state: this.state,
      failures: this.failureCount,
      lastError: this._lastError?.message || null
    };
  }
}

/**
 * Get status of all circuit breakers.
 * @returns {Array<Object>}
 */
export function getAllBreakerStatus() {
  return [..._breakers.values()].map(b => b.getStatus());
}
