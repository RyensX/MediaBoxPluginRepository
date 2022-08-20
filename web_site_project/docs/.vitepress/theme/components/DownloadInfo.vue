<template>
  <div style="text-align: center">
    正式版更新于：<b>{{ releasePushTime }}</b
    ><br />
    测试版更新于：<b>{{ debugPushTime }}</b>
  </div>
  <div class="versionBox">
    <a class="releaseBtn" :href="releaseDownloadUrl"
      >正式版
      <a
        class="version"
        href="https://github.com/RyensX/MediaBox/releases/latest"
        >{{ releaseVersionName }}
      </a>
    </a>
    <a class="debugBtn" v-if="debugVersionUrl" :href="debugDownloadUrl"
      >测试版
      <a class="version" :href="debugVersionUrl">
        {{ debugVersionName }}
      </a>
    </a>
  </div>
  <div class="proxyDownload" v-if="releaseDownloadUrl || debugVersionUrl">
    <input type="checkbox" v-model="isProxy" @change="setProxy" />
    <span>无法下载？请勾选此框后重试</span>
  </div>

  <div class="releaseUpdateLog">
    <div class="content" v-html="releaseUpdateLog"></div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted } from "vue";
import { ref, watch } from "vue";
import { AppConstant } from "../scripts/AppConstant";

const loadingHint = "loading...";
const debugInfoLoadErrorHint = "云端正在构建中，请稍后再查看";

const releasePushTime = ref(loadingHint);
const releaseVersionName = ref(loadingHint);
const releaseDownloadUrl = ref(null);
const releaseUpdateLog = ref(loadingHint);

const debugPushTime = ref(loadingHint);
const debugVersionName = ref(loadingHint);
const debugDownloadUrl = ref("");
const debugVersionUrl = ref(null);

const isProxy = ref(false);

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
            releaseDownloadUrl.value = data.assets[0].browser_download_url;
            releaseUpdateLog.value = data.body;
          } catch (e) {
            releaseUpdateLog.value = "加载失败";
          }
          if (debugVersionUrl.value) break;
          else hasRelease = true;
        }
        if (data.name == debugTagName) {
          try {
            debugPushTime.value = data.published_at ?? debugInfoLoadErrorHint;
            debugVersionName.value = data.target_commitish.substr(0, 7);
            debugDownloadUrl.value = data.assets[0].browser_download_url;
            debugVersionUrl.value = `https://github.com/RyensX/MediaBox/commit/${data.target_commitish}`;
          } catch (e) {
            debugPushTime.value = debugInfoLoadErrorHint;
          }
          if (hasRelease) break;
        }
      }

      if (!debugVersionUrl.value) {
        debugPushTime.value = debugInfoLoadErrorHint;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function setProxy() {
  console.log(isProxy.value);
  if (isProxy.value) {
    releaseDownloadUrl.value = `${AppConstant.ghProxy}${releaseDownloadUrl.value}`;
    debugDownloadUrl.value = `${AppConstant.ghProxy}${debugDownloadUrl.value}`;
  } else {
    releaseDownloadUrl.value = releaseDownloadUrl.value.replace(
      AppConstant.ghProxy,
      ""
    );
    debugDownloadUrl.value = debugDownloadUrl.value.replace(
      AppConstant.ghProxy,
      ""
    );
  }
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

.version {
  display: block;
  font-size: 12px;
}

.version:hover {
  text-decoration: underline;
}

.releaseBtn {
  background-color: var(--vp-button-brand-bg);
  padding: 12px 48px;
  border-radius: 8px;
  margin: 8px;
  color: var(--vp-button-brand-text);
  font-size: 15.5px;
  text-align: center;
}

.debugBtn {
  background-color: var(--vp-button-alt-bg);
  padding: 12px 48px;
  border-radius: 8px;
  margin: 8px;
  color: var(--vp-button-alt-text);
  font-size: 15.5px;
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

.proxyDownload {
  text-align: center;
}

.proxyDownload > input {
  vertical-align: text-bottom;
  background-color: var(--vp-button-brand-bg);
}

.proxyDownload > span {
  font-size: 13px;
}
</style>