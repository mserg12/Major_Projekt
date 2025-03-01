import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// GET ALL POSTS (Filter by city, type, price, etc.)
export const getPosts = async (req, res) => {
  const query = req.query; // Retrieve query parameters from the request

  try {
    // Fetch posts from the database with optional filters
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined, // Filter by city if provided
        type: query.type || undefined, // Filter by type if provided
        property: query.property || undefined, // Filter by property type if provided
        bedroom: parseInt(query.bedroom) || undefined, // Convert bedroom count to integer
        price: {
          gte: parseInt(query.minPrice) || undefined, // Minimum price filter
          lte: parseInt(query.maxPrice) || undefined, // Maximum price filter
        },
      },
    });

    res.status(200).json(posts); // Return filtered posts
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// GET A SINGLE POST (Includes `isSaved` status)
export const getPost = async (req, res) => {
  const id = req.params.id; // Retrieve the post ID from URL parameters

  try {
    // Fetch the post along with its details and the owner's information
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true, // Include detailed post information
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" }); // If post is not found, return 404
    }

    // Check if the user is logged in by verifying the JWT token
    const token = req.cookies?.token;
    if (!token) {
      return res.status(200).json({ ...post, isSaved: false });
    }

    // Validate JWT and check if the post is saved by the user
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        return res.status(200).json({ ...post, isSaved: false });
      }

      // Check if the post is saved by the user
      const saved = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            postId: id,
            userId: payload.id,
          },
        },
      });

      res.status(200).json({ ...post, isSaved: saved ? true : false });
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// CREATE A NEW POST
export const addPost = async (req, res) => {
  const body = req.body; // Retrieve post data from request body
  const tokenUserId = req.userId; // Get the authenticated user's ID

  try {
    // Create a new post in the database
    const newPost = await prisma.post.create({
      data: {
        ...body.postData, // Spread post data fields
        userId: tokenUserId, // Assign the logged-in user as the post creator
        postDetail: {
          create: body.postDetail, // Store additional post details
        },
      },
    });

    res.status(200).json(newPost); // Return the created post
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// UPDATE A POST (Placeholder for future implementation)
export const updatePost = async (req, res) => {
  try {
    res.status(200).json(); // Currently does nothing
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// DELETE A POST
export const deletePost = async (req, res) => {
  const id = req.params.id; // Retrieve post ID from request
  const tokenUserId = req.userId; // Get the authenticated user's ID

  try {
    // Find the post by ID
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" }); // Return 404 if post doesn't exist
    }

    // Ensure the authenticated user is the owner of the post
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" }); // Return 403 if user is not the owner
    }

    // Delete the post from the database
    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: "Post deleted" }); // Return success response
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// TOGGLE SAVING A POST (Save/Unsave)
export const savePost = async (req, res) => {
  const { postId } = req.body; // Get post ID from request body
  const tokenUserId = req.userId; // Get the authenticated user's ID

  try {
    // Check if the post is already saved by the user
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: tokenUserId,
        },
      },
    });

    if (existingSave) {
      // If already saved, remove it
      await prisma.savedPost.delete({
        where: {
          userId_postId: {
            postId,
            userId: tokenUserId,
          },
        },
      });
      return res.status(200).json({ message: "Post unsaved", isSaved: false });
    } else {
      // If not saved, add it
      await prisma.savedPost.create({
        data: {
          postId,
          userId: tokenUserId,
        },
      });
      return res.status(200).json({ message: "Post saved", isSaved: true });
    }
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).json({ message: "Failed to save post" });
  }
};
