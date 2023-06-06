module.exports = (api, options, rootOpitons) => {
  api.extendPackage({
    script: {
      dev: 'vite',
      'dev:wsj': 'cross-env VITE_API_HOST=https://adoms-test.huan.tv/api vite',
    },
  })
  api.extendPackage({
    dependencies: {
      '@antv/s2-vue': '^1.5.0',
      '@types/qs': '^6.9.7',
      '@vicons/fa': '^0.12.0',
      '@vicons/material': '^0.12.0',
      axios: '^0.21.1',
      'cross-env': '^7.0.3',
      jsencrypt: '^3.3.1',
      lodash: '^4.17.21',
      pinia: '^2.0.23',
      qs: '^6.10.3',
      sortablejs: '^1.15.0',
      typescript: '^4.6.2',
      vue: '^3.2.29',
      'vue-router': '^4.0.12',
      vuedraggable: '^4.1.0',
    },
    devDependencies: {
      '@types/node': '^17.0.22',
      '@vicons/antd': '^0.12.0',
      '@vicons/carbon': '^0.12.0',
      '@vicons/fluent': '^0.12.0',
      '@vicons/ionicons4': '^0.12.0',
      '@vicons/ionicons5': '^0.11.0',
      '@vicons/tabler': '^0.12.0',
      '@vitejs/plugin-legacy': '^2.0.0',
      '@vitejs/plugin-vue': '^2.0.0',
      dayjs: '^1.10.8',
      'naive-ui': '^2.31.0',
      'unplugin-vue-components': '^0.17.10',
      vite: '^2.8.6',
      'vite-plugin-compression': '^0.5.1',
      'vite-plugin-sentry': '^1.1.7',
      'vue-tsc': '^0.29.8',
    },
  })

  // 删除 vue-cli3 默认目录
  api.render((files) => {
    Object.keys(files)
      .filter((path) => path.startsWith('src/') || path.startsWith('public/'))
      .forEach((path) => delete files[path])
    console.log(Object.keys(files))
  })
  api.render('../template')
  api.onCreateComplete(() => {
    process.env.VUE_CLI_SKIP_WRITE = true
  })
}
