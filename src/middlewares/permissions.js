const { rule, shield, and, or, not } = require('graphql-shield')

// Rules
const isUser = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    let isUser = ctx.user.roles.includes('USER');
    console.log(`isUser = ${isUser}`);
    return isUser;
  }
)

// Permissions

const permissions = shield({
  CommentType: isUser,
})

module.exports = {
  permissions
};
