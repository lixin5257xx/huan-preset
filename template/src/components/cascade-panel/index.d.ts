/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2022-11-01 14:53:55
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2022-11-02 14:31:34
 * @FilePath: \operation-web\src\components\cascader-three\index.d.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by lixinxin lixinxin@huan.tv, All Rights Reserved. 
 */
export const cityList: any = [
    {
        id: 1100,
        parent_id: null,
        region_code: '1100',
        name: '概览',
        children: null,
        grade: 1,
        code: "overflow"
    },
    {
        id: 1300,
        parent_id: null,
        region_code: '1300',
        name: '资产',
        code: "monetizing",
        children: [
            {
                id: 1301,
                parent_id: '1300',
                region_code: '1301',
                name: 'DMP素材管理',
                code: "monetizing-sucaiguanli",
                children: [
                    {
                        id: 1311,
                        parent_id: '1301',
                        region_code: '1311',
                        name: '标签管理',
                        children: null,
                        code: "monetizing-direct-biaoqian",
                    },
                    {
                        id: 1312,
                        parent_id: '1301',
                        region_code: '1312',
                        name: 'DMP管理',
                        children: null,
                        code: "monetizing-direct-dmpguanli",
                    },
                ],
            },
            {
                id: 1302,
                parent_id: '1300',
                region_code: '1302',
                name: '素材库',
                children: null,
                code: "monetizing-sucaiku",
            },
        ],
    },
];
