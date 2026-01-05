import { Post } from "../../../../generated/prisma/client"
import { PostWhereInput } from "../../../../generated/prisma/models"
import { prisma } from "../../../lib/prisma"

//get all posts
const getAllPosts = async (payload: {
  search: string | undefined,
  tags: string[] | undefined,
  isFeatured: boolean | undefined,
  authorId: string | undefined
  page: number,
  limit: number,
  skip: number,
  sortBy: string
  sortOrder: string 
}) => {
  const conditions: PostWhereInput[] = []

  console.log(payload.isFeatured)

  if (payload.search) {
    conditions.push({
      OR: [
        { title: { contains: payload.search, mode: "insensitive" } },
        { content: { contains: payload.search, mode: "insensitive" } }
      ]
    })
  }

  if (payload.tags && payload.tags.length > 0) {
    conditions.push({ tags: { hasEvery: payload.tags } })
  }

  // Fix: Check if isFeatured is explicitly defined (not undefined)
  if (payload.isFeatured !== undefined) {
    conditions.push({ isFeatured: payload.isFeatured })
  }

  if (payload.authorId) {
    conditions.push({ authorId: payload.authorId })
  }

  const result = await prisma.post.findMany({
    take: payload.limit,
    skip: payload.skip,
    orderBy: {
      [payload.sortBy]: payload.sortOrder
    },
    where: conditions.length > 0 ? { AND: conditions } : {}
  })
const count = await prisma.post.count({
  where: conditions.length > 0 ? { AND: conditions } : {}
})
  return{
    data: result,
    pagination:{
      page: payload.page,
      pageSize: payload.limit,
      total: count,
      limit: payload.limit
    }
  }
}

//create post
const createPost = async (
  data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId
    }
  })

  return result
}

export const postService = {
  createPost,
  getAllPosts
}