import { getRandomString } from '@/utils/utils'

const client_id = '1d02f6c42864d22ded0d'
const secret_client = '3fa9093a4cfed7722bb6cb31fc7c41e29d1046da'
const homepage_url = 'http://localhost:8080'
const state = getRandomString()

export const getAuth = async () => {
  localStorage.setItem('state', state)
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${homepage_url}&state=${state}`
  location.href = url
}

export const getToken = async (code) => {
  const url = `http://localhost:8080/login/oauth/access_token`
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')

    const body = {
      client_id,
      client_secret: secret_client,
      code
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    return response.json()
  } catch (e) {
    console.error('e', e)
  }
}
export const getUser = async (token) => {
  const url = 'http://localhost:8080/api/user'
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.error('e', e)
  }
}
export const getRepo = async (owner, repo, token) => {
  const url = `http://localhost:8080/api/repos/${owner}/${repo}`
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}
export const getBranches = async (owner, repo, token) => {
  const url = `http://localhost:8080/api/repos/${owner}/${repo}/branches`
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}
export const getPulls = async (owner, repo, token) => {
  const url = `http://localhost:8080/api/repos/${owner}/${repo}/pulls?state=all`
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}
export const getCommits = async (owner, repo, token, branch) => {
  const url = `http://localhost:8080/api/repos/${owner}/${repo}/commits?sha=${branch}`
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}
export const getRepos = async (owner, token) => {
  const url = `http://localhost:8080/api/users/${owner}/repos`
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/vnd.github.v3+json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}
export const getUsers = async (token) => {
  const url = `http://localhost:8080/api/users?per_page=100`
  const headers = new Headers()
  headers.append('Content-Type', 'application/vnd.github.v3+json')
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}
export const getOrganizations = async (token) => {
  const url = `http://localhost:8080/api/organizations?per_page=100`
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/vnd.github.v3+json')
  headers.append('Authorization', `Bearer ${token}`)
  const requestOptions = {
    method: 'GET',
    headers: headers
  }
  try {
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}
