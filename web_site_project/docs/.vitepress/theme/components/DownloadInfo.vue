<template>
  <div style="text-align: center">
    正式版更新于：<b>{{ releasePushTime }}</b
    ><br />
    测试版更新于：<b>{{ debugPushTime }}</b>
  </div>
  <div class="versionBox">
    <a class="release-btn" :href="releaseVersionUrl"
      >正式版
      <div class="version">{{ releaseVersionName }}</div>
    </a>
    <a class="debug-btn" :href="debugVersionUrl"
      >测试版
      <div class="version">{{ debugVersionName }}</div>
    </a>
  </div>
  <div class="releaseUpdateLog">
    <div class="content" v-html="releaseUpdateLog"></div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted } from "vue";
import { ref, watch } from "vue";

const releasePushTime = ref("unkown");
const releaseVersionName = ref("unkown");
const releaseVersionUrl = ref("");
const releaseUpdateLog = ref("载入中...");

const debugPushTime = ref("unkown");
const debugVersionName = ref("unkown");
const debugVersionUrl = ref("");

onMounted(() => {
  loadData();
});

function loadData() {
  axios
    .get("https://api.github.com/repos/RyensX/MediaBox/releases")
    .then((response) => {
      let hasRelease = false;
      let debugTagName = "Debug";
      for (let data of response.data) {
        //console.log(data);
        if (!hasRelease && data.name != debugTagName) {
          try {
            releasePushTime.value = data.published_at;
            releaseVersionName.value = data.name;
            releaseVersionUrl.value = data.assets[0].browser_download_url;
            releaseUpdateLog.value = data.body;
          } catch (e) {
            releaseUpdateLog.value = "加载失败";
          }
          hasRelease = true;
        }
        if (data.name == debugTagName) {
          try {
            debugVersionName.value = data.target_commitish.substr(0, 7);
            debugVersionUrl.value = data.assets[0].browser_download_url;
          } catch (e) {
            debugPushTime.value = "正在构建中，请稍后再查看";
          }
          if (hasRelease) break;
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>

<style scoped>
.versionBox {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}
.versionBox > * {
  display: inline-block;
}

.versionBox .version {
  font-size: 12px;
}

.release-btn {
  background-color: var(--vp-button-brand-bg);
  padding: 12px 48px;
  border-radius: 8px;
  margin: 8px;
  color: var(--vp-button-brand-text);
  font-size: 15px;
  text-align: center;
}

.debug-btn {
  border-color: var(--vp-button-alt-border);
  padding: 12px 48px;
  border-radius: 8px;
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  margin: 8px;
  font-size: 15px;
  text-align: center;
}

.releaseUpdateLog {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 8px;
}

.releaseUpdateLog .content {
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  padding: 24px;
}
</style>