<template>
  <div class="list-pull">
    <div class="list-pull_head">
      <div>Name</div>
      <div>Date Create</div>
      <div v-if="!old">Author</div>
      <select @change="useFilter" class="author" v-if="old" v-model="useAuthor">
        <option value="author" selected>Author</option>
        <option :value="item.author" v-for="(item, i) in authors" :key="i">
          {{ item.author }}
        </option>
      </select>
      <div v-if="old">Days Open</div>
      <div>Go To Githab</div>
    </div>
    <div
      class="list-pull_item"
      v-for="(pull, i) in !filter ? getPull : getPullWithAuthor(useAuthor)"
      :key="i"
    >
      <div>{{ pull.title }}</div>
      <div>{{ formatDatePull(pull.created_at) }}</div>
      <div>{{ pull.user.login }}</div>
      <div v-if="old">{{ formatDay(pull.created_at) }}</div>
      <div>
        <a class="list-pull_button" :href="pull.html_url" target="_blank">Go</a>
      </div>
    </div>
    <PaginationBlock
      :pages="getPages"
      :changePage="changePage"
      v-if="!filter"
      :currentPage="pagination.currentPage"
    />
  </div>
</template>

<script>
import { formatDate, unique } from '@/utils/utils'
import PaginationBlock from '@/components/PaginationBlock'
export default {
  components: { PaginationBlock },
  props: {
    title: {
      type: String
    },
    pulls: {
      type: Array
    },
    old: {
      type: Boolean
    }
  },
  name: 'listPulls',
  data() {
    return {
      pagination: {
        elementsItem: 25,
        startPage: 1,
        endPage: 0,
        currentPage: 1
      },
      authors: [],
      filter: false,
      useAuthor: 'author'
    }
  },
  computed: {
    formatDatePull() {
      return (date) => {
        return formatDate(date, 'Ru-ru')
      }
    },
    getPages() {
      return Math.ceil(this.pulls.length / this.pagination.elementsItem)
    },
    getPull() {
      return this.pulls.slice(
        (this.pagination.currentPage - 1) * this.pagination.elementsItem,
        this.pagination.currentPage * this.pagination.elementsItem
      )
    },
    getPullWithAuthor() {
      return (value) => {
        return this.pulls.filter((item) => item.user.login === value)
      }
    },
    prepareAuthorsList() {
      return unique(this.pulls.map((item) => ({ author: item.user.login })))
    }
  },
  methods: {
    formatDay(value) {
      const day = (new Date() - new Date(value)) / 8.64e7
      if (day < 1) {
        return 1
      } else {
        return day.toFixed(0)
      }
    },
    useFilter() {
      if (this.useAuthor === 'author') {
        this.filter = false
      } else this.filter = true
    },
    changePage(value) {
      if (value === 'next') {
        if (this.pagination.currentPage === this.pagination.endPage) {
          this.pagination.currentPage = this.pagination.endPage
        } else {
          this.pagination.currentPage++
        }
      } else if (value === 'prev') {
        if (this.pagination.currentPage === this.pagination.startPage) {
          this.pagination.currentPage = this.pagination.endPage
        } else {
          this.pagination.currentPage--
        }
      } else {
        this.pagination.currentPage = value
      }
    }
  },
  mounted() {
    this.authors = this.prepareAuthorsList
    this.pagination.endPage = this.getPages
  }
}
</script>

<style scoped lang="scss">
.list-pull {
  width: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  &_item {
    display: flex;
    width: 100%;
    border-bottom: rgba(0, 0, 0, 0.4) 1px solid;
    justify-content: space-between;
    align-items: center;
    div {
      width: 20%;
      padding: 15px;
      box-sizing: border-box;
      overflow: hidden;
      flex-grow: 1;
      min-height: 60px;
      max-height: 120px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow-y: scroll;
    }
    div:nth-child(1n) {
      border-right: rgba(0, 0, 0, 0.4) 1px solid;
    }
    div:last-child {
      border-right: none;
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
      padding: 20px;
      width: 20%;
      box-sizing: border-box;
      font-weight: bold;
      font-size: 17px;
      font-style: italic;
      flex-grow: 1;
    }
    div:nth-child(1n) {
      border-right: rgba(0, 0, 0, 0.4) 1px solid;
    }
    div:last-child {
      border-right: none;
    }
    div:nth-child(4) {
      border-left: rgba(0, 0, 0, 0.4) 1px solid;
    }
  }
  &_button {
    border: none;
    width: 150px;
    height: 30px;
    background: #fcce0d;
    color: black;
    text-align: center;
    font-size: 18px;
    line-height: 20px;
    border-radius: 10px;
    cursor: pointer;
    transition-duration: 0.4s;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      color: black;
    }
  }
  .author {
    width: 19.95%;
    font-size: 17px;
    font-style: italic;
    height: 30px;
  }
}
</style>
