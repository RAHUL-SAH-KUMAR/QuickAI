// userController.js
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

// ------------------------
// Get all creations of a logged-in user
export const getUserCreations = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req.auth;

    // Fetch all creations by this user
    const creations = await sql`
      SELECT * FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      creations,
      plan,         // send plan to frontend if needed
      free_usage,   // send free usage count
    });
  } catch (error) {
    console.error("Error fetching user creations:", error);
    res.json({ success: false, message: "Failed to fetch creations" });
  }
};

// ------------------------
// Get all published creations
export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error("Error fetching published creations:", error);
    res.json({ success: false, message: "Failed to fetch published creations" });
  }
};

// ------------------------
// Toggle like/unlike a creation
export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.body;

    const [updated] = await sql`
      UPDATE creations
      SET likes = CASE
        WHEN ${userId} = ANY(likes) THEN array_remove(likes, ${userId})
        ELSE array_append(likes, ${userId})
      END
      WHERE id = ${id}
      RETURNING likes;
    `;

    if (!updated) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const liked = updated.likes.includes(userId.toString());

    res.json({
      success: true,
      message: liked ? "Creation Liked" : "Creation Unliked",
      likes: updated.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.json({ success: false, message: "Failed to toggle like" });
  }
};

// ------------------------
// Reset free usage (optional admin or daily reset)
export const resetFreeUsage = async (req, res) => {
  try {
    const { userId } = req.auth;

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { free_usage: 0 },
    });

    res.json({ success: true, message: "Free usage reset successfully" });
  } catch (error) {
    console.error("Error resetting free usage:", error);
    res.json({ success: false, message: "Failed to reset free usage" });
  }
};
