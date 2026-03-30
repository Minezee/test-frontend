import api from "."

export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password, expiresInMins: 3600 }),
}
