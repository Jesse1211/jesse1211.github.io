---
title: DataStructure
categories:
  - Back-End
  - DataStructure
---
# Data Structures

## 结构
### 数据逻辑结构
元素的相互关系
- 线性: 一对一 ArrayList, Array, stack, LinkedList, Queue
- 非线性: 
	- 集合: 元素同属一个集合, Tree, Graph, Map
	- 树形: 一对2 Tree
	- 图形: 多对多
### 数据存储结构
顺序 - 物理位置相邻 Array, ArrayList, stack
链式 - 物理位置不连续 LinkedList, Tree, Graph, Map

## 比较

| 数据结构               | Java                                                                                                                                                           | C++ STL                                                                                           | 共同点                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 算法和容器分离         | 算法独立于容器<br>调用`Collections` 工具类                                                                                                                     | STL 算法通过迭代器通用操作容器, 结构更加解耦                                                      |                                                  |
| 线程安全               | 大部分线程不安全 (通过 **synchronized** 实现)                                                                                                                  | 需配合 `mutex`, `lock`                                                                            |                                                  |
| **Array**              | `int[]`<br>引用类型<br>存储连续                                                                                                                                | `array<T, N>` / `T[]`<br>基本类型<br>==储存不连续 (双向链表)==                                    | 固定大小                                         |
| **ArrayList / Vector** | `ArrayList`<br>扩容为原来的 **1.5 倍**                                                                                                                         | `vector`<br>扩容默认 **2 倍**<br>- 插入/删除 元素引起内存重新分配, 所以指向原内存的迭代器全部失效 | 动态数组, 自动扩容, 连续内存                     |
| **LinkedList / list**  | `LinkedList`                                                                                                                                                   | `list`                                                                                            | 双向链表, 不是连续内存<br>插入删除快, 随机访问慢 |
| **Deque**              | `ArrayDeque`<br>基于**循环数组 circular list**<br>纯数组实现, 扩容时复制<br>可变长数组 & 双指针<br>扩容需要复制                                                | `deque`<br>基于**map+缓冲块数组** (分段连续内存)<br>分块管理, 适合频繁插入删除, 但结构复杂        | 双端队列                                         |
| **Stack**              | `Stack` 连续储存                                                                                                                                               | `stack`<br>wrapper, 不直接暴露结构<br>list / deque 实现, 封闭头部<br>容量大小有限制, 扩容耗时     |                                                  |
| **Queue**              | `PriorityQueue`                                                                                                                                                | `priority_queue`                                                                                  | 优先级顺序, 逻辑上是Heap, 物理上是可变长数组     |
| **Set**                | `TreeSet`<br>- 不可以 null (除非手写Comparator)                                                                                                                | `set`                                                                                             | 红黑树 (有序排序), 不允许 null                   |
|                        | `HashSet`<br>- 可以存 null                                                                                                                                     | `unordered_set`<br>不允许 null                                                                    | 哈希表 (HashMap)                                 |
| **Map**                | `HashMap`<br>链表过长, 自动转为红黑树<br>扩容时会造成死循环和数据丢失的问题                                                                                    | `unordered_map`                                                                                   | 哈希表 (HashMap), “拉链法”                       |
|                        | `TreeMap`<br>                                                                                                                                                  | `map`                                                                                             | 红黑树, 有序遍历                                 |
|                        | `ConcurrentHashMap`: <br>线程安全容器: `synchronized` & `CAS`<br>线程安全: 锁分段技术提高并发的效率 (一次锁住一个桶), hash 表分 16 个桶, 每个操作锁住对应的桶. |                                                                                                   |                                                  |
| 迭代器                 | `Iterator`: `hasNext(), next()` 安全性高, 不可修改                                                                                                             | `iterator`: `begin(), end()`<br>不安全: 直接访问容器元素地址, 可修改                              | 智能指针: 在容器中遍历, 读取或修改元素           |
**“拉链法”**: 链表 & 数组

- LinkedList & Array: 每个 element 指向一个链表
- if 哈希冲突, 尾插法加入链表
	- 避免链表倒置, 插入的节点永远放在链表的末尾, 避免环形链表
- 链表过长导致查询效率下降, 所以转为红黑树
	- 链表查询 O(n)
	- 红黑树是一种自平衡二叉搜索树, 查询 O(log n)

HashMap 线程不安全 例子:

- 线程 1,2 同时进行 put, 发生哈希冲突 (hash 函数计算出相同插入下标)
- 线程 1 执行完哈希冲突判断后, 由于时间片耗尽挂起. 线程 2 先完成了插入操作.
- 线程 1 获得时间片, 由于已经进行过 hash 碰撞的判断, 会直接进行插入, 线程 2 插入的数据被线程 1 覆盖了.


