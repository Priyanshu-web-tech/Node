import prisma from "../db/db.config.js";

export const fetchComments = async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      post: true,
    },
  });

  return res.status(200).json({ status: 200, data: comments });
};

export const showComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  return res.status(200).json({ status: 200, data: comment });
};

export const createComment = async (req, res) => {
  const { user_id, post_id, comment } = req.body;

  //* increase the comment counter
  await prisma.post.update({
    where: {
      id: Number(post_id),
    },
    data: {
      comment_count: {
        increment: 1,
      },
    },
  });

  const newComment = await prisma.comment.create({
    data: {
      user_id: Number(user_id),
      post_id: Number(post_id),
      comment,
    },
  });

  return res.status(201).json({
    status: 201,
    message: "Comment Created Successfully",
    data: newComment,
  });
};
//* Update User
export const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { user_id, post_id, comment } = req.body;

  await prisma.comment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      user_id: Number(user_id),
      post_id: Number(post_id),
      comment,
    },
  });

  return res
    .status(200)
    .json({ status: 200, message: "Comment Updated Successfully" });
};

export const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;

  //* decrease the comment counter
  await prisma.post.update({
    where: {
      id: Number(post_id),
    },
    data: {
      comment_count: {
        decrement: 1,
      },
    },
  });

  await prisma.comment.delete({
    where: {
      id: Number(commentId),
    },
  });

  return res
    .status(200)
    .json({ status: 200, message: "Comment Deleted Successfully" });
};
