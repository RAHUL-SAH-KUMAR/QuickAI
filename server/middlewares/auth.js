import { requireAuth, clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    await requireAuth()(req, res, async () => {
      const { userId } = req.auth();

      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // ✅ Fetch Clerk user
      const user = await clerkClient.users.getUser(userId);

      // ✅ Attach plan + free usage to request
      req.plan = user.privateMetadata?.plan || "free";
      req.free_usage = user.privateMetadata?.free_usage || 0;

      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};

