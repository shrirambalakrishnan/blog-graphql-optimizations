const DataLoader = require('dataloader');

const { Post, Comment } = require("../../models")

const postsLoader = new DataLoader( async (userIds) => {
  let posts = await Post.findAll( { where: { userId: userIds } } );

  let postsGroupedByUser = userIds.map ( userId => {
    return posts.filter( post => post.userId == userId );
  });

  return postsGroupedByUser;
})

const commentsLoader = new DataLoader( async (postIds) => {
  let comments = await Comment.findAll( { where: { postId: postIds } } );

  let commentsGroupedbyPost = postIds.map ( postId => {
    return comments.filter( comment => comment.postId == postId );
  });

  return commentsGroupedbyPost;
})

module.exports = {
  postsLoader,
  commentsLoader,
}
