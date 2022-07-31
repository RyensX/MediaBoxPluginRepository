<template>
  <div class="plugin-item">
    <div class="header">
      <a class="name" :href="props.plugin.repoUrl">{{ props.plugin.name }}</a>
      <div class="version">{{ props.plugin.version }}</div>
    </div>
    <div class="desc">{{ props.plugin.repoDesc }}</div>
    <div class="actions">
      <!-- <a class="VPButton medium brand" :href="props.plugin.sourcePath">安装</a> -->
      <div>
        <a class="btn" :href="props.plugin.sourcePath">下载</a>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["plugin"]);
</script>

<style scoped>
.plugin-item {
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
  width: 330px;
  background-color: var(--vp-c-bg-soft);
  margin: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.plugin-item .header {
}

.plugin-item .header > div {
  display: inline;
}

.plugin-item .header .name {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.plugin-item .header .name:hover {
  text-decoration: underline;
}

.plugin-item .header .version {
  border-color: var(--vp-button-alt-border);
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  font-size: 10px;
  padding: 3px 7px;
  border-radius: 40px;
  margin: auto;
  margin-left: 6px;
}

.plugin-item .desc {
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.plugin-item .actions {
  margin-top: 8px;
  flex: 1;
  text-align: right;
  display: flex;
  flex-direction: column-reverse;
}

.btn {
  background-color: var(--vp-button-brand-bg);
  padding: 8px 10px;
  border-radius: 40px;
  color: var(--vp-button-brand-text);
  font-size: 12px;
}
</style>