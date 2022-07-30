<template>
  <div v-if="!data" class="loading pluginLoading"></div>
  <div v-else>
    <p v-if="data && data.length == 0">暂无数据</p>
    <div v-else class="pluginListBox">
      <PluginItem v-for="item in data" :key="item.packageName" :plugin="item" />
    </div>
  </div>
</template>
 
<script setup>
import { onMounted } from "vue";
import { ref, watch } from "vue";
import axios from "axios";
import PluginItem from "./PluginItem.vue";

const data = ref(null);

onMounted(() => {
  loadPluginList();
});

function loadPluginList() {
  axios
    .get("../data/data.json")
    .then((response) => {
      console.log(response);
      data.value = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>
 
 <style scoped>
.pluginListBox {
  display: flex;
  flex-direction: row;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
}

.pluginLoading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.loading {
  border: 5px solid var(--vp-button-alt-border);
  border-top: 5px solid var(--vp-button-brand-bg);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: inline-block;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>