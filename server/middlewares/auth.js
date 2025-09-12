

import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Check premium plan from metadata (you must store this when upgrading via Stripe/Webhooks)
    const hasPremiumPlan = user.publicMetadata?.plan === "premium";

    // Manage free usage counter
    let freeUsage = user.privateMetadata?.free_usage ?? 0;

    if (!hasPremiumPlan) {
      req.free_usage = freeUsage;
    } else {
      // Reset free usage for premium users
      if (freeUsage !== 0) {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            ...user.privateMetadata,
            free_usage: 0,
          },
        });
      }
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
