import { GetStaticProps } from 'next'
import { Children, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
interface Props {
  post: Post
}
interface IFormSubmit {
  _id: string
  name: string
  email: string
  comment: string
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormSubmit>()
  const onSubmit: SubmitHandler<IFormSubmit> = async (data) => {
    fetch('/api/createComment', { method: 'POST', body: JSON.stringify(data) })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }
  console.log(post)
  return (
    <main>
      <Header></Header>
      <img
        src={urlFor(post.mainImage).url()!}
        alt=""
        className="h-40 w-full object-cover"
      ></img>
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {' '}
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src="{urlFor{post.author.image}.url()!}"
            alt=""
          ></img>
          <p className="text-sm font-extralight">
            Blog Post by {''}
            <span className="text-green-600">{post.author.name} </span>-
            Published at {''} {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />
      {submitted ? (
        <div className="max-w-2xl-mx-auto my-10 flex flex-col bg-yellow-500 py-10 text-white">
          <h3 className="text-3xl font-bold">
            {' '}
            Thank you for submitting the comments.
          </h3>
          <p>Once it is approved it will appear below!</p>
        </div>
      ) : (
        <form
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-sm text-yellow-500"> Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a Comment below!!!</h4>
          <hr className="mt-2 py-3"></hr>
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              className="shadow-border form-input outline:none mt-1 block w-full rounded py-2 px-3 ring-yellow-500 focus:ring"
              placeholder="John Test"
              {...register('name', { required: true })}
            ></input>
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              className="shadow-border form-input outline:none mt-1 block w-full rounded py-2 px-3 ring-yellow-500 focus:ring"
              placeholder="John Test"
              {...register('email', { required: true })}
            ></input>
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              className="shadow-border form-textarea outline:none mt-1 block w-full rounded py-2 px-3 ring-yellow-500 focus:ring"
              rows={8}
              placeholder="John Test"
              {...register('comment', { required: true })}
            ></textarea>
          </label>
          <div className="mx-auto flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500"> Name Field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500"> Email Field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500"> Comment Field is required</span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline text-whote cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold shadow hover:bg-yellow-400 focus:outline-none"
          ></input>
        </form>
      )}
      {/* comments */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2"></hr>

        {post.comments.map((comment) => {
          return (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}: </span>
                {comment.comment}
              </p>
            </div>
          )
        })}
      </div>
    </main>
  )
}
export default Post

export const getStaticPaths = async () => {
  const query = `*[_type=="post"]{
        _id,
        PostPath{
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  console.log(posts)
  const paths = posts.map((post: Post) => ({
    params: {
      PostPath: post.PostPath.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // console.log($PostPath);
  const query = `*[_type== "post" && PostPath.current == $PostPath][0]{
        _id,
        _createdAt,
        title,
        author->{
            name,
            image
        },
        'comments':*[_type=="comment" && post._ref==^._id && Approved==true],
        description,
        mainImage, 
        PostPath,
        body
    } `
  const post = await sanityClient.fetch(query, { PostPath: params?.PostPath })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: { post },
    revalidate: 60,
  }
}
