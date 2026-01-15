export interface Template {
  id: string
  name: string
  category: string
  description: string
  content: string
  icon: string
}

export const templates: Template[] = [
  {
    id: 'tech-blog',
    name: '技术博客',
    category: '博客',
    description: '适合技术文章、教程、开发笔记',
    icon: 'Code2',
    content: `# 文章标题

> 一句话概括文章核心内容

## 前言

介绍文章背景、要解决的问题、读者能获得什么。

## 问题分析

详细描述遇到的问题或需求：

- 问题现象
- 影响范围
- 为什么需要解决

## 解决方案

### 方案一：XXX

\`\`\`javascript
// 示例代码
const solution = () => {
  console.log('解决方案实现');
}
\`\`\`

**优点：**
- 优点1
- 优点2

**缺点：**
- 缺点1

### 方案二：XXX

对比多个方案，说明选择理由。

## 实现步骤

### 步骤1：准备工作

详细说明每个步骤。

### 步骤2：核心实现

\`\`\`typescript
// 核心代码
\`\`\`

### 步骤3：测试验证

## 效果展示

展示最终效果、性能对比等。

## 总结

- 总结要点1
- 总结要点2
- 未来优化方向

## 参考资料

- [参考链接1](https://example.com)
- [参考链接2](https://example.com)
`
  },
  {
    id: 'api-doc',
    name: 'API文档',
    category: '技术文档',
    description: '接口文档、API参考手册',
    icon: 'FileCode',
    content: `# API 文档

## 概述

简要介绍API的用途、版本、基础URL等信息。

**Base URL:** \`https://api.example.com/v1\`

**认证方式:** Bearer Token

## 快速开始

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.example.com/v1/users
\`\`\`

## 接口列表

### 1. 获取用户列表

**请求：**

\`\`\`
GET /users
\`\`\`

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |

**响应示例：**

\`\`\`json
{
  "code": 0,
  "data": {
    "total": 100,
    "list": [
      {
        "id": 1,
        "name": "张三",
        "email": "zhangsan@example.com"
      }
    ]
  }
}
\`\`\`

**错误码：**

| 错误码 | 说明 |
|--------|------|
| 401 | 未授权 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 2. 创建用户

**请求：**

\`\`\`
POST /users
\`\`\`

**请求体：**

\`\`\`json
{
  "name": "李四",
  "email": "lisi@example.com"
}
\`\`\`

**响应示例：**

\`\`\`json
{
  "code": 0,
  "data": {
    "id": 2,
    "name": "李四",
    "email": "lisi@example.com",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

## 错误处理

所有错误响应格式统一：

\`\`\`json
{
  "code": 400,
  "message": "错误描述",
  "details": {}
}
\`\`\`

## 限流规则

- 每个IP每分钟最多100次请求
- 超出限制返回429状态码

## 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
`
  },
  {
    id: 'resume',
    name: '个人简历',
    category: '简历',
    description: '技术岗位简历模板',
    icon: 'User',
    content: `# 张三 - 全栈工程师

**联系方式：** zhangsan@example.com | 138-0000-0000
**GitHub：** github.com/zhangsan
**个人网站：** zhangsan.dev

---

## 个人简介

5年全栈开发经验，精通前后端技术栈，擅长高性能Web应用开发。热爱开源，GitHub 5000+ stars。

**核心技能：**
- 前端：React、Vue、TypeScript、Next.js
- 后端：Node.js、Python、Go
- 数据库：MySQL、PostgreSQL、Redis
- 云服务：AWS、阿里云、Docker、Kubernetes

---

## 工作经历

### 高级全栈工程师 | ABC科技公司
*2021.06 - 至今*

**主要职责：**
- 负责公司核心产品的架构设计和开发
- 带领5人团队完成多个重点项目
- 优化系统性能，QPS提升300%

**项目经验：**

#### 项目一：企业级SaaS平台
- **技术栈：** React + Node.js + PostgreSQL + Redis
- **职责：** 架构设计、核心功能开发
- **成果：**
  - 支持10万+企业用户
  - 系统可用性达99.99%
  - 获得客户高度评价

#### 项目二：实时数据分析系统
- **技术栈：** Vue + Python + ClickHouse
- **职责：** 前端负责人
- **成果：**
  - 实时处理百万级数据
  - 查询响应时间<100ms

### 全栈工程师 | XYZ创业公司
*2019.03 - 2021.05*

负责公司产品从0到1的开发，积累了丰富的创业公司经验。

---

## 开源项目

### awesome-project
*GitHub 3000+ stars*

一个优秀的开源项目，解决了XXX问题。

**技术亮点：**
- 创新的架构设计
- 高性能实现
- 完善的文档

---

## 教育背景

**计算机科学与技术 本科** | 某某大学
*2015.09 - 2019.06*

- GPA: 3.8/4.0
- 获得国家奖学金
- ACM竞赛省级一等奖

---

## 技能证书

- AWS Certified Solutions Architect
- 阿里云ACP认证

---

## 自我评价

- 热爱技术，持续学习新技术
- 良好的团队协作能力
- 优秀的问题解决能力
- 注重代码质量和工程规范
`
  },
  {
    id: 'project-readme',
    name: '项目README',
    category: '技术文档',
    description: '开源项目README模板',
    icon: 'Github',
    content: `# 项目名称

<div align="center">

![Logo](https://via.placeholder.com/150)

**一句话描述项目**

[![GitHub stars](https://img.shields.io/github/stars/username/repo)](https://github.com/username/repo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[在线演示](https://demo.example.com) | [文档](https://docs.example.com)

</div>

---

## 特性

- ✨ 特性1：简洁明了的描述
- 🚀 特性2：性能优异
- 🎨 特性3：界面美观
- 📱 特性4：移动端适配

## 快速开始

### 安装

\`\`\`bash
npm install your-package
\`\`\`

### 使用

\`\`\`javascript
import { YourComponent } from 'your-package'

const app = new YourComponent({
  option1: 'value1',
  option2: 'value2'
})

app.init()
\`\`\`

## 文档

详细文档请访问：[https://docs.example.com](https://docs.example.com)

### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| option1 | string | 'default' | 选项1说明 |
| option2 | number | 100 | 选项2说明 |

### API参考

#### \`method1(param)\`

方法说明。

**参数：**
- \`param\` (string): 参数说明

**返回值：**
- Promise<Result>

**示例：**

\`\`\`javascript
const result = await app.method1('value')
console.log(result)
\`\`\`

## 开发

### 环境要求

- Node.js >= 16
- npm >= 8

### 本地开发

\`\`\`bash
# 克隆项目
git clone https://github.com/username/repo.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

### 构建

\`\`\`bash
npm run build
\`\`\`

### 测试

\`\`\`bash
npm test
\`\`\`

## 贡献

欢迎贡献代码！请阅读 [贡献指南](CONTRIBUTING.md)。

### 贡献者

感谢所有贡献者！

## 许可证

[MIT](LICENSE) © Your Name

## 致谢

- 感谢 [项目A](https://github.com/a) 提供灵感
- 感谢 [项目B](https://github.com/b) 的技术支持
`
  },
  {
    id: 'meeting-notes',
    name: '会议纪要',
    category: '工作文档',
    description: '会议记录、讨论纪要',
    icon: 'FileText',
    content: `# 会议纪要

**会议主题：** XXX项目评审会
**会议时间：** 2024年1月15日 14:00-16:00
**会议地点：** 3楼会议室 / 线上会议
**参会人员：** 张三、李四、王五
**记录人：** 张三

---

## 会议议程

1. 项目进展汇报
2. 技术方案讨论
3. 问题与风险
4. 下一步计划

---

## 会议内容

### 1. 项目进展汇报

**张三汇报：**
- 前端开发完成80%
- 主要功能已实现
- 正在进行性能优化

**李四汇报：**
- 后端API开发完成
- 数据库设计已确定
- 开始编写单元测试

### 2. 技术方案讨论

**讨论主题：** 缓存策略选择

**方案A：** Redis缓存
- 优点：性能好、功能丰富
- 缺点：需要额外维护

**方案B：** 本地缓存
- 优点：简单、无依赖
- 缺点：分布式环境下不适用

**决策：** 采用方案A，使用Redis缓存

### 3. 问题与风险

| 问题 | 影响 | 负责人 | 截止日期 |
|------|------|--------|----------|
| 第三方API不稳定 | 高 | 李四 | 1月20日 |
| 移动端适配问题 | 中 | 张三 | 1月18日 |

### 4. 下一步计划

**本周计划：**
- [ ] 完成前端剩余20%功能（张三）
- [ ] 完成后端单元测试（李四）
- [ ] 进行集成测试（王五）

**下周计划：**
- [ ] 性能测试
- [ ] 安全测试
- [ ] 准备上线

---

## 待办事项

1. **张三：** 解决移动端适配问题（1月18日前）
2. **李四：** 调研第三方API替代方案（1月20日前）
3. **王五：** 准备测试环境（1月17日前）

---

## 下次会议

**时间：** 2024年1月22日 14:00
**议题：** 测试结果评审
`
  },
  {
    id: 'study-notes',
    name: '学习笔记',
    category: '笔记',
    description: '技术学习、读书笔记',
    icon: 'BookOpen',
    content: `# 学习笔记：XXX技术

**学习日期：** 2024年1月15日
**学习来源：** 官方文档 / 视频教程 / 书籍
**难度等级：** ⭐⭐⭐

---

## 概述

简要介绍这个技术是什么、用来解决什么问题。

**核心概念：**
- 概念1：解释
- 概念2：解释
- 概念3：解释

---

## 基础知识

### 1. 基本概念

详细解释基础概念。

\`\`\`javascript
// 示例代码
const example = 'hello world'
\`\`\`

### 2. 核心原理

用自己的话解释核心原理，可以画图辅助理解。

---

## 实践示例

### 示例1：基础用法

\`\`\`javascript
// 完整的可运行代码
function example() {
  console.log('示例代码')
}
\`\`\`

**运行结果：**
\`\`\`
输出结果
\`\`\`

**知识点：**
- 知识点1
- 知识点2

### 示例2：进阶用法

更复杂的示例。

---

## 常见问题

### Q1: 问题描述？

**A:** 解答内容。

### Q2: 另一个问题？

**A:** 解答内容。

---

## 最佳实践

1. **实践1：** 详细说明
2. **实践2：** 详细说明
3. **实践3：** 详细说明

---

## 注意事项

⚠️ **重要提示：**
- 注意事项1
- 注意事项2

---

## 总结

- 总结要点1
- 总结要点2
- 下一步学习方向

---

## 参考资料

- [官方文档](https://example.com)
- [教程视频](https://example.com)
- [相关文章](https://example.com)

---

## 练习题

1. 练习题1
2. 练习题2

**答案：**
（自己完成后再看答案）
`
  }
]
