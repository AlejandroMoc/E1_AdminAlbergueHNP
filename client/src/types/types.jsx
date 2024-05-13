export const AuthResponse = {
  body: {
    user: {
      _id: "",
      username: ""
    },
    accessToken: "",
    refreshToken: ""
  }
};

export const AuthResponseError = {
  body: {
    error: ""
  }
};

export const User = {
  _id: "",
  username: ""
};

export const AccessTokenResponse = {
  statusCode: 0,
  body: {
    accessToken: ""
  },
  error: ""
};