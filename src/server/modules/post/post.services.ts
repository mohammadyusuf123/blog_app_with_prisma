import { Post } from "../../../../generated/prisma/client" 
import { PostWhereInput } from "../../../../generated/prisma/models"
import { prisma } from "../../../lib/prisma" 

//get all posts
const getAllPosts = async(payload:{search:string | undefined,
  tags:string[] | undefined
}) => 
{ const conditions:PostWhereInput[] =[]
  if(payload.search) conditions.push({OR:[{title:{contains:payload.search as string,mode:"insensitive"}},
    {content:{contains:payload.search as string,mode:"insensitive"}}]})
  if(payload.tags) conditions.push({tags:{hasEvery:payload.tags}})
  const result = await prisma.post.findMany({
  where: {
  AND:conditions
  }
}) 
return result 
}


//create post
const createPost = async(data:Omit<Post, 'id'|'createdAt'|'updatedAt' | 'authorId'>,userId:string) => 
{ const result = await prisma.post.create({ 
  data: { ...data, 
  authorId: userId } 

}) 
return result 
}




export const postService = { createPost,
    getAllPosts
 }