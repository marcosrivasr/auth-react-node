function getUserInfo(user) {
  return {
    username: user.username,
    name: user.name,
    id: user.id || user._id,
  };
}

module.exports = getUserInfo;
