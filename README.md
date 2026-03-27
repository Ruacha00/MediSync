# MediSync 演示系统使用说明

本 README 仅用于指导用户如何操作和演示 MediSync 原型系统，不包含部署、安装或启动说明。

## 1. 系统概览

MediSync 是一个面向慢病患者的智能用药提醒原型系统，包含两个主要入口：

- `Patient App`：患者端，用于查看提醒、记录服药、管理药物与查看依从性趋势。
- `Care Dashboard`：管理端，用于查看患者总体情况、识别高风险人群、查看报表和集成状态。

系统首页可在两个入口之间切换。

## 2. 推荐演示顺序

如果用于课堂展示或答辩，建议按以下顺序操作：

1. 从首页进入 `Patient App`
2. 展示今日提醒与 AI 自适应提醒逻辑
3. 展示“稍后提醒”“漏服补救”“出门前提醒”等场景
4. 展示药物管理与 EHR 同步
5. 展示依从性历史与改善趋势
6. 返回首页并进入 `Care Dashboard`
7. 展示总体看板、高风险患者、患者详情、群体报表和 EHR 集成状态

## 3. 患者端使用方法

### 3.1 首页 Home

首页用于展示当天的服药任务和完成进度。

可执行操作：

- 查看 `Today's Progress`，确认当天已完成剂次与总剂次。
- 查看 `Today's Reminders` 中的每一条提醒卡片。
- 点击 `Why this time?`，查看 AI 为何将提醒安排在当前时间。
- 对提醒执行以下操作：
  - `Taken`：记录已服药
  - `Later`：稍后提醒
  - `Skip`：跳过本次

特殊提醒类型：

- `Departure Reminder`：当系统识别到用户即将外出时，会提示在离开前服药。
- `Catch-up`：当出现漏服且仍在安全补服窗口内时，系统会建议立即补服。

### 3.2 演示控制面板 Demo Control Panel

患者端桌面视图左侧带有 `Demo Control Panel`，用于快速触发演示场景。

可执行操作：

- `Send Reminder`：为某个药物触发一条新的提醒通知。
- `Missed Dose Alert`：将当前待处理提醒变为漏服场景。
- `Departure Reminder`：生成出门前提醒。
- `Snooze Follow-up`：将已稍后提醒的任务再次推送出来。
- `AI Smart Reschedule`：模拟 AI 因检测到冲突事件而自动调整提醒时间。
- `Reset All Reminders`：恢复默认演示状态。

建议演示方式：

1. 先点击某个药物的 `Send Reminder`
2. 观察顶部推送通知与首页提醒卡片变化
3. 对提醒执行 `Taken`、`Later` 或 `Skip`
4. 再分别触发 `Missed Dose Alert` 和 `AI Smart Reschedule`
5. 最后使用 `Reset All Reminders` 恢复初始状态

### 3.3 药物页 Medications

该页面用于查看当前药物列表，并模拟新增药物或从 EHR 同步处方。

可执行操作：

- 点击 `Add` 打开新增药物表单
- 填写：
  - 药物名称
  - 剂量
  - 安全补服窗口
  - 分类
  - 频次
  - 处方时间
- 点击 `Add Medication` 完成新增

新增后系统会自动为该药物生成提醒。

另外可点击：

- `Sync from EHR (FHIR)`：模拟从医院 EHR 同步处方药物到患者端

同步完成后，药物会以 `EHR Imported` 标识显示。

### 3.4 历史页 History

该页面用于查看依从性趋势和对比结果。

可执行操作：

- 切换 `7 Days`、`14 Days`、`30 Days` 时间范围
- 查看：
  - 30 天依从率
  - 改善幅度
  - 趋势图
  - `Before vs After MediSync` 柱状对比
  - `Daily Overview` 日历热力图

该页面适合用于说明系统在长期依从性改善方面的价值。

### 3.5 设置页 Settings

该页面用于展示系统连接状态和用户偏好。

可执行操作：

- 查看连接状态：
  - `Calendar`
  - `EHR (FHIR)`
- 开关以下功能：
  - `Push Notifications`
  - `Departure Reminders`
  - `AI Adaptive Timing`
- 查看：
  - `Privacy Policy`
  - `HIPAA Compliance`

演示建议：

- 关闭 `Push Notifications`，说明无通知时顶部提醒不会出现
- 关闭 `Departure Reminders`，说明出门前提醒可按用户偏好控制
- 关闭 `AI Adaptive Timing`，说明系统可退回固定处方时间模式

### 3.6 引导页 Onboarding

如果需要展示新用户首次使用流程，可进入 `Onboarding` 页面。

演示流程包括：

1. 欢迎页
2. 个人信息填写
3. 药物导入
4. 日历授权
5. 完成设置并进入患者首页

其中药物导入可模拟：

- 手动添加
- 从 EHR 导入处方

## 4. 管理端使用方法

### 4.1 总览页 Dashboard Overview

该页面用于展示群体级运营视角。

可查看内容：

- `Total Patients`
- `Avg Adherence`
- `High Risk`
- `Today's Alerts`

页面下方包含：

- `High Risk Alerts`：高风险患者提醒列表
- `All Patients`：所有患者的表格视图

可执行操作：

- 点击高风险患者或表格中的 `View`，进入患者详情页

### 4.2 患者详情页 Patient Detail

该页面用于查看单个患者的详细情况。

可查看内容：

- 30 天依从率
- 药物数量
- 连续漏服次数
- 改善幅度
- 30 天依从性趋势图
- 当前药物列表
- `AI Insight` 风险分析说明
- 最近 7 天活动记录

适合用于展示管理者如何快速定位重点干预对象。

### 4.3 报表页 Reports

该页面用于查看群体统计与导出结果。

可查看内容：

- 月度依从性趋势
- 通知响应分布
- `Baseline vs MediSync` 对比
- 依从性分布

可执行操作：

- 点击 `Export Report` 导出群体报告 CSV

页面底部还展示了：

- 面向保险方的去标识化报表说明

### 4.4 集成页 Integration

该页面用于展示系统与 EHR 的集成能力。

可查看内容：

- 各医院系统连接状态
- 最近同步时间
- 已连接患者数量
- FHIR 数据流向示意图
- 最近 API 调用记录

可执行操作：

- 对断开的连接点击 `Retry Connection`，模拟重新建立连接

该页面适合说明系统具备医院系统对接能力，同时支持与保险方之间的数据隔离。

## 5. 典型演示场景

### 场景一：AI 智能提醒

1. 进入患者端首页
2. 触发一个 `Send Reminder`
3. 点击提醒卡片中的 `Why this time?`
4. 说明系统会根据用户习惯选择更容易完成服药的时间

### 场景二：漏服后的安全补救

1. 先保证首页存在待处理提醒
2. 点击 `Missed Dose Alert`
3. 观察提醒变为 `Catch-up`
4. 点击 `Take Now` 或 `Remind Later`

### 场景三：行为适应性重排

1. 在存在普通待处理提醒时点击 `AI Smart Reschedule`
2. 观察提醒时间变化
3. 展示 AI 会根据冲突事件自动调整时间

### 场景四：从 EHR 导入药物

1. 进入 `Medications`
2. 点击 `Sync from EHR (FHIR)`
3. 观察药物列表增加，且带有 `EHR Imported` 标识

### 场景五：管理端识别高风险患者

1. 进入 `Care Dashboard`
2. 查看 `High Risk Alerts`
3. 点击任一高风险患者
4. 在详情页展示连续漏服、趋势图和 AI Insight

## 6. 使用说明与注意事项

- 本系统为演示原型，页面中的提醒、同步、图表和 API 日志均为模拟数据或交互流程。
- 推荐在桌面端演示患者视图，这样可以同时看到手机框界面和左侧 Demo 控制面板。
- 若需重复演示患者提醒流程，优先使用 `Reset All Reminders` 恢复初始状态。
- 患者端更适合展示“用户体验”和“AI 提醒逻辑”；管理端更适合展示“群体管理”和“业务价值”。

## 7. 一句话演示口径

MediSync 通过 AI 自适应提醒、漏服补救、日历感知和 EHR/FHIR 集成，帮助患者更稳定地完成服药，同时让医疗管理者实时识别高风险人群并查看群体级改善效果。
