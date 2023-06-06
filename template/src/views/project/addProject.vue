<template>
    <div class="add-project">
        <n-back-top :right="100" />
        <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18">
                <n-form ref="formRef" :model="model" :rules="rules" label-placement="left"
                    require-mark-placement="right-hanging" :disabled="model.out_time1_day_flag" label-width="100px">
                    <div class="block-item">
                        <h5>基本信息</h5>
                        <template v-if="isSkeleton">
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" height="120px"/>
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" height="150px"/>
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" height="150px"/>
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" height="150px"/>
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" />
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" height="150px"/>
                            </n-space>
                          </n-form-item>
                          <n-form-item>
                            <n-space align="flex-start">
                              <n-skeleton text :repeat="1" width="80px" class="skeleton-title"/>
                              <n-skeleton text :repeat="1" width="550px" height="100px"/>
                            </n-space>
                          </n-form-item>
                        </template>
                        <template v-if="!isSkeleton">
                          <n-form-item path="type" label="投放模式">
                              <div class="project-type-box">
                                  <div class="img-radio-box" v-for="item in projectTypeList" :class="pojectClass(item)"
                                      :key="item.value"
                                      @click="() => { return model.out_time1_day_flag || model.first_pass == 1 ? null : updateTypeCick(item.value) }">
                                      <div class="radio-left-box">
                                          <p>{{ item.name }}</p>
                                          <p v-html="item.describe"></p>
                                      </div>
                                      <div class="radio-right-box">
                                          <n-icon style="margin-right:5px;" class="radio-right-icon">
                                              <PaperPlaneOutline v-if="item.value == 1" />
                                              <AiStatus v-else />
                                          </n-icon>
                                      </div>
                                  </div>
                              </div>
                          </n-form-item>
                          <n-form-item label="下单部门" path="department_id">
                          <n-grid :cols="24">
                            <n-gi :span="18">
                              <n-radio-group v-model:value="model.department_id">
                                <n-radio v-for="(item,index) in departmentList" :value="item.id"
                                         :disabled="item.gray_show" @change="departmentChange(index)">{{
                                    item.name }}</n-radio>
                              </n-radio-group>
                            </n-gi>
                          </n-grid>
                        </n-form-item>
                          <n-form-item label="来源" path="region_id" v-if="regionList.length > 0">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-radio-group v-model:value="model.region_id">
                                          <n-radio v-for="item in regionList" :value="item.id" :disabled="item.gray_show">{{
                                              item.name }}</n-radio>
                                      </n-radio-group>
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="下单日期" path="push_time">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-date-picker style="width: 450px" placeholder="请选择真实的下单日期"
                                          v-model:formatted-value="model.push_time" type="date"
                                          value-format="yyyy-MM-dd HH:mm:ss" clearable
                                          :is-date-disabled="datePushTimeDisabled" />
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <!--                        <n-form-item label="合同" path="contract_id">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-select style="width: 450px;display: inline-block;margin-right: 20px" v-model:value="model.contract_id" label-field="name"
                                          filterable value-field="id" placeholder="下拉选择合同" :options="contractList"
                                          clearable @change="contractChange"/>
                                      <n-button text type="warning" v-show="model.contract_id" @click="showContractDetails"> 详情</n-button>
                                  </n-gi>
                              </n-grid>
                          </n-form-item>

                          <n-form-item v-show="model.contract_id" label="公司主体">
                            <n-grid :cols="24">
                              <n-gi :span="18">
                                <span class="form-span">{{contractInfo.company_body_name}}</span>
                              </n-gi>
                            </n-grid>
                          </n-form-item>-->
                          <n-form-item label="广告主" path="advertiser_id">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-select style="width: 450px" v-model:value="model.advertiser_id" placeholder="下拉选择广告主"
                                          filterable label-field="name" value-field="id" @update:value="advertiserChange"
                                          :options="advertiserList" clearable :disabled="model.first_pass == 1" />
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="客户类型" v-show="model.advertiser_id">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <span class="form-span">{{ clientTypeName }}</span>
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="下单销售" path="employee_id">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-select style="width: 450px" v-model:value="model.employee_id" label-field="name"
                                          filterable value-field="id" placeholder="下拉选择下单销售" :options="employeeList"
                                          clearable />
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="所属行业" v-show="model.industry_name">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <p style="font-size: 14px">{{ model.industry_name }}</p>
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                        <n-form-item  path="sales_assistant" label="销售助理">
                          <n-grid :cols="24">
                            <n-gi :span="18">
                              <n-checkbox-group v-model:value="model.sales_assistant">
                                <n-space item-style="display: flex;">
                                  <n-checkbox v-for="item in salesList" :value="item.value" :key="item.value">{{
                                      item.name }}</n-checkbox>
                                </n-space>
                              </n-checkbox-group>
                            </n-gi>
                          </n-grid>
                        </n-form-item>
                          <!--
                        <n-form-item label="交易类型" v-if="model.type.includes(2)" path="deal_type">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-radio-group v-model:value="model.deal_type">
                                          <n-radio v-for="item in transTypeList" :key="item.value"
                                              :value="item.value">{{ item.label }}</n-radio>
                                      </n-radio-group>
                                  </n-gi>
                              </n-grid>
                          </n-form-item>-->
                          <n-form-item label="DSP平台" v-if="model.type.includes(2)" path="dsp_id">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-select style="width: 450px" label-field="name" value-field="id" filterable
                                          v-model:value="model.dsp_id" placeholder="下拉选择DSP平台" :options="dspList"
                                          :disabled="model.first_pass == 1" clearable />
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="监测公司" path="supervise_company">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-checkbox-group v-model:value="model.supervise_company">
                                          <n-space item-style="display: flex;">
                                              <n-checkbox v-for="item in superviseList" :value="item.id" :key="item.name">{{
                                                  item.name }}</n-checkbox>
                                          </n-space>
                                      </n-checkbox-group>
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="结算依据" path="settle_standard">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <n-checkbox-group v-model:value="model.settle_standard">
                                          <n-space item-style="display: flex;">
                                              <n-checkbox v-for="item in superviseList" :value="item.id" :key="item.name">{{
                                                  item.name }}</n-checkbox>
                                          </n-space>
                                      </n-checkbox-group>
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="排期附件" path="schedule_file">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <batchUpload v-model:fileList="model.schedule_file"
                                        :isDisabled="model.out_time1_day_flag"
                                        :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'"
                                        @handBatchUpload="handBatchUpload"
                                        :isContrast="false"
                                        :valueKey="'schedule_file'"
                                      />
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="监测附件" path="supervise_file">
                              <n-grid :cols="24">
                                  <n-gi :span="18">
                                      <batchUpload v-model:fileList="model.supervise_file"
                                                   :isDisabled="model.out_time1_day_flag"
                                                   :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'"
                                                   @handBatchUpload="handBatchUpload"
                                                   :isContrast="false"
                                                   :valueKey="'supervise_file'"
                                      />
                                  </n-gi>
                              </n-grid>
                          </n-form-item>
                          <n-form-item label="邮件附件" path="email_files">
                          <n-grid :cols="24">
                            <n-gi :span="18">
                              <batchUpload v-model:fileList="model.email_files"
                                           :isDisabled="model.out_time1_day_flag"
                                           :accept="'*'"
                                           @handBatchUpload="handBatchUpload"
                                           :isContrast="false"
                                           :valueKey="'email_files'"
                              />
                            </n-gi>
                          </n-grid>
                        </n-form-item>
                          <!--  <n-form-item label="邮箱截图" path="email_image">
                          <n-grid :cols="24">
                            <n-gi :span="18">
                              <n-upload @before-upload="imageUpload" :file-list-style="{width:'520px'}" :file-list="model.email_image"
                                        :show-file-list="true" list-type="image-card" :max="10" @remove="removeImage"
                                        accept="image/*" >
                              </n-upload>
                            </n-gi>
                          </n-grid>
                        </n-form-item>-->
                          <n-form-item label="投放周期" path="coo_time">
                              <div class="coo_time_update">
                                  <n-date-picker v-if="(isShowChoice(model.coo_time, 'all_select') || type == undefined)"
                                      v-model:formatted-value="model.coo_time" type="daterange"
                                      value-format="yyyy-MM-dd HH:mm:ss" clearable :is-date-disabled="dateCooTimeDisabled"
                                      @update:formatted-value="dateCooTimeChange" />
                                  <div v-else>
                                      <span style="margin-right: 10px" v-if="isShowChoice(model.coo_time, 'start_text')">{{
                                          model.coo_time[0].split(' ')[0] }}
                                          至</span>
                                      <span style="margin-right: 10px" v-if="isShowChoice(model.coo_time, 'end_text')">{{
                                          model.coo_time[1].split(' ')[0] }}
                                      </span>
                                      <n-date-picker style="display: inline-block;"
                                          v-if="isShowChoice(model.coo_time, 'end_select')"
                                          v-model:formatted-value="model.coo_time[1]" type="date"
                                          value-format="yyyy-MM-dd HH:mm:ss" clearable
                                          :is-date-disabled="updateDateCooTimeDisabled"
                                          @update:formatted-value="updateTimeChange" />
                                  </div>
                              </div>
                          </n-form-item>
                          <n-form-item label="投放素材" path="materials_infos">
                              <div class="add-materials-list">
                                  <div>
                                      <n-form-item>
                                          <div>
                                              <div class="materials-upload-box">
                                                  <div class="upload-type-box">
                                                      <n-radio-group @update:value="materialsUploadTypeChange"
                                                          :disabled="uploadLoading"
                                                          v-model:value="model.materials_upload_type"
                                                          name="materials_upload_type">
                                                          <n-radio v-for="item in materialsUploadTypeList" :key="item.value"
                                                              :value="item.value" :disabled="type == 'update'">
                                                              {{ item.label }}
                                                          </n-radio>
                                                      </n-radio-group>
                                                  </div>
                                                  <div class="upload-type-box">
                                                      <n-button v-show="model.materials_upload_type == 2" text type="tertiary"
                                                          @click="downMaterialsExecl">
                                                          <template #icon>
                                                              <n-icon>
                                                                  <Download />
                                                              </n-icon>
                                                          </template>
                                                          下载模版
                                                      </n-button>
                                                      <n-upload @before-upload="materialUpload" :default-upload="false"
                                                          :disabled="uploadLoading" :file-list="uploadList"
                                                          :show-file-list="false" type="warning"
                                                          :multiple="model.materials_upload_type == 1"
                                                          :accept="model.materials_upload_type == 1 ? '.jpg,.png,.mp4' : '.xlsx,.xls'"
                                                          size="medium" class="materials-upload-btn">
                                                          <n-button :disabled="model.out_time1_day_flag" text
                                                              :loading="uploadLoading" type="warning">
                                                              <template #icon>
                                                                  <n-icon>
                                                                      <Upload />
                                                                  </n-icon>
                                                              </template>
                                                              点击上传
                                                          </n-button>
                                                      </n-upload>
                                                  </div>
                                              </div>
                                              <div class="upload-table-box" v-if="model.materials_infos.length">
                                                  <n-data-table :columns="materialsUploadCol" :data="model.materials_infos"
                                                      :bordered="false" />
                                              </div>
                                          </div>
                                      </n-form-item>
                                  </div>
                              </div>
                          </n-form-item>
                          <n-form-item label="素材说明" path="material_msg">
                            <n-grid :cols="24">
                              <n-gi :span="24">
                                <n-input  style="width: 320px" v-model:value="model.material_msg" type="textarea"
                                         v-emoji="1" maxlength="500" :autosize="{
                                                minRows: 3,
                                                maxRows: 3,
                                            }" />
                                <div class="example-box">【示例】<br />A素材：投放周期 05-08 至 05-30
                                  <br />B素材：投放周期 05-18 至 05-28
                                </div>
                              </n-gi>
                            </n-grid>
                          </n-form-item>
                        </template>
                    </div>
                    <div class="block-item" v-if="!isSkeleton">
                        <h5>投放信息</h5>
                        <span class="title-desc">请录入完整信息，以免影响项目执行</span>
                        <n-form-item label="投放量级" path="put_level">
                            <n-grid :cols="24">
                                <n-gi :span="24" style="display:flex; flex-direction: row;">
                                    <n-input style="width: 320px" v-model:value="model.put_level" type="textarea"
                                        v-emoji="1" maxlength="500" :autosize="{
                                            minRows: 3,
                                            maxRows: 3,
                                        }" />
                                    <div class="example-box">【示例】<br />开机：TCL，2034CPM；长虹，2034CPM
                                        <br />贴片：TCL，2034CPM；长虹，2034CPM
                                    </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="投放单价" path="put_price_unit">
                            <n-grid :cols="24">
                                <n-gi :span="24" style="display:flex; flex-direction: row;">
                                    <n-input style="width:320px" v-model:value="model.put_price_unit" type="textarea"
                                        v-emoji="1" maxlength="500" :autosize="{
                                            minRows: 3,
                                            maxRows: 3,
                                        }" />
                                    <div class="example-box">【示例】<br />开机：北上广深29.51元，其他地区25.56元
                                        <br />贴片：北上广深17.85元，其他地区16.07元
                                    </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="投放金额" path="put_price_all">
                            <n-grid :cols="24">
                                <n-gi :span="24" style="display:flex; flex-direction: row;">
                                    <n-input style="width:320px" v-model:value="model.put_price_all" type="textarea"
                                        v-emoji="1" maxlength="500" :autosize="{
                                            minRows: 3,
                                            maxRows: 3,
                                        }" />
                                    <div class="example-box">【示例】<br />开机：236,600.25元<br />贴片：349,600.06元<br />打包价：如有请说明情况
                                    </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="对公返点">
                            <n-grid :cols="24">
                                <n-gi :span="24" style="display:flex; flex-direction: row;">
                                    <n-input style="width: 320px" v-model:value="model.return_point_msg" type="textarea"
                                        v-emoji="1" maxlength="500" :autosize="{
                                            minRows: 3,
                                            maxRows: 3,
                                        }" />
                                    <div class="example-box">【示例】<br />项目返点：按比例 10%<br />框架返点：按比例 20%</div>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                    </div>
                    <div class="block-item" v-if="!isSkeleton">
                        <h5>考核信息</h5>
                        <span class="title-desc">请录入完整信息，以免影响项目执行</span>
                        <n-form-item label="考核KPI" path="settle_kpi_text" class="edit-item">
                            <n-grid :cols="24">
                                <n-gi :span="24" style="display:flex; flex-direction: row;">
                                    <Wangeditor class="settle-box" @getHtml="(val) => { getRemarks(val, 'html') }"
                                        @getText="(val) => { getRemarks(val, 'text') }" @handleBlur="handleEditorBlur"
                                        height="150" :valueHtml="model.settle_kpi_html" :value="model.settle_kpi_text"
                                        :toolbarKeys="toolbarKeys" :defaultContent="jsonContent" :maxLength="500" />
                                    <div class="example-box">
                                        【示例】<br />考核要求:<br />1、若完成率在70%-90%则需要1赔2，完成率低于70%则整波不结算。<br />2、秒针的in-geo%和RTBAsia的IVT%同时考核，超过2%容忍值部分需要进行实结;若in-geo低于90%，则整波不结算。
                                    </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="录屏要求">
                            <n-grid :cols="24">
                                <n-gi :span="24" style="display:flex; flex-direction: row;">
                                    <n-input style="width: 320px" v-model:value="model.video_require" type="textarea"
                                        v-emoji="1" maxlength="500" :autosize="{
                                            minRows: 6,
                                            maxRows: 6,
                                        }" />
                                    <div class="example-box">
                                        【示例】<br />录屏：<br />1、请于上线日及下线日提供带百度时间及不带百度时间录屏，需电视机从关机时启动开始,直至广告结束到主界面停留3s。<br />2、品牌logo、电商logo、百度时间清晰可见。不得有模糊，反光等现象。
                                    </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                    </div>
                    <div class="block-item" v-if="!isSkeleton">
                        <h5>项目名称</h5>
                        <n-form-item label="项目名称" path="name">
                            <n-grid :cols="24">
                                <n-gi :span="24" style="display:flex; flex-direction: row;">
                                    <n-input style="width: 320px" v-model:value="model.name" clearable placeholder="请输入项目名称"
                                        @change="nameChange" :disabled="model.first_pass == 1" maxlength="30" />
                                    <div class="example-box" style="color: red;align-items: center;display:flex;">请与结算单中的名称一致，否则影响审核 </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item>

                    </div>
                </n-form>
                <!-- 操作按钮 -->
                <div style="display: flex; justify-content: center;margin-bottom: 10px">
                    <n-button :loading="model.click_state" :text="true" class="btn-txt" @click="goBack">取消</n-button>
                    <n-button :loading="model.click_state" type="warning" v-permissions="submitCode" class="btn-submit"
                        @click.prevent="checkSubmit(1)" v-preventReClick :disabled="model.out_time1_day_flag">
                        保存并关闭</n-button>
                    <n-button v-if="type != 'update'" :loading="model.click_state" type="warning" v-permissions="submitCode"
                        class="btn-submit" @click.prevent="checkSubmit(2)" v-preventReClick>
                        保存并继续新建</n-button>
                </div>
            </n-grid-item>
        </n-grid>
        <n-icon size="160px" :depth="5" class="bg_icon">
            <TaskListSquareAdd20Regular />
        </n-icon>
        <contractDetails ref="contractDetailsRef" />
        <!-- 改单原因弹窗 -->
        <changeReason v-model:show="showChangeModel" v-model:loading="model.click_state" @submit="submitCallback" />
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, watchEffect } from 'vue'
import { TaskListSquareAdd20Regular } from '@vicons/fluent'
import {
    saveSubjectApi,
    getSubjectInfoApi,
    updateSubjectApi,
    getAdvertiserListApi,
    getSysDictListApi,
    uploadFileBatchApi,
    uploadMaterialBatchFileApi,
    uploadMaterialsExcelFileApi,
    getParentRegionListApi,
    GetContractListApi,
    GetEmployeeListApi,
    GetregionListApi,
    GetFindUploadTemplateApi,
} from '@/config/api'
import { useRouter, useRoute } from 'vue-router'
import useStore from "@/config/pinia";
import {
    projectTypeList,
    transTypeList,
} from '../constant'
import batchUpload from '@/components/batch-upload/index.vue'
import porjectInfo from './use/project'
import {
    AiStatus
} from '@vicons/carbon'
import { PaperPlaneOutline } from '@vicons/ionicons5'
import { Download, Upload } from '@vicons/tabler'
import contractDetails from './components/contractDetails.vue'
import Wangeditor from '@/components/wangeditor/wangeditor.vue'
import changeReason from '@/components/changeReason/changeReason.vue'

import { startOfDay, add, set } from 'date-fns/esm'
import { cloneDeep, uniqueId } from 'lodash'
import { downLoadFile } from '@utils'
import { useDialog } from "naive-ui";
const router: any = useRouter()
const route: any = useRoute()
let advertiserList = ref([]);//广告主
let dspList = ref([]);//dsp
let superviseList = ref([]);//监测公司
let brandList = ref([]);//品牌
const formRef: any = ref(null);
let { model, oldModel, rules, materialsUploadCol } = porjectInfo;
let regionList = ref([]);
let salesList = ref([]);
let departmentList = ref([]); //下单部门
let showChangeModel = ref(false);
let contractList = ref([])
let contractInfo = reactive({
    company_body_name: '',
    company_name: ''
})
let uploadList = ref([]);
let toUploadList = [];//待上传集合
let uploadTimeOut = null;
let employeeList = ref([])//下单销售
let clientTypeName = ref('')//客户类型
const uploadLoading = ref(false);
const toolbarKeys = [
    'bold',
    'color',
    '|',
]
let isAllowUpdateName = ref(false);

const materialsUploadTypeList = [
    { label: "选择文件", value: 1 },
    { label: "模版导入", value: 2 },
]

let id: any = 0;
let type: any = ref('');
let contractDetailsRef: any = ref(null);
const dialog: any = useDialog()
const isSkeleton = ref(false);
isSkeleton.value = route.query.type != 'update' ? false : true;

const goBack = () => {
    router.push({
        name: 'project',
    })
}

const handBatchUpload = (fileList,valueKey) => {
  if(model[valueKey].length + fileList.length > 5){
    window.$notification['error']({
      content: "错误提示",
      meta: `最多支持上传5个文件！`,
      duration: 3000
    });
    return ;
  }
  let isForm = false;
  let file = new FormData();
  fileList.forEach(item => {
    file.append('file', item)
  })
  upload(file,isForm).then(res => {
    model[valueKey].push(...res.data);
    formRef.value?.validate(
        (errors) => { },
        (rule) => {
          return rule?.key === valueKey;
        }
    );
  });

}

const jsonContent = [
{
      type: 'paragraph',
      children: [
        { text: '', fontSize: '14px' },
      ],
      lineHeight: '20px'
    }
]

let submitCode = route.query.id ? 'subject:update' : 'subject:save';

//展示合同详情弹框
const showContractDetails = () => {
    contractDetailsRef.value.openShow();
}

const departmentChange = (index) => {
  model.region_id = undefined;
  regionList.value  =  departmentList.value[index].sub_list;
}

//保存弹框
const submitCallback = async (modify_msg: string) => {
    if (modify_msg) {
        model.modify_order_cause = modify_msg;
        await submit();
        showChangeModel.value = false;
    }
}

const contractChange = (id) => {
    let info = contractList.value.find(item => item.id == id)
    if (info) {
        contractInfo.company_body_name = info.company_body_name;
        contractInfo.company_name = info.company_name;
    }
}
const nameChange = () => {
    isAllowUpdateName.value = true;
}
/*watchEffect(() => {
    if ( type.value == 'update' || isAllowUpdateName.value) {
        return;
    }
    let name = '';
    if (model.advertiser_id) {
        name = (advertiserList.value.find(item => {
            return item.id == model.advertiser_id;
        }) as any).name
    }
    let dateInfo = format(new Date(), 'MM_dd_hh_mm_ss');
    model.name = `${name}_${dateInfo}`
})*/

const pojectClass = (item) => {
    let itemClass = '';
    itemClass += model.type.includes(item.value) ? 'active-box ' : '';
    itemClass += model.out_time1_day_flag ? 'disabled-box' : '';
    return itemClass;
}

/**
 * 周期的所有判断条件的集合
 */
const isShowChoice = (coo_time: any, select_condition: string) => {
    if (!coo_time && select_condition != 'all_select') {
        return false;
    }
    switch (select_condition) {
        case "start_text": {
            return (startOfDay(new Date(coo_time[0])) < set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }) || ([4, 6].includes(model.status)))
        }
        case "end_text": {
            return model.out_time1_day_flag;
        }
        case "end_select": {
            return !model.out_time1_day_flag;
        }
        case "all_select": {
            if (!coo_time) {
                return true;
            } else {
                return (startOfDay(new Date(coo_time[0])) >= set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }) && (![4, 6].includes(model.status)) && !model.out_time1_day_flag);
            }
        }
    }
}

const checkSubmit = (status = 1) => {
    formRef.value.validate((error: any) => {
        if (error) {
            window.$notification['error']({
                content: '错误提示',
                meta: error[0][0].message,
                duration: 3000,
            })
        } else {
            // && isUpdateSusceptible(oldModel,model,['type','advertiser_id','schedule_file','coo_start_time','coo_end_time','name'])
            if (type.value == 'update' && model.first_pass == 1) {
                showChangeModel.value = true;
            } else {
                submit(status)
            }
        }
    })
    return true;
}
//status 代表普通创建和 继续新建
const submit = (status = 1) => {
    model.click_state = true;
    let formModel = cloneDeep(model);
    if (type.value == 'update') {
        updateSubjectApi(formModel).then(() => {
            window.$message.success('更新成功')
            router.push('/project');
        }).catch(() => {
            model.click_state = false;
        })
    } else {
        saveSubjectApi(formModel).then(() => {
            window.$message.success('新增成功');
            if (status == 1) {
                router.push('/project');
            } else {
                window.location.reload();
            }
        }).catch(() => {
            model.click_state = false;
        })
    }

}

const upload = async (file: any,isForm) => {
    return await uploadFileBatchApi(file,isForm);
}

const materialsUploadTypeChange = (value: string | number | boolean) => {
    if (model.materials_infos.length == 0) return;
    dialog.warning({
        title: '系统提示',
        content: `如切换为文件上传/模版导入，已上传内容将被清空，确定继续？`,
        positiveText: '确定',
        negativeText: '取消',
        onNegativeClick: () => {
            model.materials_upload_type = value == 2 ? 1 : 2;
        },
        onPositiveClick: () => {
            model.materials_infos = [];
        }
    })
}

const advertiserChange = (value: any) => {
    let target = advertiserList.value.find(item => {
        return item.id == value;
    })
    clientTypeName.value = target.type_name;
    model.industry_name = target?.industry ?? '';
}

/* 和邮箱截图关联
const imageUpload = ({ file }) => {
    upload(file).then((res: any) => {
        model.email_image.push(res);
        formRef.value?.validate(
            (errors) => { },
            (rule) => {
                return rule?.key === "email_image";
            }
        );
    });
    return false;
}
const removeImage = (options) => {
    model.email_image = model.email_image.filter(item => {
        return item.url != options.file.url
    });
    return true;
}*/

/**
 * 物料上传
 */
const materialUpload = ({ file }: any) => {
    if (file.file.size > 1024 * 1024 * 500) {
        window.$message.error('素材上传大小不能超过500MB!');
        return;
    }
    if (model.materials_upload_type == 1) {
        toUploadList.push(file.file);
        if (uploadTimeOut) {
            clearTimeout(uploadTimeOut);
        }
        uploadTimeOut = setTimeout(() => {
            uploadMaterials();
        }, 300)
    } else {
        uploadExecl(file.file);
    }

    return false;
}
const uploadMaterials = () => {
    if (toUploadList.length > 10) {
        window.$notification['error']({
            content: "错误提示",
            meta: `每次最多支持上传10个素材文件！`,
            duration: 3000
        });
        toUploadList = [];
        return;
    }
    if (uploadLoading.value == false) {
        uploadLoading.value = true;
    }
    let isForm = false;
    let file = new FormData();
    toUploadList.forEach(item => {
        file.append('file', item)
    })
    uploadMaterialBatchFileApi(file, isForm).then(res => {
        let data = res.data;
        let count = 0;
        data.map(item => {
            let isPath = model.materials_infos.find(mItem => {
                return mItem.md5 == item.md5;
            })
            if (isPath == undefined) {
                model.materials_infos.push(item);
                count++;
            }
            item.status = 'canDelete';
            return item;
        })
        uploadList.value = model.materials_infos;
        uploadLoading.value = false;
        toUploadList = [];
        window.$message.success(`成功添加${count}条素材!`);
    }).catch(() => {
        uploadLoading.value = false;
        toUploadList = [];
    })
}
const uploadExecl = (file) => {
    let isForm = true;
    if (uploadLoading.value == false) {
        uploadLoading.value = true;
    }
    uploadMaterialsExcelFileApi({ file }, isForm).then(res => {
        let data = res.data;
        let count = 0;
        if (type.value == 'update') {
            data.map(item => {
                let targetIndex = 0;
                let isPath = model.materials_infos.find((mItem, index) => {
                    if (mItem.path == item.path) {
                        targetIndex = index;
                        return true;
                    }
                })
                if (isPath == undefined) {
                    item.status = 'canDelete';
                    model.materials_infos.push(item);
                } else {
                    item.status = type.value == 'update' ? 'noDelete' : 'canDelete';
                    model.materials_infos[targetIndex] = item;
                }
                return item;
            })
        } else {
            model.materials_infos = data;
        }
        uploadList.value = model.materials_infos;
        uploadLoading.value = false;
        window.$message.success(`上传成功！`);
    }).catch(() => {
        uploadLoading.value = false;
    })
}

const downMaterialsExecl = async (url: string) => {
    let { data } = await GetFindUploadTemplateApi();
    downLoadFile(data)
}

const removeSuperviseFile = () => {
    model.supervise_file = [];
}

/**
 * 投放周期change
 */
const dateCooTimeChange = (value: any) => {
    model.coo_time = value;
    model.materials_infos = model.materials_infos.map(item => {
        item.coo_time = null;
        item.coo_start_time = null;
        item.coo_end_time = null;
        return item;
    })
    if (model.coo_time && model.coo_time.length) {
        model.coo_start_time = model.coo_time[0];
        model.coo_end_time = model.coo_time[1];
    } else {
        model.coo_start_time = null;
        model.coo_end_time = null;
    }
}
/**
 * 投放素材编辑时
 */
const updateTimeChange = (value: any) => {
    model.coo_end_time = value;
    model.coo_time[1] = value;
}

const dateCooTimeDisabled = (ts: number, type: 'start' | 'end', range: [number, number] | null) => {
    const itemDate = startOfDay(new Date(ts));
    const newDate = set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const nextData = add(new Date(), { months: 3 });
    return itemDate < newDate || itemDate >= nextData;
}
const datePushTimeDisabled = (ts: number, type: 'start' | 'end', range: [number, number] | null) => {
    const itemDate = startOfDay(new Date(ts));
    const newDate = set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    return itemDate > newDate;
}
const updateDateCooTimeDisabled = (ts: number, type: 'start' | 'end', range: [number, number] | null) => {
    const itemDate = startOfDay(new Date(ts));
    const newDate = set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const nextData = add(new Date(), { months: 3 });
    const startTime = startOfDay(new Date(model.coo_start_time));
    return itemDate < newDate || itemDate >= nextData || itemDate <= startTime;
}


/**
 * 切换类型
 */
const updateTypeCick = (value) => {
    if (model.type.includes(value)) {
        model.type = model.type.filter(item => item != value)
    } else {
        model.type.push(value);
    }
    if (!model.type.includes(2)) {
        model.deal_type = null;
        model.dsp_id = null;
    }
    formRef.value?.validate(
        (errors) => { },
        (rule) => {
            return rule?.key === "type";
        }
    );
}

/**
 * 获取合同列表
 */
const getContractList = () => {
    return GetContractListApi().then(res => {
        contractList.value = res.data;
    })
}
/**
 * 获取员工列表
 */
const getEmployeeList = () => {
    GetEmployeeListApi().then(res => {
        employeeList.value = res.data;
    })
}
/**
 * 获取下单部门列表
 */
const getRegionList = () => {
  GetregionListApi().then(res => {
      departmentList.value = res.data;
  })
}
/**
 * 根据用户token 获取区域
 */
/*const getParentRegionList = () => {
    getParentRegionListApi({ subjectId: model.id }).then(res => {
        regionList.value = res.data;
    })
}*/
/**
 * 获取广告主列表
 */
const getAdvertiserList = () => {
    getAdvertiserListApi().then(res => {
        advertiserList.value = res.data;
    })
}


const getRemarks = (val: any, type: string) => {
    if (type == 'text') {
        model.settle_kpi_text = val;
    } else {
        model.settle_kpi_html = val;
    }
}

const handleEditorBlur = () => {
    formRef.value.validate((errors) => { },
        (rule) => {
            return rule?.key === 'settle_kpi_text'
        });
}

const init = async () => {
    id = route.query.id;
    type.value = route.query.type;
    if (type.value == 'update') {
        isSkeleton.value = true;
        await getSubjectInfo(id);
    }
}

const getSubjectInfo = (id: number) => {
    return getSubjectInfoApi({ id: Number(id) }).then(({ data }) => {
        model = Object.assign(model, data)
        model.coo_time = [model.coo_start_time, model.coo_end_time];
        model.materials_infos = model.materials_infos.map(item => {
            item.coo_time = [item.coo_start_time, item.coo_end_time];
            item.uuid = uniqueId();
            item.status = 'noDelete';
            return item;
        })
        regionList.value  =  departmentList.value.find(item =>item.id == model.department_id).sub_list;
        oldModel = cloneDeep(model);

        contractChange(model.contract_id);
        advertiserChange(model.advertiser_id)
        isSkeleton.value = false;
    })
}
watchEffect(
    () => {
        if (type.value == 'update') {
            let targetRegion = regionList.value.find((item: any) => {
                return item.id == model.region_id;
            })
            model.region_id = targetRegion ? model.region_id : undefined;
        }
    }
)
watchEffect(
    () => {
        let isAdvertList = advertiserList.value ? true : false;
        if (type.value == 'update' && isAdvertList && model.advertiser_id) {
            advertiserChange(model.advertiser_id)
        }
    }
)

onMounted(async () => {
    route.meta.bread[route.meta.bread.length - 1].label = route.query.type == 'update' ?
        '编辑项目' : '新建项目';

    getEmployeeList();
    getRegionList();
    getAdvertiserList();
    getSysDictListApi({ type: 'SUPERVISE_COMPANY' }).then(res => {
        superviseList.value = res.data;
    })
    getSysDictListApi({ type: 'BRAND' }).then(res => {
        brandList.value = res.data;
    })
    getSysDictListApi({ type: 'SALES_ASSISTANT' }).then(res => {
        salesList.value = res.data;
    })
    await getContractList();
    await init();
    let dspParams = {
        type: 'DSP',
        id: model.dsp_id,
    }
    if (route.query.type != 'update') {
        delete dspParams.id;
    }
    getSysDictListApi(dspParams).then(res => {
        dspList.value = res.data.map(item => {
            return {
                ...item,
                disabled: item.deleted == 1
            }
        });
    })
    // await getParentRegionList();
})

</script>

<style scoped>
.add-project {
    background: #fafafa !important;
    padding-bottom: 50px !important;
    margin: var(--theme-box-margin);
}

.add-project :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.project-footer {
    display: flex;
    justify-content: end;
}

.add-project h5 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    margin: 0 0 25px 0;
}

.example-box {
    display: inline-block;
    font-size: 14px;
    color: #999;
    margin-left: 20px;
    width: 270px;
}

.coo_time_update {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}

.project-type-box {
    height: 120px;
    margin-left: 5px;
}

.img-radio-box {
    width: 220px;
    height: 70px;
    display: inline-flex;
    border-radius: 5px;
    padding: 20px;
    align-items: center;
    box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
    cursor: pointer;
    border-bottom: 4px solid #00000000;
    margin: 5px 0px;
}

.img-radio-box:nth-child(2) {
    margin-left: 20px;
}

.disabled-box {
    cursor: not-allowed;
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    color: #d6d6d6;
}

.active-box {
    border-bottom: solid 4px #fa8c16;
}

.radio-left-box {
    flex: 2;
}

.radio-left-box p:nth-child(2) {
    line-height: 20px;
    color: #acacac;
    font-size: 12px;

}

.radio-left-box p:nth-child(1) {
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;

}

.radio-right-box {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.radio-right-icon {
    font-size: 40px;
    color: #fa8c16;
}

.add-materials-list>div {
    display: inline-block;
}

.materials-upload-btn {
    text-align: center;
    margin-left: 12px;
    margin-top: 2px;
    display: inline-block;
    vertical-align: top;
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

.add-project :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.add-project :deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab) {
    border: none;
    background: none;
    border-bottom: 1px solid rgb(239, 239, 245);
}

.add-project :deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab.n-tabs-tab--active) {
    border-bottom: 1px solid #fa8c16;
}

.add-project :deep(.n-base-close:hover) {
    color: #595959;
}

.add-project :deep(.model-id .n-form-item-feedback-wrapper) {
    grid-column: span 8 / span 8;
    margin-left: calc(((100% - 476px) / 8) * 2 + 136px);
}

.add-project :deep(.input-txt .n-input-wrapper) {
    padding: 0 !important;
}

.add-project :deep(.input-txt .n-input__input-el) {
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
    position: absolute;
    font-size: 14px;
    z-index: 999;
    left: -42px;
    top: 7px;
    width: 20px;
}

.add-icon-box,
.question-box {
    color: #999999 !important;
}

.title-desc {
    font-size: 14px;
    vertical-align: top;
    line-height: 18px;
    margin-left: 20px;
    color: #999;
}

.add-project .n-upload {
    width: 80px;
    display: inline-block;
}

.add-project .n-upload-trigger {
    line-height: normal;
}
</style>
<style>
@media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {

        /* safri项目编辑重复上传按钮文字定位 */
        .add-project .n-upload {
            width: 80px;
        }
    }
}



.add-project .n-form-item {
    margin-left: 100px !important;
}

.add-materials-list .n-form-item {
    margin-left: 0px !important;
}

.add-project .n-form-item-blank .n-button .n-button__content {
    position: relative !important;
    bottom: 2px;
    right: -5px;
}

.upload-type-box .n-button {
    /*margin-top: 6px !important;*/
}

.upload-type-box .n-button__content {
    bottom: 0px !important;
    right: 0px !important;
}

.add-project .n-date-picker {
    display: inline-block;
    margin-right: 20px;
}

.form-span {
    font-size: 14px;
}

.settle-box {
    width: 320px;
    display: inline-block;
}

.settle-box>#editor-container {
    height: 200px;
}

.materials-upload-box {
    display: flex;
    width: 98%;
    min-width: 500px;
    justify-content: space-between;
}

.upload-type-box {
    display: inline-flex;
    align-items: center;
}

.upload-table-box {
    margin-top: 20px;
}
</style>
