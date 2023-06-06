<template>
  <div class="content" id="addScreen">
    <n-grid item-responsive :cols="24">
      <n-grid-item :offset="2" :span="18" style="background: #fff; padding: 25px; border-radius: 8px">
        <h5>录屏信息</h5>
        <n-form ref="formRef" :model="model" :rules="rules" label-placement="left"
                require-mark-placement="right-hanging" style="margin-left: 100px" label-width="105px">
          <!-- 展示场景 -->
          <n-form-item label="展示场景" path="ad_type" :show-feedback="false" style="margin-bottom: 16px">
            <n-grid :cols="24">
              <n-gi :span="24">
                <n-radio-group v-model:value="model.ad_type" @update:value="changeStyle"
                               :checked="ResetStyle(model.ad_type)">
                  <n-space>
                    <n-radio :value="item.value" v-for="item in showStyle" :key="item.value">{{
                        item.label
                      }}</n-radio>
                  </n-space>
                </n-radio-group>
              </n-gi>
            </n-grid>
          </n-form-item>

          <!-- 下拉应用 -->
          <n-form-item style="margin-left: 100px" path="package_name" v-if="[6].includes(model.ad_type)">
            <n-grid :cols="24">
              <n-gi :span="12">
                <div>
                  <n-select :style="{ width: '100%' }" placeholder="下拉选择应用" clearable
                            v-model:value="model.package_name" :options="appOptions" />
                </div>
              </n-gi>
            </n-grid>
          </n-form-item>

          <!-- 上传 -->
          <n-form-item v-if="![6, 10].includes(model.ad_type)" style="margin-left: 105px"
                       :show-feedback="false">
            <n-grid :cols="24" :y-gap="10" :x-gap="68">
              <n-gi :span="12">
                <UpLoad uptype="text" :api="uploadMaterialFileApi" :add="[4].includes(model.ad_type)"
                        v-model:material_list="model.material_list" :formRef="formRef" :limit="5"
                        @add="changeUpload" @minu="changeUpload" @getUploadState="getUploadState"
                        @getUploadType="getUploadType" pathName="material_list" :userType="1"></UpLoad>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 天气预报上传 -->
          <n-form-item label="弹窗:" v-if="[10].includes(model.ad_type)" style="margin-left: 100px"
                       :show-feedback="false">
            <n-grid :cols="24" :y-gap="10" :x-gap="68">
              <n-gi :span="12">
                <UpLoad uptype="text" :api="uploadMaterialFileApi" :add="[4].includes(model.ad_type)"
                        v-model:material_list="model.weather_alert_image_list" :formRef="formRef" :limit="5"
                        @add="changeUpload" @minu="changeUpload" pathName="weather_alert_image_list"
                        @getUploadState="getUploadState" :userType="2"></UpLoad>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 天气预报落地页上传 -->
          <n-form-item label="落地页:" v-if="[10].includes(model.ad_type)" style="margin-left: 100px"
                       :show-feedback="false">
            <n-grid :cols="24" :y-gap="10" :x-gap="68">
              <n-gi :span="12">
                <UpLoad uptype="text" :api="uploadMaterialFileApi"
                        v-model:material_list="model.weather_info_image_list" :formRef="formRef"
                        @add="changeUpload" pathName="weather_info_image_list" @minu="changeUpload"
                        @getUploadState="getUploadState" :userType="3"></UpLoad>
              </n-gi>
            </n-grid>
          </n-form-item>
          <n-form-item label="文案:" path="weather_info_content" v-if="[10].includes(model.ad_type)"
                       style="margin-left: 100px">
            <n-input style="width: 450px" clearable placeholder="请输入落地页文案" maxlength="40"
                     v-model:value="model.weather_info_content" />
          </n-form-item>

          <n-form-item label="城市:" path="weather_city_cid" v-if="[10].includes(model.ad_type)"
                       style="margin-bottom: 16px;margin-left: 100px">
            <n-grid :col="24">
              <n-gi :span="5">
                <n-select style="width:450px;" v-model:value="model.weather_city_cid" clearable
                          filterable placeholder="搜索或下拉选择" :options="cityOptions" />
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 开播类型 -->
          <n-form-item label="开播类型" v-if="[3].includes(model.ad_type)" path="broadcast_type"
                       style="margin-bottom: 16px" :show-feedback="false">
            <n-radio-group v-model:value="model.broadcast_type" @update:value="changeCornerType">
              <n-space>
                <n-radio style="height: 32px; margin-top: 6px;min-width: 100px;" :value="item.value"
                         :key="item.value" v-for="item in broadcastType">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <!-- 播放剧目 -->
          <n-form-item style="margin-left: 100px" path="click_app_template_id"
                       v-if="[3].includes(model.ad_type) && model.broadcast_type == 2">
            <n-grid :cols="24">
              <n-gi :span="12">
                <div>
                  <n-select :style="{ width: '100%' }" placeholder="选择开始播放的剧目" clearable
                            v-model:value="model.click_app_template_id" :options="tempOptions" />
                </div>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 选择卫视 -->
          <n-form-item style="margin-left: 100px" path="record_prev_jump"
                       v-if="[3].includes(model.ad_type) && model.broadcast_type == 1">
            <n-grid :cols="24">
              <n-gi :span="12">
                <div>
                  <n-select :style="{ width: '100%' }" placeholder="下拉选择开始播放的电视台" clearable
                            v-model:value="model.record_prev_jump" :options="cornerOptions" />
                </div>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 是否预约 -->
          <n-form-item label="是否预约" v-if="[3].includes(model.ad_type)" path="corner_type"
                       style="margin-bottom: 16px" :show-feedback="false">
            <n-radio-group v-model:value="model.corner_type" @update:value="ChangeAppointment">
              <n-space>
                <n-radio style="height: 32px; margin-top: 6px;min-width: 100px;" :value="item.value"
                         :key="item.value" v-for="item in makeAnAppointment">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <!-- 预约文案 -->
          <n-form-item style="margin-left: 100px" path="appointment_corner_text"
                       v-if="[2].includes(model.corner_type)">
            <n-grid :cols="24">
              <n-gi :span="12">
                <div>
                  <n-input :show-button="false" :ref="
                                        (el) => {
                                            if (el) cornerInput = el
                                        }
                                    " v-model:value="model.appointment_corner_text" clearable maxlength="40"
                           placeholder="请输入预约文案" />
                </div>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 自动播放 -->
          <n-form-item label="自动播放" path="auto_play"
                       v-if="[5].includes(model.ad_type) && [2].includes(uploadType)">
            <n-grid :cols="1" :y-gap="10">
              <n-gi>
                <n-radio-group v-model:value="model.auto_play">
                  <n-radio style="min-width:100px;" :value="item.value" :key="item.value"
                           v-for="item in auto_play">{{
                      item.label
                    }}</n-radio>
                </n-radio-group>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 弹框位置 -->
          <n-form-item label="弹窗位置" path="corner_location" v-if="[3, 7].includes(model.ad_type)"
                       :show-feedback="false" style="margin-bottom: 16px">
            <n-radio-group v-model:value="model.corner_location" name="radiogroup1"
                           @update:value="changeCornerLocation">
              <n-space>
                <n-radio style="height: 32px; margin-top: 6px;min-width:100px;" :value="item.value"
                         :key="item.value" v-for="item in alertPosition">
                  <template v-if="[1, 2, 3, 5].includes(item.value)">{{
                      item.label
                    }}</template>
                  <template v-if="[4].includes(item.value)">
                    <div class="input-warp-box">
                      <span style="margin-right: 10px">{{ item.label }}</span>
                      <n-form-item-gi :path="
                                                model.corner_location == 4
                                                    ? 'nestedValue.corner_offset_x'
                                                    : ''
                                            " style="width: 170px; margin-top: -5px" v-if="model.corner_location == 4">
                        <n-input-group>
                          <n-input-group-label :style="{ width: '40px' }">X:
                          </n-input-group-label>
                          <n-input-number :style="{ width: '100%' }" :min="0" :max="100"
                                          clearable :show-button="false"
                                          v-model:value="model.nestedValue.corner_offset_x" />
                          <n-input-group-label>%</n-input-group-label>
                        </n-input-group>
                      </n-form-item-gi>

                      <n-form-item-gi :path="
                                                model.corner_location == 4
                                                    ? 'nestedValue.corner_offset_y'
                                                    : ''
                                            " style="
                          width: 170px;
                          margin-left: 10px;
                          margin-top: -5px;
                        " v-if="model.corner_location == 4">
                        <n-input-group>
                          <n-input-group-label :style="{ width: '40px' }">Y:
                          </n-input-group-label>
                          <n-input-number :style="{ width: '100%' }" :min="0" :max="100"
                                          clearable :show-button="false"
                                          v-model:value="model.nestedValue.corner_offset_y" />
                          <n-input-group-label>%</n-input-group-label>
                        </n-input-group>
                      </n-form-item-gi>
                    </div>
                  </template>
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item label="图片时长" v-if="[4].includes(model.ad_type)" path="poll_time"
                       :show-feedback="false">
            <template #label>
              图片时长
              <Tooltip>
                <div class="question-box">
                  <!-- 触发器 -->
                  <QuestionCircle20Regular></QuestionCircle20Regular>
                </div>

                <!-- 内容 -->
                <template #header>
                  <p>屏保间隔时间只对图片起作用，视频按照视频实际时长播放</p>
                </template>
              </Tooltip>
            </template>
            <n-form-item-gi style="width: 200px" path="poll_time">
              <n-input-group>
                <n-input-number style="width: 165px" :show-button="false" :min="1" :max="99" clearable
                                v-model:value="model.poll_time" />
                <n-input-group-label>秒</n-input-group-label>
              </n-input-group>
            </n-form-item-gi>
          </n-form-item>
          <!-- 开机点击支持 -->
          <n-form-item label="点击支持" v-if="[1].includes(model.ad_type)" path="click_type"
                       style="margin-bottom: 16px" :show-feedback="false">
            <n-radio-group v-model:value="model.click_type" @update:value="changeClickType">
              <n-radio style="height: 32px; margin-top: 6px;min-width: 100px;" :value="item.value"
                       :key="item.value" v-for="item in openSourceClick">{{ item.label }}</n-radio>
            </n-radio-group>
          </n-form-item>
          <!-- 点击支持 -->
          <n-form-item label="点击支持"
                       v-if="[3, 4, 7].includes(model.ad_type) || ([5].includes(model.ad_type) && [1].includes(uploadType))"
                       path="click_type" style="margin-bottom: 16px" :show-feedback="false">
            <n-radio-group v-model:value="model.click_type" @update:value="changeClickType">
              <n-radio style="height: 32px; margin-top: 6px;min-width: 100px;" :value="item.value"
                       :key="item.value" v-for="item in sourceClick">{{ item.label }}</n-radio>
            </n-radio-group>
          </n-form-item>
          <!-- web页面地址 -->
          <n-form-item style="margin-left: 105px" path="web_url" v-if="
                        ([1, 3, 4, 7].includes(model.ad_type) || ([5].includes(model.ad_type) && [1].includes(uploadType))) &&
                        [2].includes(model.click_type)
                    ">
            <n-grid :cols="24">
              <n-gi :span="12">
                <div>
                  <n-input :show-button="false" v-model:value="model.web_url" clearable
                           :maxlength="200" placeholder="请输入WEB页面地址" />
                </div>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 素材点击 -->
          <n-form-item style="margin-left: 100px" path="click_position" v-if="
                        [4].includes(model.ad_type) && [2, 3].includes(model.click_type)
                    ">
            <n-grid :cols="24">
              <n-gi :span="12">
                <n-input-group>
                  <n-input-group-label>第</n-input-group-label>
                  <n-input-number :style="{ width: '15%' }" :min="1" :show-button="false"
                                  :max="model.material_list.length" v-model:value="model.click_position" />
                  <n-input-group-label>个素材支持点击</n-input-group-label>
                </n-input-group>
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 应用直达 -->
          <n-form-item style="margin-left: 105px;" path="click_template_id" v-if="
                        (([1, 3, 4, 7].includes(model.ad_type) || ([5].includes(model.ad_type) && [1].includes(uploadType))) &&
                            [3].includes(model.click_type)) || [2].includes(model.ad_type)
                    ">
            <n-grid :col="24">
              <n-gi :span="5">
                <n-select style="width:200px;" clearable v-model:value="model.click_template_id"
                          :options="tempOptions" placeholder="请选择直达应用" />
              </n-gi>
            </n-grid>
          </n-form-item>
          <!-- 开机播放视频地址 -->
          <n-form-item style="margin-left: 105px" path="video_url" v-if="
                        [1].includes(model.ad_type) && [4].includes(model.click_type)
                    ">
            <n-grid :cols="24">
              <n-gi :span="12">
                <div>
                  <n-input :show-button="false" v-model:value="model.video_url" clearable
                           placeholder="请输入播放视频地址" />
                </div>
              </n-gi>
            </n-grid>
          </n-form-item>
          <n-form-item label="广告来源" :show-feedback="false" style="margin-bottom: 16px">
            <n-grid :col="24">
              <n-gi :span="5">
                <n-select style="width:200px;" clearable v-model:value="model.ad_source_id"
                          :options="generalOptions" />
              </n-gi>
            </n-grid>
          </n-form-item>
          <n-form-item label="来源位置" path="ad_source_location" :show-feedback="false"
                       style="margin-bottom: 16px" v-if="!['无', null].includes(model.ad_source_id)">
            <n-grid :cols="1" :y-gap="10">
              <n-gi>
                <n-radio-group v-model:value="model.ad_source_location">
                  <n-radio :value="item.value" style="min-width:100px;" :key="item.value"
                           v-for="item in sourcePosition">{{
                      item.label
                    }}</n-radio>
                </n-radio-group>
              </n-gi>
            </n-grid>
          </n-form-item>
          <n-form-item label="标准时间" path="real_time_flag" :show-feedback="false"
                       style="margin-bottom: 16px; margin-top: 10px" v-if="model.ad_type !== 7">
            <n-grid :cols="1" :y-gap="10">
              <n-gi>
                <n-radio-group v-model:value="model.real_time_flag" @update:value="changeStandardTime">
                  <n-radio style="min-width:100px;" :value="item.value" :key="item.value"
                           v-for="item in real_time_flag">{{
                      item.label
                    }}</n-radio>
                </n-radio-group>
              </n-gi>
            </n-grid>
          </n-form-item>
          <n-form-item label="是否直播" path="sinatv_type" :show-feedback="false"
                       style="margin-bottom: 16px; margin-top: 10px"
                       v-if="model.ad_type == 3 && model.real_time_flag == 0">
            <n-grid :cols="1" :y-gap="10">
              <n-gi>
                <n-radio-group v-model:value="model.sinatv_type">
                  <n-radio style="min-width:100px;" :value="item.value" :key="item.value"
                           v-for="item in sinatvType">{{
                      item.label
                    }}</n-radio>
                </n-radio-group>
              </n-gi>
            </n-grid>
          </n-form-item>

          <n-form-item v-if="[0, 3].includes(model.real_time_flag)" label="录屏时间" path="task_record_time">
            <template #label>
              录屏时间
              <Tooltip>
                <div class="question-box">
                  <!-- 触发器 -->
                  <QuestionCircle20Regular></QuestionCircle20Regular>
                </div>
                <!-- 内容 -->
                <template #header>
                  <p>每个厂商自动生成录屏时间，时间间隔至少五分钟</p>
                </template>
              </Tooltip>
            </template>
            <n-date-picker style="width: 300px" v-model:formatted-value="model.task_record_time"
                           type="datetime" value-format="yyyy-MM-dd HH:mm:ss" clearable
                           @update:value="getRecordTime" />
            <n-input-group v-if="model.sinatv_type == 1 && model.ad_type == 3">
              <n-input-number style="width: 140px; margin-left: 10px" :show-button="false" :min="-999"
                              :max="999" clearable placeholder="请输入延迟时间" v-model:value="model.delay_second" />
              <n-input-group-label>秒</n-input-group-label>
            </n-input-group>
          </n-form-item>
          <n-form-item label="落地时长" path="show_time" :show-feedback="false">
            <template #label>
              落地时长
              <Tooltip>
                <div class="question-box">
                  <!-- 触发器 -->
                  <QuestionCircle20Regular></QuestionCircle20Regular>
                </div>

                <!-- 内容 -->
                <template #header>
                  <p>请输入跳转第三方落地页的展示时长</p>
                </template>
              </Tooltip>
            </template>
            <n-grid :cols="24">
              <n-gi :span="12">
                <n-form-item-gi style="width: 200px">
                  <n-input-group>
                    <n-input-number style="width: 100px" :show-button="false" :min="0" :max="600"
                                    clearable v-model:value="model.show_time" />
                    <n-input-group-label>秒</n-input-group-label>
                  </n-input-group>
                </n-form-item-gi>
              </n-gi>
            </n-grid>
          </n-form-item>
          <n-form-item label="关闭按钮" path="close_button_time_long" :show-feedback="false">
            <n-radio-group v-model:value="model.close_button_time_long" @update:value="changeCloseTime">
              <n-radio :value="item.value" style="height: 32px; margin-top: 6px;min-width:100px;"
                       :key="item.value" v-for="(item, index) in closeTime">
                <template v-if="[-1, 0, 5, 10, 15].includes(item.value)">{{
                    item.label
                  }}</template>
                <template v-if="[-2].includes(item.value)">
                  <div class="input-warp-box">
                    <span>自定义</span>
                    <n-form-item-gi :path="
                                            [-2].includes(model.close_button_time_long)
                                                ? 'closeObj.close_button_time'
                                                : ''
                                        " style="
                          width: 200px;
                          margin-left: 10px;
                          margin-top: -5px;
                        " v-if="[-2].includes(model.close_button_time_long)">
                      <n-input-group>
                        <n-input-number style="width: 100px" :show-button="false" :min="0"
                                        :max="600" clearable :ref="
                                                        (el) => {
                                                            if (el) closeTimeInput[index] = el
                                                        }
                                                    " v-model:value="model.closeObj.close_button_time" />
                        <n-input-group-label>秒之后</n-input-group-label>
                      </n-input-group>
                    </n-form-item-gi>
                  </div>
                </template>
              </n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="倒计时" path="count_down" :show-feedback="false"
                       style="margin-bottom: 16px; margin-top: 10px">
            <n-grid :cols="1" :y-gap="10">
              <n-gi>
                <n-radio-group v-model:value="model.count_down">
                  <n-radio style="min-width:100px;" :value="item.value" :key="item.value"
                           v-for="item in count_down">{{
                      item.label
                    }}</n-radio>
                </n-radio-group>
              </n-gi>
            </n-grid>
          </n-form-item>
          <n-form-item label="是否截图" path="screenshot" style="margin-bottom: 16px; margin-top: 5px"
                       :show-feedback="false">
            <template #label>
              是否截图
              <Tooltip>
                <div class="question-box">
                  <!-- 触发器 -->
                  <QuestionCircle20Regular></QuestionCircle20Regular>
                </div>

                <!-- 内容 -->
                <template #header>
                  <p style="margin-bottom: 10px">
                    ① 默认截图：首中尾三个位置分别截图一张，共三张
                  </p>
                  <p>② 自定义：按照指定时间截图</p>
                </template>
              </Tooltip>
            </template>
            <n-radio-group v-model:value="model.screenshot" @update:value="changeScreenShot">
              <n-space>
                <n-grid :cols="1">
                  <n-gi>
                    <n-radio :value="item.value"
                             style="height: 32px; margin-top: 6px;min-width:100px;" :key="item.value"
                             v-for="item in screenShot">{{ item.label }}</n-radio>
                  </n-gi>
                </n-grid>
              </n-space>
              <n-space v-if="[2].includes(model.screenshot)">
                <n-grid :cols="1">
                  <n-gi style="margin-top: 5px">
                    <shotTime v-model.number="model.screen_shot_list"></shotTime>
                  </n-gi>
                </n-grid>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="远近切换" path="scene_change" :show-feedback="false" style="margin-bottom: 10px">
            <template #label>
              远近切换
              <Tooltip>
                <div class="question-box">
                  <!-- 触发器 -->
                  <QuestionCircle20Regular></QuestionCircle20Regular>
                </div>

                <!-- 内容 -->
                <template #header>
                  <p style="margin-bottom: 10px">
                    ①
                    先远后近：先远景录制广告播放直至完毕，待主界面展示全后，再拉近拍百度时间、拉近拍厂商logo
                  </p>
                  <p>② 先近后远：先近景拍厂商logo，再远景拍全屏直到广告结束</p>
                </template>
              </Tooltip>
            </template>
            <n-radio-group v-model:value="model.scene_change">
              <n-radio :value="item.value" style="height: 32px; margin-top: 6px;min-width:100px;"
                       :key="item.value" v-for="item in farNear">{{ item.label }}</n-radio>
            </n-radio-group>
          </n-form-item>
          <!-- Tab 子任务 -->
          <n-form-item>
            <n-grid cols="24" item-responsive>
              <n-grid-item span="600:24 1000:14">
                <Tabs v-model="model.item_list" :id="model.id"></Tabs>
              </n-grid-item>
            </n-grid>
          </n-form-item>
          <n-form-item label="描述" path="description">
            <n-input v-model:value="model.description" placeholder="请输入描述" type="textarea" maxlength="200"
                     style="width: 50%" :autosize="{
                                minRows: 3
                            }" />
          </n-form-item>
                    <n-form-item label="录屏名称" path="task_name_left">
                        <n-grid :col="24">
                            <n-gi :span="12">
                                <!-- <n-input

                                    v-model:value="model.task_name"
                                    placeholder="请输入录屏名称"
                                    maxlength="60"
                                    @input="changeTaskName"
                                /> -->
                                <n-form-item-gi style="width: 400px">
                                    <n-input-group>
                                        <n-input style="width: 150px" clearable @input="changeTaskName"
                                            placeholder="请输入录屏名称" maxlength="60" v-model:value="model.task_name_left" />
                                        <n-input-group-label>{{
                                            model.task_name_right
                                        }}</n-input-group-label>
                                    </n-input-group>
                                </n-form-item-gi>
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                </n-form>
            </n-grid-item>
            <n-grid-item :offset="2" :span="18" style="margin-top: 20px;">
                <!-- 操作按钮 -->
                <div style="display: flex; justify-content: center">
                    <n-button :text="true" class="btn-txt" @click="goBack" :loading="model.click_state">取消</n-button>
                    <n-button type="warning" v-permissions="submitCode" style="margin-left: 10px" @click.prevent="submit"
                        v-preventReClick :loading="model.click_state">
                        保存并关闭</n-button>
                </div>
            </n-grid-item>
    </n-grid>

    <n-icon size="160px" :depth="5" class="bg_icon_2">
            <ReceiptAdd20Regular />
        </n-icon>
    </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { ReceiptAdd20Regular } from '@vicons/fluent'
import dayjs from 'dayjs'
import {
  showStyle,
  alertPosition,
  sourcePosition,
  openSourceClick,
  sourceClick,
  broadcastType,
  makeAnAppointment,
  screenShot,
  farNear,
  closeTime,
  count_down,
  real_time_flag,
  sinatvType,
  JumpList,
  parameterOptions,
  auto_play,
} from '../constant/screen'
import UpLoad from '@/components/upload-file/index.vue'
import Tabs from './components/tabs.vue'
import shotTime from './components/shotTime.vue'
import ParamsList from './components/paramsList.vue'
import { uploadMaterialFileApi, GetScreenDetailsApi } from '@/config/api'
import { useState, useSave, useHandle, useMounted } from './use/addOrUpdate'
import { useRouter, useRoute } from 'vue-router'
import Tooltip from '@/components/toolTip/index.vue'
import { QuestionCircle20Regular } from '@vicons/fluent'

let {
  model,
  rules,
  generalOptions,
  appOptions,
  cornerOptions,
  cityOptions,
  formRef,
  closeTimeInput,
  taskNameStatus,
  cornerInput,
  uploadState,
  tempOptions,
  addType,
  uploadType
} = useState()
let { submit, changeStyle } = useSave(
    model,
    formRef,
    taskNameStatus,
    uploadState,
    addType,
    uploadType,
)
let {
  setName,
  changeTaskName,
  changeCloseTime,
  changeScreenShot,
  changeClickType,
  changeCornerLocation,
  changeStandardTime,
  addParams,
  minuParams,
  changeUpload,
  changeCornerType,
  ChangeAppointment,
  getUploadState,
  getRecordTime,
  handleSearch,
  getUploadType
} = useHandle(model, taskNameStatus, closeTimeInput, cornerInput, uploadState, uploadType)
let { getAdSourceList, getTempList } = useMounted(
    generalOptions,
    appOptions,
    cornerOptions,
    cityOptions,
    model,
    tempOptions
)
let submitLoading = ref(false);
const router = useRouter()
const route = useRoute()

const goBack = () => {
  router.push({
    name: 'screen',
  })
}

route.meta.bread[route.meta.bread.length - 1].label = route.query.type == 'update' ?
    '编辑录屏' : route.query.type == 'copy' ? '复制录屏' : '新建录屏';

const submitCode = route.query.type  ? 'record-screen:update' : 'record-screen:save'

onMounted(() => {
  setName()
  getAdSourceList()
  getDetail()
  getTempList()
})

const getDetail = async () => {
  const id: any = route.query.id
  const type: any = route.query.type
  if (id) {
    model.value.id = id
    addType.value = type
    let { data, code } = await GetScreenDetailsApi({
      id: id,
    })

    if (code == 200) {
      // 处理是否截图
      data.screen_shot_list = JSON.parse(data.screenshot_time_long)
      model.value = Object.assign(model.value, data)
      // 处理关闭按钮
      if (![-1, 0, 5, 10, 15].includes(data.close_button_time_long)) {
        model.value.closeObj.close_button_time = data.close_button_time_long
        model.value.close_button_time_long = -2
      }
      //弹窗位置
      if ([4].includes(model.value.corner_location)) {
        model.value.nestedValue.corner_offset_x = model.value.corner_offset_x
        model.value.nestedValue.corner_offset_y = model.value.corner_offset_y
      }
      // 截图自定义
      model.value.screen_shot_list = model.value.screen_shot_list.map(Number)
      // 录屏名称不跟随展示场景修改
      taskNameStatus.value = true
      const nameLength = model.value.task_name.length
      model.value.task_name_left = model.value.task_name.substring(
          0,
          nameLength - 15
      )
      model.value.task_name_right = model.value.task_name.substring(
          nameLength - 15
      )
      let now = new Date()
      if ([1].includes(model.value.real_time_flag)) {
        model.value.task_record_time = `${dayjs(now).format(
            'YYYY-MM-DD HH:mm:ss'
        )}`
        model.value.task_name_right = `_${dayjs(now).format('MM_DD_HH:mm:ss')}`
      }
      if ([5].includes(model.value.ad_type)) {
        const path = model.value.material_list[0].path
        const type = path.substring(path.length - 3);
        getUploadType(type)
      }
    }
  }
}

// 切换展示场景为直播时，标准时间重置为0代表否
const ResetStyle = async (ad_type: Number) => {
  if (ad_type === 7) {
    model.value.real_time_flag = 0;
  }
}
</script>

<style scoped>
.laout-content {
  background: #fafafa;
}

.content {
  background: #fafafa !important;
  padding-bottom: 50px !important;
  margin: var(--theme-box-margin);
}

.content h5 {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #262626;
  margin: 0 0 25px 0;
}

.input-warp-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.input-txt {
  width: 40px;
  height: 30px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.input-box {
  padding: 0 15px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 3px;
}

.input-box:hover {
  border: 1px solid #fa8c16;
}

.input-box .left,
.input-box .right {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #262626;
}

.n-space {
  align-items: center;
}

.content :deep(.n-form-item .n-form-item-label) {
  color: #999999 !important;
}

.content :deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab) {
  border: none;
  background: none;
  border-bottom: 1px solid rgb(239, 239, 245);
}

.content :deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab.n-tabs-tab--active) {
  border-bottom: 1px solid #fa8c16;
}

.content :deep(.n-base-close:hover) {
  color: #595959;
}

.content :deep(.model-id .n-form-item-feedback-wrapper) {
  grid-column: span 8 / span 8;
  margin-left: calc(((100% - 476px) / 8) * 2 + 136px);
}

.content :deep(.input-txt .n-input-wrapper) {
  padding: 0 !important;
}

.content :deep(.input-txt .n-input__input-el) {
  width: 40px;
  height: 30px;
  border: none !important;
  outline: none;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-image: none !important;
  border-image-width: 0 !important;
}

.question-box {
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  z-index: 999;
  width: 20px;
  display: inline-block;
}

.add-icon-box,
.question-box {
  color: #999999 !important;
}
</style>