import {
  getBranches,
  getPulls,
  getRepo,
  getCommits,
  getUsers,
  getOrganizations,
  getRepos
} from '@/request'
import { formatDate } from '@/utils/utils'
export default {
  state: {
    search: {
      dateStart: null,
      dateEnd: null,
      repo: null,
      owner: null,
      branch: 'master'
    },
    branches: [],
    commits: [],
    repository: {},
    pullRequests: {
      active: [],
      closed: [],
      old: []
    },
    users: [],
    repositories: []
  },
  mutations: {
    setSearch(state, payload) {
      state.search = { ...state.search, ...payload }
    },
    setBranches(state, payload) {
      state.branches = payload
    },
    setRepository(state, payload) {
      state.repository = payload
    },
    setPullsActive(state, payload) {
      state.pullRequests.active = payload
    },
    setPullsClosed(state, payload) {
      state.pullRequests.closed = payload
    },
    setPullsOld(state, payload) {
      state.pullRequests.old = payload
    },
    setCommits(state, payload) {
      state.commits = payload
    },
    setRepositories(state, payload) {
      state.repositories = payload
    },
    setUsers(state, payload) {
      state.users = payload
    },
    clearState(state) {
      state.search = {
        dateStart: null,
        dateEnd: null,
        repo: null,
        owner: null,
        branch: 'master'
      }
      state.branches = []
      state.commits = []
      state.repository = {}
      state.pullRequests = {
        active: [],
        closed: [],
        old: []
      }
      state.users = []
      state.repositories = []
    }
  },
  actions: {
    setSearch({ commit }, payload) {
      commit('setSearch', payload)
    },
    clearState({ commit }) {
      commit('clearState')
    },
    async setBranches({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      const { owner, repo } = this.state.repo.search
      const { accessToken: token } = this.state.user.user
      try {
        const branches = await getBranches(owner, repo, token)
        commit('setBranches', branches)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
      }
    },
    async setRepository({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      const { owner, repo } = this.state.repo.search
      const { accessToken: token } = this.state.user.user
      try {
        const repository = await getRepo(owner, repo, token)
        if (repository.message === 'Not Found') {
          console.log('error', repository.message)
        } else {
          commit('setRepository', repository)
          commit('setLoading', false)
          commit('setSearch', {
            dateStart: formatDate(repository.created_at),
            dateEnd: formatDate()
          })
        }
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
      }
    },
    async setAutocomplete({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      const { accessToken: token } = this.state.user.user
      try {
        const users = await getUsers(token)
        const organizations = await getOrganizations(token)

        commit('setUsers', [
          ...users.map((item) => item.login),
          ...organizations.map((item) => item.login)
        ])
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
      }
    },
    async setRepos({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      const { owner } = this.state.repo.search
      const { accessToken: token } = this.state.user.user
      try {
        const repositories = await getRepos(owner, token)
        commit(
          'setRepositories',
          repositories.map((item) => item.name)
        )
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
      }
    },
    async setCommits({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      const { owner, repo, branch } = this.state.repo.search
      const { accessToken: token } = this.state.user.user
      try {
        const commits = await getCommits(owner, repo, token, branch)
        commit(
          'setCommits',
          commits.filter(
            ({
              commit: {
                author: { date }
              }
            }) =>
              new Date(formatDate(date)) >=
                new Date(this.state.repo.search.dateStart) &&
              new Date(formatDate(date)) <=
                new Date(this.state.repo.search.dateEnd)
          )
        )
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
      }
    },
    async setPulls({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      const { owner, repo, branch } = this.state.repo.search
      const { accessToken: token } = this.state.user.user
      try {
        const pulls = await getPulls(owner, repo, token)
        commit(
          'setPullsActive',
          pulls.filter(
            (item) =>
              item.head.ref === branch &&
              item.state === 'open' &&
              new Date(formatDate(item.created_at)) >=
                new Date(this.state.repo.search.dateStart) &&
              new Date(formatDate(item.created_at)) <=
                new Date(this.state.repo.search.dateEnd)
          )
        )
        commit(
          'setPullsClosed',
          pulls.filter(
            (item) =>
              item.head.ref === branch &&
              item.state === 'closed' &&
              new Date(item.created_at) >=
                new Date(this.state.repo.search.dateStart) &&
              new Date(item.created_at) <=
                new Date(this.state.repo.search.dateEnd)
          )
        )
        commit(
          'setPullsOld',
          this.state.repo.pullRequests.active.filter(
            (item) => (new Date() - new Date(item.created_at)) / 8.64e7 >= 30
          )
        )
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
      }
    }
  },
  getters: {
    getBranches(state) {
      return state.branches
    },
    getRepo(state) {
      return state.repository
    },
    getSearch(state) {
      return state.search
    },
    getActivePR(state) {
      return state.pullRequests.active
    },
    getClosedPR(state) {
      return state.pullRequests.closed
    },
    getOldPR(state) {
      return state.pullRequests.old
    },
    getCommits(state) {
      return state.commits
    },
    getUsers(state) {
      return state.users
    },
    getRepos(state) {
      return state.repositories
    }
  }
}
