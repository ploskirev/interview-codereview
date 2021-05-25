import { createHelpers } from 'vuex-map-fields'
import { EventBus } from "@/event-bus"
import { mapActions, mapMutations } from 'vuex'
import utils from '@/api/utils'
import logger from '@/logger.js'
const { mapFields } = createHelpers({
  getterType: 'getEmployeeField',
  mutationType: 'updateEmployeeField',
})

export default {
  computed: {
    ...mapFields({
      employee: 'selected',
      forms: 'forms'
    }),
    ...mapFields({
      permissions: 'permissions'
    }),
    dynamicFieldRules () {
      let dynamicFieldRules = {}
      if (this.permissions) {
        for (let key in this.requiredFields) {
          if (this.permissions[key]) {
            dynamicFieldRules[key] = this.requiredFields[key]
          }
        }
      } else {
        dynamicFieldRules = {...this.requiredFields}
      }
      return dynamicFieldRules
    },
    'rules' () {
      return this.isViewMode ? {} : this.fieldRules
    },
    'formTab' () {
      return this.$route.params.form_tab
    },
    'formTabIndex' () {
      this.$_.get(this.tabToId, this.formTab(), '1')
    },
    'isViewMode' () {
      return this.$route.params.form_mode === 'view'
    },
    'canEdit' () {
      return this.hasPermissions(['edit.base'])
    },
    'formPromises' () {
      let result = []
      this.forms.forEach((item) => {
        result.push(new Promise((resolve, reject) => {
          EventBus.$emit(item, resolve)
        }))
      })
      return result
    },
    'invalidPages' () { return this.$store.state.invalidPages }
  },
  methods: {
    ...mapActions([
      'saveEmployee',
      'createEmployee'
    ]),
    ...mapMutations({
      watchInvalidPage: 'WATCH_INVALID_PAGE',
      unwatchInvalidPage: 'UNWATCH_INVALID_PAGE',
      unwatchInvalidPages: 'UNWATCH_INVALID_PAGES'
    }),
    hasPermission (permission) {
      if (!permission) return true
      const userPermissions = utils.fetchUserPermissions()
      return userPermissions.indexOf(permission) > -1
    },
    validateForm (callback) {
      if (this.$refs['form']) return this.$refs['form'].validate((result) => {
        result === true
          ? this.unwatchInvalidPage(this.$route.name)
          : this.watchInvalidPage(this.$route.name)
        callback(result)
      })
      callback(true)
    },
    doIfAllValid (callback, errorCallback) {
      Promise.all(this.formPromises).then((results) => {
        logger.debug('Get validate results: ', results)
        const valid = results.indexOf(false) === -1
        if (!valid) return errorCallback()
        return callback()
      })
    },
    handleSave () {
      this.doIfAllValid(() => {
        if (this.invalidPages.length > 0) return
        this.saveEmployee()
        this.handleViewMode()
      }, () => {})
    },
    handleCreate () {
      this.doIfAllValid(() => {
        this.createEmployee()
          .then(() => {
            this.$confirm(this.$t('ask_add_employee'), this.$t('employee_added'), {
              confirmButtonText: this.$t('add_employee'),
              cancelButtonText: this.$t('come_back_profile'),
              type: 'success'
            }).then(() => {
              this.$store.commit('watchNewEmployee')
              this.$router.push({ name: 'EmployeeCreate' })
            }).catch(() => {
              this.$router.push({
                name: 'EmployeePersonal',
                params: {
                  form_mode: 'view',
                  id: this.employee.id
                }
              })
            })
          })
      }, () => {})
    },
    initHandlers (name) {
      this.$store.commit('watchEmployeeForm', `${name}::validateForm`)
      EventBus.$on(`${name}::validateForm`, (callback) => {
        this.validateForm((result) => {
          callback(result)
        })
      })
    },
    removeHandlers () {
      const name = this.$options.name
      if (!name) return
      this.$store.commit('removeEmployeeForm', `${name}::validateForm`)
      EventBus.$off(`${name}::validateForm`)
    },
    removeAllHandlers () {
      logger.debug('Removing all validate form events: ', EventBus)
      const allEvents = Object.keys(EventBus._events).filter(item => item.includes('::validateForm'))
      allEvents.forEach(item => {
        EventBus.$off(item)
      })
    },
    handleEditMode () {
      this.unwatchInvalidPages()
      this.$router.push({
        params: { form_mode: 'edit', form_tab: this.formTab }
      })
    },
    handleViewMode () {
      this.drawData()
      this.unwatchInvalidPages()
      this.$router.push({
        params: { form_mode: 'view', form_tab: this.formTab }
      })
    },
    drawData () {
      this.fetchEmployeeAsync(this.$route.params.id)
    }
  },
  mounted () {
    const name = this.$options.name
    if (name) this.initHandlers(name)
  },
  beforeRouteLeave (to, from, next) {
    this.removeHandlers()
    next()
  }
}
