<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 pt-12 lg:pt-16 px-8 m-auto max-w-screen-sm lg:px-0">
      <RouterView el="main" />
    </main>

    <AppFooter />
  </div>
</template>

<style lang="postcss"></style>
