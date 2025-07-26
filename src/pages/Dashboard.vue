<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1
          class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"
        >
          Dashboard
        </h1>
      </div>

      <div
        class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"
      >
        <FilterButton align="right" />
        <Datepicker align="right" />
        <button
          class="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          <svg
            class="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"
            />
          </svg>
          <span class="max-xs:sr-only">Add View</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <DashboardCard01 />
      <DashboardCard02 />
      <DashboardCard03 />
      <DashboardCard04 />
      <DashboardCard05 />
      <DashboardCard06 />
      <DashboardCard07 />
      <DashboardCard08 />
      <DashboardCard09 />
      <DashboardCard10 />
      <DashboardCard11 />
      <DashboardCard12 />
      <DashboardCard13 />
    </div>
  </div>
</template>

<script setup>
// PERBAIKAN: Gunakan <script setup> agar lebih ringkas dan modern
// PERBAIKAN: Hapus impor dan logika yang berhubungan dengan layout (Sidebar, Header, sidebarOpen)

import FilterButton from "../components/DropdownFilter.vue";
import Datepicker from "../components/Datepicker.vue";
import DashboardCard01 from "../partials/dashboard/DashboardCard01.vue";
import DashboardCard02 from "../partials/dashboard/DashboardCard02.vue";
import DashboardCard03 from "../partials/dashboard/DashboardCard03.vue";
import DashboardCard04 from "../partials/dashboard/DashboardCard04.vue";
import DashboardCard05 from "../partials/dashboard/DashboardCard05.vue";
import DashboardCard06 from "../partials/dashboard/DashboardCard06.vue";
import DashboardCard07 from "../partials/dashboard/DashboardCard07.vue";
import DashboardCard08 from "../partials/dashboard/DashboardCard08.vue";
import DashboardCard09 from "../partials/dashboard/DashboardCard09.vue";
import DashboardCard10 from "../partials/dashboard/DashboardCard10.vue";
import DashboardCard11 from "../partials/dashboard/DashboardCard11.vue";
import DashboardCard12 from "../partials/dashboard/DashboardCard12.vue";
import DashboardCard13 from "../partials/dashboard/DashboardCard13.vue";
</script>
