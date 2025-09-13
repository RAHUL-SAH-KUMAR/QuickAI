import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    // Get user info
    const user = await clerkClient.users.getUser(userId);

    // Read plan from private metadata
    const planFromMetadata = user.privateMetadata?.plan;

    const hasPremiumPlan = planFromMetadata === 'premium';

    if (!hasPremiumPlan && user.privateMetadata?.free_usage != null) {
      req.free_usage = user.privateMetadata.free_usage;
    } else if (!hasPremiumPlan) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: 0 },
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? 'premium' : 'free';

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
