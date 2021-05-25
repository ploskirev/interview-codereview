<template>
  <div class="customer-service">
    <h2>{{ $t("views.customerService.title") }}</h2>

    <v-btn
        :href="descriptionLink"
        target="_blank"
        flat
        depressed
        :ripple="false"
        class="customer-button mb-2"
    >
      {{ $t("views.customerService.knowledgeBaseLink") }}
    </v-btn>

    <v-layout wrap>
      <v-flex
          xs12
          md5
          class="customer-tile"
          v-for="category in customerServicesCategories"
          :key="category.title"
      >
        <h3 class="headline font-weight-bold">
          {{ $t(`customerService.categories.${category.id}`) }}
        </h3>

        <ul class="customer-list">
          <li
              v-if="category.fields.includes(service.id)"
              v-for="service in itemsTaskTypeAll"
              :key="service.title"
              class="customer-list-item"
          >
            <v-tooltip
                bottom
                :disabled="!$t(`views.customerService.hints.${service.id}`)"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                    v-on="on"
                    flat
                    depressed
                    :to="`/customer_service/${service.id}`"
                    class="customer-link font-weight-regular"
                >{{ service.name }}
                </v-btn>
              </template>
              <span
                  v-html="$t(`views.customerService.hints.${service.id}`)"
              ></span>
            </v-tooltip>
          </li>
        </ul>
      </v-flex>
    </v-layout>

    <AsanaCreatedList
        v-if="employee && showLinks"
        class="mt-4"
        :employee="employee"
        template-type="Сервисная служба"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import mixinCustomServiceForm from "../../mixins/mixinCustomServiceForm";
import AsanaCreatedList from "../../task 2/components/AsanaCreatedList.vue";
import {customerServicesCategories} from "../../constants/customer-service/config";

export default {
  components: {AsanaCreatedList},
  mixins: [mixinCustomServiceForm],
  metaInfo() {
    return {
      title: this.$t("views.customerService.title"),
    };
  },
  computed: {
    ...mapGetters("employee", ["employee"]),
    ...mapGetters("interface", ["showLinks"]),
    customerServicesCategories: () => customerServicesCategories,
  },
  data() {
    return {
      descriptionLink: "https://site.com/pages/439007351",
    };
  },
};
</script>

<style lang="scss" scoped>
.customer-button {
  padding: 0;
  margin: 0;

  &::before {
    background-color: transparent;
  }

  ::v-deep {
    .v-btn__content {
      text-transform: none;
      text-decoration: underline;
      font-size: 14px;
    }
  }
}

.customer-tile {
  margin-bottom: 77px;
}

.customer-link {
  text-decoration: none;
  font-size: 16px;
  padding: 0;
  margin: 0;
  height: auto;
  text-transform: none;

  &::before {
    background: transparent !important;
  }
}

.customer-list {
  list-style: none;
  padding: 23px 0 0;
}

.customer-list-item {
  margin-bottom: 9px;
  font-size: 16px;
  line-height: 19px;
}
</style>
