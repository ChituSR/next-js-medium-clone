export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'Approved',
      title: 'Approved',
      type: 'boolean',
      desc: "Comments won't show on the site without approval",
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'string',
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
    },
  ],
}
