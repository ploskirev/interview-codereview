<template>
  <div class="members">
    <div class="members_filter">
      <div
        @click="changeFilter('active')"
        :class="{ active: filter === 'active' }"
      >
        Active
      </div>
      <div
        @click="changeFilter('passive')"
        :class="{ active: filter === 'passive' }"
      >
        Passive
      </div>
    </div>

    <div class="members_head">
      <div>Github login</div>
      <div>Number of commits</div>
    </div>
    <div
      class="members_item"
      v-for="(item, i) of prepareCommits(filter)"
      :key="i"
    >
      <div>{{ item.author }}</div>
      <div>{{ item.commit }}</div>
    </div>
  </div>
</template>

<script>
import { unique } from '@/utils/utils'

export default {
  name: 'Members',
  components: {},
  data() {
    return {
      filter: 'active'
    }
  },
  computed: {
    getCommits() {
      return this.$store.getters.getCommits
    },
    prepareCommits() {
      return (value) => {
        const author = unique(
          this.getCommits.map((item) => ({ author: item.commit.author.name }))
        )
        const members = []
        author.forEach(({ author }) => {
          let commit = 1
          let member = {
            author,
            commit: commit
          }
          this.getCommits.forEach(
            (
              {
                commit: {
                  author: { name }
                }
              },
              i
            ) => {
              if (name === author) {
                member = { ...member, commit: commit++ }
                if (i === this.getCommits.length - 1) {
                  members.push(member)
                }
              }
            }
          )
        })
        members.sort((a, b) => {
          if (a.commit > b.commit) {
            return 1
          }
          if (a.commit < b.commit) {
            return -1
          }
          return 0
        })
        if (value === 'active') {
          return members.reverse().map((item, i) => {
            if (i <= 31) return item
          })
        } else {
          return members.map((item, i) => {
            if (i <= 31) return item
          })
        }
      }
    }
  },
  methods: {
    changeFilter(value) {
      this.filter = value
    }
  }
}
</script>

<style scoped lang="scss">
.members {
  width: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  .members_filter {
    display: flex;
    div {
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      &:nth-child(1) {
        margin-right: 20px;
      }
    }
    margin-bottom: 20px;
  }
  .active {
    color: #ff5400;
  }
  &_item {
    display: flex;
    width: 100%;
    border-bottom: rgba(0, 0, 0, 0.4) 1px solid;
    justify-content: space-between;
    align-items: center;
    div {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
    div:nth-child(1) {
      border-right: rgba(0, 0, 0, 0.4) 1px solid;
    }
  }
  &_head {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-bottom: rgba(0, 0, 0, 0.4) 1px solid;
    box-sizing: border-box;
    div {
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
      font-weight: bold;
      font-size: 17px;
      font-style: italic;
    }
    div:nth-child(1) {
      border-right: rgba(0, 0, 0, 0.4) 1px solid;
    }
  }
}
</style>
