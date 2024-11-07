import prisma from "../db/db.config.js";

export const fetchUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      _count: {
        select: {
          Post: true,
          Comment: true,
        },
      },
    },
  });

  return res.status(200).json({ status: 200, data: users });
};

export const showUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      Post: {
        select: {
          title: true,
          comment_count: true,
        },
      },
    },
  });

  return res.status(200).json({ status: 200, data: user });
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (findUser) {
    return res.status(400).json({
      status: 400,
      message: "Email Already Taken. Please enter another email",
    });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  return res
    .status(201)
    .json({ status: 201, message: "User Created Successfully", data: newUser });
};
//* Update User
export const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const { name, email, password } = req.body;

  await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      name,
      email,
      password,
    },
  });

  return res
    .status(200)
    .json({ status: 200, message: "User Updated Successfully" });
};

export const deleteUser = async (req, res) => {
  const { id: userId } = req.params;

  await prisma.user.delete({
    where: {
      id: Number(userId),
    },
  });

  return res
    .status(200)
    .json({ status: 200, message: "User Deleted Successfully" });
};
