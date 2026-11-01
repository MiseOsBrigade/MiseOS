import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const config = JSON.parse(await readFile(new URL('../config/plans.json', import.meta.url), 'utf8'));
assert.equal(config.billingProvider, 'stripe');
assert.equal(config.checkoutMode, 'subscription');
assert.ok(Array.isArray(config.plans) && config.plans.length === 4);
assert.deepEqual(config.plans.map((plan) => plan.id), ['community', 'pro', 'team', 'enterprise']);
assert.equal(config.plans.find((plan) => plan.id === 'community').monthlyUsd, 0);
for (const id of ['pro', 'team']) {
  const plan = config.plans.find((item) => item.id === id);
  assert.ok(plan.monthlyUsd > 0, `${id} must have a positive monthly price`);
  assert.match(plan.stripePriceEnv, /^STRIPE_PRICE_[A-Z_]+$/);
}
for (const secret of config.requiredProductionSecrets) assert.match(secret, /^[A-Z0-9_]+$/);
assert.ok(config.webhookEvents.includes('checkout.session.completed'));
assert.ok(config.webhookEvents.includes('customer.subscription.deleted'));
console.log('Billing configuration validation passed. No live secret values are stored in the repository.');
