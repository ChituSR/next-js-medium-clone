import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Banner from '../components/Banner'
import Header from '../components/Header'
import {sanityClient, urlFor} from '../sanity'
import { Post } from '../typings'

interface Props{
  posts:[Post];
}
export default function Home({posts}:Props){
  console.log(posts)
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Create Next App - Medium 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
        <Banner></Banner> 

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post)=>(
         
          <Link key={post._id} href={`/post/${post.PostPath.current}`} passHref>
            <div className="border rounded-lg group cursor-pointer overflow-hidden">
            <img  className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} alt=""></img>
            <div className='flex justify-between p-5 bg-white'>
              <div>
                <p className='text-lg font-bold'>{post.title}</p>
                <p className='text-xs'>{post.description} by {post.title}</p>
              </div>
              <img className='h-12 w-12 rounded-full' src='{urlFor(post.author.image).url()!}' alt=""></img>
            </div>
            </div>      
          </Link>
        ))}
      </div>

    </div>
  )
}


export const getServerSideProps=async()=>{
  const query=`*[_type=="post"]{
    _id,
    title,
    author->{
    name, image
  },
  description,
  mainImage,
  PostPath
  }`
  const posts= await sanityClient.fetch(query)
    return{
      props: {posts},
    }
  
}
