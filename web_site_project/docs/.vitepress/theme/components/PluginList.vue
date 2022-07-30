<template>
  <p v-if="!data">暂无数据</p>
  <div>
    <div class="pluginListBox">
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
 
 <style>
.pluginListBox {
  display: flex;
  flex-direction: row;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
}
</style>