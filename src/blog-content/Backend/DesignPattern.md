---
title: DesignPattern
categories:
  - Back-End
  - DesignPattern
---

# Design Pattern
## Visitor Pattern 访问者模式

解决在稳定数据结构和易变操作之间的耦合问题, 操作独立于数据结构变化: 元素的执行算法随着访问者改变而改变
- 对一个对象结构中的对象执行多种不同的且不相关的操作, 操作需要避免"污染"对象类本身

| **访问者模式角色**                |                                                            | **项目对应角色**                                                                                                                 |
| --------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **访问者（Visitor）**             | 声明一系列访问方法, 一个访问方法对应数据结构中的一个元素类 | `interface OperatorNodeVisitor`: 访问不同类型 `OperatorNode` 的方法 `visit(xxxNode node);`                                       |
| **具体访问者（ConcreteVisitor）** | 实现访问者接口, 为每个访问方法提供具体实现                 | `PhysicalPlanBuilder implements OperatorNodeVisitor`<br>- 每个`visit(...)`: 建立对应的`Operator`, 实现 logical -> physical的转换 |
| **元素（Element）**               | 声明一个接受访问者的方法                                   | `OperatorNode` 抽象类: `accept(OperatorNodeVisitor visitor)` 方法, 允许访问者访问自己                                            |
| **具体元素（ConcreteElement）**   | 实现元素接口, 每个具体元素类对应数据结构中的一个具体对象   | 节点`OperatorNode`: `ProjectOperatorNode`每个节点调用 `visitor.visit(this)` 来让访问者处理自己                                   |
| **对象结构（Object Structure）**  |                                                            | 逻辑计划树 (Logical Plan Tree): `OperatorNode` 组成                                                                              |
### 优点

- **单一职责原则**: 每个类只负责一项职责
- **扩展性**: 容易为数据结构添加新的操作
- **灵活性**: 访问者可以独立于数据结构变化

### 缺点

- **违反迪米特原则**: 元素需要向访问者公开其内部信息
- **元素类难以变更**: 元素类需要维持与访问者的兼容
- **依赖具体类**: 访问者模式依赖于具体类而不是接口, 违反了依赖倒置原则
## Builder Pattern 构建者模式
分离构建过程 & 表示

| 角色                             | 职责说明                           |
| -------------------------------- | ---------------------------------- |
| **Builder(抽象建造者)**          | 创建各部分的接口, `setPage()`      |
| **ConcreteBuilder (具体建造者)** | 实现接口                           |
| **Director (指挥者)**            | 控制构建流程 `trigger()`: 先p1再p2 |
| **Product (产品类)**             | 构建对象                           |

