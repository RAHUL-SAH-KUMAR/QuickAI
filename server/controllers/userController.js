import sql from "../configs/db.js";


/**
 * Get all creations of a logged-in user
 */
export const getUserCreations = async (req, res) => {
  try {
    // Ensure req.auth() returns userId correctly
    const { userId } = req.auth(); 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const creations = await sql`
      SELECT * 
      FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all published creations
 */
export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * 
      FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle like/unlike on a creation
 */
export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth(); 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Creation ID is required" });
    }

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.status(404).json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter(u => u !== userIdStr);
      message = 'Creation unliked';
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = 'Creation liked';
    }

    // Format array safely for PostgreSQL text[]
    const formattedArray = `{${updatedLikes.map(u => `"${u}"`).join(',')}}`;

    await sql`
      UPDATE creations
      SET likes = ${formattedArray}::text[]
      WHERE id = ${id}
    `;

    res.json({ success: true, message, likes: updatedLikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
