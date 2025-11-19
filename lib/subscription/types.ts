// Subscription Plan Types
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export type BillingCycle = 'monthly' | 'yearly';

// Subscription Status
export type SubscriptionStatus =
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'trialing'
    | 'incomplete';

// Plan Limits
export interface PlanLimits {
    maxProducts: number;
    maxStores: number;
    updateFrequency: 'daily' | 'hourly' | 'realtime';
    hasAdvancedAnalytics: boolean;
    hasRealtimeAlerts: boolean;
    hasApiAccess: boolean;
    hasPrioritySupport: boolean;
}

// Subscription Interface
export interface Subscription {
    id: string;
    userId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEnd?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Plan Configuration
export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
    free: {
        maxProducts: 10,
        maxStores: 1,
        updateFrequency: 'daily',
        hasAdvancedAnalytics: false,
        hasRealtimeAlerts: false,
        hasApiAccess: false,
        hasPrioritySupport: false,
    },
    pro: {
        maxProducts: 500,
        maxStores: 5,
        updateFrequency: 'hourly',
        hasAdvancedAnalytics: true,
        hasRealtimeAlerts: true,
        hasApiAccess: true,
        hasPrioritySupport: false,
    },
    enterprise: {
        maxProducts: Infinity,
        maxStores: Infinity,
        updateFrequency: 'realtime',
        hasAdvancedAnalytics: true,
        hasRealtimeAlerts: true,
        hasApiAccess: true,
        hasPrioritySupport: true,
    },
};

// Plan Pricing (in USD)
export const PLAN_PRICING: Record<SubscriptionPlan, { monthly: number; yearly: number }> = {
    free: {
        monthly: 0,
        yearly: 0,
    },
    pro: {
        monthly: 49,
        yearly: 470, // ~20% discount
    },
    enterprise: {
        monthly: 0, // Custom pricing
        yearly: 0,
    },
};

// Helper Functions
export function getPlanLimits(plan: SubscriptionPlan): PlanLimits {
    return PLAN_LIMITS[plan];
}

export function getPlanPrice(plan: SubscriptionPlan, cycle: BillingCycle): number {
    return PLAN_PRICING[plan][cycle];
}

export function canAccessFeature(
    userPlan: SubscriptionPlan,
    feature: keyof PlanLimits
): boolean {
    const limits = getPlanLimits(userPlan);
    return Boolean(limits[feature]);
}

export function isWithinLimit(
    userPlan: SubscriptionPlan,
    limitType: 'maxProducts' | 'maxStores',
    currentCount: number
): boolean {
    const limits = getPlanLimits(userPlan);
    const limit = limits[limitType];
    return limit === Infinity || currentCount < limit;
}
