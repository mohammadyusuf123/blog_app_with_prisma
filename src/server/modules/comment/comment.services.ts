import { prisma } from "../../../lib/prisma";
import { validate as isUUID } from "uuid";

const createComment = async (payload: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) => {
  const { content, postId, authorId, parentId } = payload;

  if (!isUUID(postId)) throw new Error("Invalid postId");
  if (parentId && !isUUID(parentId)) throw new Error("Invalid parentId");

  // Ensure parent exists
  if (parentId) {
    const parent = await prisma.comments.findUnique({
      where: { id: parentId },
      select: { id: true },
    });
    if (!parent) throw new Error("Parent comment not found");
  }

  const data = {
    content,
    postId,
    authorId,
    ...(parentId && { parentId }),
  };

  return prisma.comments.create({ data });
};

export const commentService = { createComment };