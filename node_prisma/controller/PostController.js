import prisma from "../db/db.config.js";

export const fetchPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      Comment: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return res.status(200).json({ status: 200, data: posts });
};

export const showPost = async (req, res) => {
  const { id: userId } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(userId),
    },
  });

  return res.status(200).json({ status: 200, data: post });
};

export const createPost = async (req, res) => {
  const { user_id, title, description } = req.body;

  const newPost = await prisma.post.create({
    data: {
      user_id: Number(user_id),
      title,
      description,
    },
  });

  return res
    .status(201)
    .json({ status: 201, message: "Post Created Successfully", data: newPost });
};
//* Update User
export const updatePost = async (req, res) => {
  const { id: userId } = req.params;
  const { user_id, title, description } = req.body;

  await prisma.post.update({
    where: {
      id: Number(userId),
    },
    data: {
      user_id: Number(user_id),
      title,
      description,
    },
  });

  return res
    .status(200)
    .json({ status: 200, message: "Post Updated Successfully" });
};

export const deletePost = async (req, res) => {
  const { id: userId } = req.params;

  await prisma.post.delete({
    where: {
      id: Number(userId),
    },
  });

  return res
    .status(200)
    .json({ status: 200, message: "Post Deleted Successfully" });
};

export const searchPost = async (req, res) => {
  const query = req.query.q;
  const posts = await prisma.post.findMany({
    where: {
      description: {
        search: query,
      },
    },
  });

  return res.status(200).json({ status: 200, data: posts });
};
