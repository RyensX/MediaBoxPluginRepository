<template>
  <div class="pluginListHeader">
    <div>共{{ data?.length ?? 0 }}个插件</div>
    <input
      placeholder="搜索插件名称/包名/开发者"
      class="pluginSearch"
      v-model="keyword"
    />
  </div>
  <div v-if="!data" class="loading pluginLoading"></div>
  <div v-else>
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
const rawData = ref(null);
const keyword = ref("");

//实时搜索过滤
watch(keyword, (k) => {
  console.log("搜索", k);
  if (k && k.trim().length > 0 && Array.isArray(rawData.value))
    data.value = rawData.value.filter((item) => {
      return (
        item.name.includes(k) ||
        item.packageName.includes(k) ||
        item.author.includes(k)
      );
    });
  else data.value = rawData.value;
});

onMounted(() => {
  loadPluginList();
});

function loadPluginList() {
  //TODO opt
  axios
    .get("../data/data.json")
    .then((response) => {
      console.log(response);
      rawData.value = response.data;
      data.value = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>
 
 <style scoped>
.pluginListHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 16px 10% 6px;
}

.pluginListHeader > div:first-child {
  margin-top: auto;
  margin-bottom: auto;
}

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
  border: 5px solid var(--vp-button-alt-border);
  border-top: 5px solid var(--vp-button-brand-bg);
  border-radius: 50%;
  width: 40px;
  height: 40px;
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

.pluginSearch {
  background-color: var(--vp-c-bg-soft);
  padding: 8px 12px;
  border-radius: 6px;
}
</style>