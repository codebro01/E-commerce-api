const createTokenUser = (user) => {
    return {username: user.username, email: user.email, role: user.role, userID: user._id};
}

export default createTokenUser;