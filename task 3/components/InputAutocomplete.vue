<template>
  <div class="autocomplete">
    <label class="autocomplete_label" for="url"
      >Enter the full path to the repository as
      'https://github.com/owner/repository' or in the format “user/repository”
      or “org/repository”:</label>
    <input
      id="url"
      type="text"
      v-model="url"
      @input="checkUrl(url)"
      autocomplete="off"
    />
    <Autocompete
      :items="autocompleteItem"
      :choose-value="chooseValue"
      v-if="autocomplete"
      :key="complete"
    />
  </div>
</template>

<script>
import Autocompete from '@/components/Autocompete'
import { handlerEvent } from '@/handlerEvent'
export default {
  name: 'InputAutocomplete',
  components: { Autocompete },
  props: {
    changeDisable: { type: Function }
  },
  data() {
    return {
      url: null,
      link: false,
      request: {
        owner: null,
        repo: null
      },
      regExpLink: /^(https:\/\/github.com\/[\w+\d+\-&.]*\/[\w+\d+\-&.]*)/im,
      regExpUrl: /(^[\w+\d+\-&.]*\/+[\w+\d+\-&.]*)+$/im,
      isValid: false,
      autocompleteItem: [],
      autocomplete: false,
      complete: 0
    }
  },
  methods: {
    checkUrl(url) {
      if (url) {
        this.autocomplete = true
        const link = this.isLink(url)
        if (this.checkRegExpLink && link) {
          const newUrl = url.split('/')
          this.request.repo = newUrl[newUrl.length - 1]
          this.$store.dispatch('setSearch', {
            owner: newUrl[newUrl.length - 2],
            repo: newUrl[newUrl.length - 1]
          })
          this.request.owner = newUrl[newUrl.length - 2]
          this.isValid = true
          this.changeDisable(false)
        } else if (!link && this.checkRegExpUrl) {
          let [owner, repo] = url.split('/')
          this.request.owner = owner
          this.request.repo = repo
          if (this.$store.getters.getSearch.owner !== this.request.owner) {
            this.$store.dispatch('setSearch', {
              owner,
              repo
            })
            this.isValid = true
            this.changeDisable(false)
            this.$store.dispatch('setRepos')
          }
          if (!this.getReposFilter(repo).length) {
            this.autocomplete = false
          }
          this.autocompleteItem = this.getReposFilter(repo)
          this.complete++
        } else if (!this.checkRegExpLink || !this.checkRegExpUrl) {
          this.isValid = false
          this.changeDisable(true)
          if (!this.getAllUsers.length) {
            this.complete++
            this.$store.dispatch('setAutocomplete')
          }
          let [owner, repo] = url.split('/')
          if (!repo) {
            if (!this.getAllUsersFilter(owner).length) {
              this.autocomplete = false
            }
            this.autocompleteItem = this.getAllUsersFilter(owner)
            this.complete++
          } else {
            if (!this.getRepos.length) {
              this.$store.dispatch('setRepos')
              this.complete++
            }
            if (!this.getReposFilter(repo).length) {
              this.autocomplete = false
            }
            this.autocompleteItem = this.getReposFilter(repo)
            this.complete++
          }
        }
      } else {
        this.isValid = false
        this.changeDisable(true)
        this.autocomplete = false
        this.request.owner = null
        this.request.repo = null
      }
    },
    isLink(url) {
      if (url.includes('https')) {
        return true
      } else {
        return false
      }
    },
    chooseValue(value) {
      if (!this.request.owner) {
        this.url = `${value}/`
        this.request.owner = value
      } else {
        this.url = `${this.request.owner}/${value}`
        let [owner, repo] = this.url.split('/')
        this.$store.dispatch('setSearch', {
          owner,
          repo
        })
      }
      this.autocomplete = false
    }
  },
  computed: {
    checkRegExpUrl() {
      return this.regExpUrl.test(this.url)
    },
    checkRegExpLink() {
      return this.regExpLink.test(this.url)
    },
    getAllUsersFilter() {
      return (value) => {
        this.complete++
        return this.getAllUsers.filter((item) =>
          item.trim().toLowerCase().includes(value.trim().toLowerCase())
        )
      }
    },
    getAllUsers() {
      return this.$store.getters.getUsers
    },
    getRepos() {
      return this.$store.getters.getRepos
    },
    getReposFilter() {
      return (value) => {
        this.complete++
        return this.getRepos.filter((item) =>
          item.trim().toLowerCase().includes(value.trim().toLowerCase())
        )
      }
    }
  },
  mounted() {
    handlerEvent.$on('closeauto', () => {
      this.autocomplete = false
    })
    handlerEvent.$on('clearstate', () => {
      this.url = null
      ;(this.link = false),
        (this.request = {
          owner: null,
          repo: null
        })
      this.isValid = false
      this.autocompleteItem = []
      this.autocomplete = false
      this.complete = 0
    })
  }
}
</script>

<style scoped lang="scss">
.autocomplete {
  display: flex;
  flex-direction: column;
  &_label {
    font-size: 14px;
    margin-bottom: 15px;
  }
  input {
    width: 100%;
    align-self: center;
    height: 30px;
    outline: none;
    font-size: 20px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 20px;
  }
}
</style>
