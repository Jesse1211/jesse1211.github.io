---
title: Operating System
categories:
  - Back-End
  - Operating System
---

# OPERATING SYSTEM

## 主要功能
1. Process management CPU 管理 - 进程
	- Manage processes to ensures each gets necessary resources and CPU time to execute efficiently and prevents conflicts between them
	- 创建和终止进程. 确保进程的资源
2. Memory management 内存管理 - 虚拟内存
	- Handle to allocate memory and used by different processes.
	- 为进程分配内存资源
3. File Management 外存管理 - 文件
	- Handles file permissions and access control.
	- 提供创建, 删除, 读写文件的功能, 并组织文件的存储结构, 比如说目录
4. Device Management I/O管理
	- Handle hardware devices communicate with the computer system to provide consistent interface for applications to use
	- 通过设备驱动程序控制和管理计算机的硬件设备，如键盘、鼠标、打印机等
## 5 Features (Concurrence, Parallel, Sharing, Virtual, Async)

> Concurrence 并发: Scheduling multiple programs within a time interval **时间段**内调度多个程序

- Macro 宏观 - multiple tasks be executed simultaneously 多任务同时执行
- Micro 微观 - CPU rapidly switches tasks 任务间高速切换

> Parallel 并行: The capability of executing multiple tasks at one moment **时刻**内发生的事件能力

Requires multiple cores or processors to execute tasks simultaneously. 需要多核处理器, 微观上同时执行多条指令, 不同的程序被放到不同的处理器上运行       

> Sharing: multiple programs share resources under concurrency 多个程序在 Concurrence

- Simultaneous access: 同时访问 - Multiple programs attempt to use the same resource at the same time. 多个程序访问一个资源
- Mutual exclusion (Mutex) 互斥共享 - Mechanism to prevent conflicts when sharing resources 多个程序在同一个资源上 Isolated 
	- 上厕所

> Virtualization: Abstracting physical resources把物理抽象化

- TDM - Time Division Multiplexing
	- Assigns time slices to each process (e.g., CPU scheduling). 分时间给每个进程
- SDM - Space Division Multiplexing
	- Allocates separate physical memory or disk regions to processes. 分空间给每个进程

> Asynchronism: Independent execution of programs

- Multiprogramming 多道程序 - Multiple programs can be in memory and execute concurrently. 多个程序并发执行
- Single CPU 单处理机 - Programs take turns executing (interleaved), but seem to run in parallel. 多程序交替执行
## System Structure 结构
- 用户态: 执行应用程序代码, 受限于系统资源访问
- 内核态: 拥有对硬件和系统资源的完全控制, 负责执行核心系统功能
### Kernel 内核

- core program of an operating system, 一个计算机程序, 操作系统的核心
- manages all hardware and system resources. 提供OS最核心的能力
- Manages process, memory, file systems, networking. 控制操作系统中所有的内容

### User Mode 用户态 vs. 内核态 Kernel Mode
- Kernel Space 内核空间: 内核代码 & 运行时数据结构所在的内存区域
	- Privileged instructions: full access to hardware and system resources 拥有对系统所有资源的完全访问权限
	- execute sensitive instructions (e.g., direct hardware access, context switching) 如进程管理, 内存管理, 文件系统, 网络堆栈...
- User space ⽤户空间: 应用程序 (如用户运行的进程) 分配的内存区域
	- Restricted mode, Non-privileged instructions: Cannot directly access hardware or kernel data. 用户空间中的进程不能直接访问硬件或内核数据结构, 只能通过系统调用与内核通信
	- Must request services via system calls.

#### User Mode & Kernel Mode Switching 用户态 & 内核态切换
- System call 系统调用: application needs to perform a privileged operation (e.g., read a file)
	- The CPU switches to kernel mode, executes the operation in kernel space, and then switches back to user mode. 从用户态切换到内核态, 进入内核空间执行相应的内核代码, 然后再切换回用户态
	- Switching using the interface provided by OS 应用程序请求操作系统内核提供服务的接口
- 中断 / 异常
	- IO事件触发 (网络包到达, 磁盘 I/O 完成)
	- 程序运行错误
- 线程在 TCB Thread Control Block 维护两套栈
    - **用户栈** User Stack: 运行用户代码
	    - 保护隔离: 不能被内核态直接使用
    - **内核栈** Kernel Stack: 进入内核态时使用
- 切换时: 
    1. CPU 保存用户栈指针到 TCB
    2. 加载内核栈指针, 转向内核代码执行
- `read()`
	1. CPU 执行 `syscall`
	    - 保存用户态寄存器, 切换内核态栈
	2. 内核根据系统调用号找到对应的服务例程
	3. 如果需要 I/O:
	    - 进入 **阻塞状态**, 挂起等待硬件中断
	    - 内核调度器切换到另一个可运行线程
	4. 硬件完成 → 产生中断 → 内核唤醒等待线程
	5. 系统调用返回 → 恢复用户态栈和寄存器 → 返回用户态继续执行
## Process 进程 & Thread 线程 vs Coroutine 协程
> Process 线程: independent, isolated, running instance of a program. 独立的, 正在执行的程序实例
> 
> Thread 进程: the smallest unit of execution. 最小的运行单位
> 
> Threads within the same process share resources in **heap** & **method area**. 同类线程共享进程资源 (**堆**和**方法区**)

| Feature           | Process 进程                                   | Thread 线程                         | Coroutine 协程                                                          |
| ----------------- | ---------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| Memory            | Separate                                       | Shared                              | 依赖线程共享, 轻量                                                      |
| Overhead 执行开销 | Higher                                         | Lower                               | Lower (用户态)                                                          |
| Isolation         | High (one process crash doesn’t affect others) | Low (threads can affect each other) | Low (依赖线程)                                                          |
| Context Switching | Slower                                         | Faster                              | Fatest (用户态切换)                                                     |
| 调度方式          | OS 内核抢占式                                  | OS 内核抢占式                       | 用户态协作 (await, yield)                                               |
| 并行能力          | 并行, 多核充分利用                             | 并行，多核充分利用                  | 单线程内并发                                                            |
| 应用              | 浏览器, 数据库服务                             | Web服务器                           | 爬虫, 网络IO (事件循环 & 内核异步IO接口) (确保底层调用**不是阻塞 API**) |
> **同步 Synchronous & 异步 Asynchronous**
- Synchronous 同步: 
	- A task makes a request and **waits** for the result before continuing. 发出调用, 一直等待直到得到结果后返回        
- Asynchronous 异步: 
	- A task makes a request and **continues immediately** without waiting. 发出调用, 不等待返回结果, 直接返回
### 合作 - 执行秩序

| 类型                         | 描述                                                                                   | 举例                           |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------------------ |
| **同步（Cooperation）**      | **间接制约**: 保持执行顺序, 不访问相同资源.                                            | Pipe, 消息传递                 |
| **互斥（Mutual Exclusion）** | **直接制约**：访问同一共享资源, 不能同时访问. 获取锁 -> 访问 -> 释放锁 / 唤醒其他线程. | 多线程同时写文件, 修改共享变量 |

| 原则 Principles           | 含义                                            |     |
| ------------------------- | ----------------------------------------------- | --- |
| **空闲让进 Idle Wait**    | 如果没人用资源, 应允许进程立刻进入              |     |
| **忙则等待 Busy Wait**    | 如果有人正在用, 其他进程必须等待                |     |
| **有限等待 Bounded Wait** | 每个等待进程应能在有限时间内进入 (避免无限等待) |     |
| **让权等待 Yield Wait**   | 等待时应放弃 CPU 使用权, 防止浪费 (≠ 忙等)      |     |
### Context Switching 上下文切换

#### Process Context Switch 进程切换
process of the CPU switching from one task (process/thread) to another, allowing multitasking. 从占用 CPU 状态中退出: 多任务处理环境中切换进程, 通过让多个进程共享 CPU 资源, 使系统能够并发执行多个任务

1. Save the current process's context (e.g., CPU registers, program counter). 保存当前进程的上下文: CPU 寄存器, 程序状态等关键信息
2. Choose the next process to run (scheduler decision). 选择下一个进程: 调度程序选择下一个要执行的进程
3. Load the context of the new process. 恢复上一个进程的上下文
4. Transfer control to the new process. 切换到下一个进程
#### Thread Context Switch 线程切换

>Between threads in the same process 当两个线程是属于同⼀个进程:

- Since threads share memory (virtual address space), only the thread-specific data (registers, stack pointer, etc.) needs to be switched. 虚拟内存共享, 需要切换线程的私有数据, 寄存器等不共享的数据
- Faster than process switch.

>Between threads in different processes
- Equivalent to a **full process switch** (involves memory context change), hence **more costly**. 当两个线程不是属于同⼀个进程，则切换的过程就跟进程上下⽂切换⼀样
### Thread
- 一个进程包含多个线程, 线程共享同一个进程的内存空间 (代码段, 数据段, 堆), 有各自的栈和寄存器
- **调度器 scheduler** 切换线程达到并发 / 并行效果

| 模型, 用户 : 内核                   | 简称                                  | 优点                                    | 缺点                                                 |
| ----------------------------------- | ------------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| n : 1<br>- 一个服务员负责所有客户   | 用户级线程 (User-Level Thread, ULT)   | 高效率切换; 不需要系统调用 (用户态切换) | 低效率运行; 一个线程阻塞, 整个进程阻塞; 无法多核并发 |
| 1 : 1<br>- 每个客户的专属服务员     | 内核级线程 (Kernel-Level Thread, KLT) | 高效率运行; 并发;                       | 低效率切换                                           |
| n : m<br>- 多客户, 多服务员动态分配 | 混合模型 (Hybrid)                     | 灵活调度, 平衡性能, 并发                | 实现复杂; 调度器之间容易冲突                         |
>Linux/Unix
- 通过 **pthread (POSIX threads)** 实现。
- `pthread_create()` 创建新线程
- `pthread_join()` 等待线程结束 
- `pthread_mutex_*` 互斥锁保证同步

>注意事项
- **同步问题** (race condition)
    - 控制共享资源: 锁 mutex, 信号量, 条件变量
- **线程池**
    - 避免频繁创建/销毁开销
- **CPU vs I/O 密集任务选择**
    - CPU 密集 → 多进程 / C++ / Go / Rust
    - I/O 密集 → Python 线程 / Go 协程
#### 线程池
池化技术
1. **降低资源消耗**: 重复利用线程
   - 完成任务不会立即销毁, 回到池子里等待下一个任务
   - 避免频繁创建和销毁线程的开销
2. **提高响应速度**:
   - 线程池会维护核心线程 (“常驻工人”)
   - 任务直接交给已经存在的, 空闲的线程去执行
   - 省去创建线程的时间, 任务能够更快地得到处理
3. **提高线程的可管理性**:
   - 允许统一管理池中的线程
   - 控制并发线程的总量, 防止资源耗尽, 保证系统的稳定性
   - 提供了监控接口, 方便解线程池的运行状态 (活跃线程, 任务在排队数量), 便于调优
   - 配置线程池的大小 (核心线程数, 最大线程数), 任务队列的类型和大小, 拒绝策略等

> 不推荐使用内置线程池

- 不使用线程池会造成系统创建大量同类线程而导致消耗完内存或者“过度切换”的问题

#### 核心线程
空闲时的状态:
- **有存活时间**:
	- `WAITING`  状态: 等待获取任务
	- `TERMINATED`  状态: if 阻塞等待的时间 > 核心线程存活时间, then 线程退出工作, 从线程池的工作线程集合中移除
- **无存活时间**:
	- 一直处于  `WAITING`  状态, 一直存活在线程池中
	- `RUNNABLE`: 当队列中有可用任务时, 唤醒被阻塞的线程, 执行对应任务

回收:
- 默认不会: 核心线程通常是要长期保持活跃的
- 线程池是被用于周期性使用的场景, 且频率不高 (周期之间有明显的空闲时间), 可以考虑回收空闲的核心线程
#### 线程崩溃
导致进程崩溃
1. **共享内存空间**: 破坏共享数据, 导致其他线程的异常行为
2. **资源共享**: 资源状态不一致, 影响其他线程的正常运行 (比如网络连接)
3. **全局状态**: 修改全局变量或进程级别的状态信息. 导致整个进程进入不一致的状态

处理:
1. **异常处理** try catch
    - 捕获线程中的错误.
2. **线程隔离**
    - 将关键任务分配到不同的线程中, 减少单个线程崩溃对整个进程的影响
    - 使用 immutable / 消息传递, 避免直接共享内存
3. **监控和重启**:
    - 监控检测
#### 线程同步 & 避免冲突
确保多个线程安全访问共享资源
- **互斥锁 Mutex**: 防止多个线程同时访问共享资源
    - 适用场景: 需要确保同一时间只有一个线程访问共享资源
- **读写锁 Read-Write Lock**: 多线程同时读取, 但写操作是独占的
    - 适用场景: 读频繁 & 写较少
- **条件变量 Condition Variable**: 条件同步, 等待某个条件成立
    - 适用场景: 等待某个条件变化的场景
    - 比喻: 交通灯, 等待绿灯通行
- **信号量 Semaphore**: 控制对资源的访问数量
    - 适用场景: 需要限制对资源的并发访问数量
    - 比喻: 有限的车位
- **自旋锁 Spinlock**: 等待锁时不断检查锁的状态
    - 适用场景: 适合短时间的锁定 & 线程切换开销较大的场景
    - 比喻: 排队m 等待的人不断查看门是否打开
#### 线程类型: bound 密集
**任务主要消耗的资源类型**, “密集”并不是“任务多“, 而是 **资源占用的偏向性**
- **CPU 密集型 CPU-bound**: 主要耗费 CPU 计算资源
	- 多线程: 利用 CPU 在等待 IO 时的空闲时间, 提高效率
    - 加密解密
    - 视频/图像编码
    - 大规模数学计算
    - 压缩/解压缩
- **I/O 密集型 I/O-bound**: 主要耗费 **输入/输出等待时间**, CPU 经常空闲
	- 多线程同时: 频繁的线程切换, 增加系统的开销, 降低效率
    - Web 请求（HTTP 调用第三方服务）
    - 数据库 CRUD
    - 文件读写
    - 网络数据传输
#### 线程调度

> **Java 使用抢占式线程调度** - 并发

- **抢占式调度 (Preemptive Scheduling)**: OS 决定何时暂停当前正在运行的线程, 并切换线程执行
	- 由系统时钟中断 (时间片轮转) 或其他高优先级事件 (I/O 操作完成) 触发
	- 存在上下文切换开销, 公平性和 CPU 资源利用率较好, 不易阻塞
- **协同式调度 (Cooperative Scheduling)**: 线程执行完毕后, 主动通知系统切换到线程.
	- 减少上下文切性能开销, 公平性较差, 容易阻塞

> 效率取决于线程的类型和任务的性质
### Process
- 动态 Dynamic - 创建 & 撤销 (最基本的特征)
	- 进程的实质是进程实体的一次执行过程
- 并发 Concurrent - 多进程同时运行 (重要特征)
- 独立 Isolated - 独立资源分配 (单位)
- 异步 Asynchronous - 资源独立, 互不干扰

|                            | Definition                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Process Control Block, PCB | 管理进程的信息 (标识, 状态, 寄存器, 调度信息)                                                 |
| Text / Code Segment        | Readonly Code (machine instructions), 只读, 已编译的机器指令 (程序代码)                       |
| Data Segment               | Writable initialized global / static variables, 全局 / 静态变量, **可读写**; 随程序执行而变化 |
| Heap                       | Dynamic memory (`malloc`, `new`)                                                              |
| Stack                      | Function calls, local variables, 用于函数调用, 局部变量; 后进先出 (LIFO)                      |
#### States 状态
| State                 | Description                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **New**               | Process is being created; PCB is initialized; memory allocation is considered.                                                                       |
| **Ready**             | Process is prepared to run, waiting for CPU. <br>Temporarily stopped due to CPU being busy. 由于其他进程处于运⾏状态⽽暂时停⽌运⾏                       |
| **Running**           | Process is currently being executed and using the CPU.                                                                                               |
| **Blocked**           | Waiting for I/O or lock; <br>cannot run even if CPU is free. 即使给它 CPU 控制权, 也⽆法运⾏                                                           |
| **Terminated / Exit** | Process has completed or been killed. 该线程已经运行完毕, 进程正在从系统中消失时的状态<br>Resources are freed and PCB is removed. 资源释放, 清除 PCB |
##### Process primitives - 管理 states (Atomic operations)
- `Create`: New → Ready
- `Block`: Running → Blocked
- `Wakeup`: Blocked → Ready
- `Destroy`: Running → Terminated
- `Suspend`: Ready / Blocked -> Suspend (Suspend: moved out of main memory to secondary storage)
- `Resume`:  Suspended -> Running / Ready
#### Zombie Process 僵尸进程
A terminated process that still has an entry in the process table. 终止, 但进程表中存在
- When the **parent process doesn’t call `wait()` or `waitpid()`** to collect its child’s exit status. 子进程需要通知父才会释放, 通知之前, 子进程仍然保存在系统中
- System keeps the child’s descriptor to allow status collection.
#### Orphan Process 孤儿进程
A child process whose **parent has exited**. 父进程退出, 子进程还在运行
- Not harmful to the system. 不会对系统造成危害
- The **`init` process (PID 1)** adopts it and performs status collection. 孤儿进程将被 init 进程 (进程 ID 为 1 的进程) 所收养, 并完成状态收集工作.
#### Inter-Process Communication (IPC) 通信 - 发信号

| 通信方式                 | 定义                                                                       | 共享内存 | 内核参与       | 数据量 | 安全性           |
| ------------------------ | -------------------------------------------------------------------------- | -------- | -------------- | ------ | ---------------- |
| 共享内存 Shared-Memory   | 共享数据结构 / 内存中存储区                                                | ✅        | ❌ (初始化除外) | 大     | ❌ 自己管理锁     |
| 消息传递 Message-Passing | 直接通信 - 点到点发送 (打电话)<br>间接通信 - 通过中间实体 (信箱)           | ❌        | ✅              | 小     | ✅ 高, 内核控制   |
| 管道 (Pipe)              | 特殊文件: 通过固定大小的缓冲区读写数据<br>单向通信: 一个写, 一个读<br>FIFO | ❌        | ✅              | 中小   | ✅ 中等, 自动管理 |
### 协程 Coroutine
并发单元: **用户态**的轻量级线程, 在单个线程中执行多个任务, 通过程序自身控制的方式实现任务切换
- “舞台上的演员”: 在自己的台词结束后主动让出舞台, 等待下次上场
- **轻量级**：协程在用户态切换, 开销小, 创建和销毁速度快
- **非抢占式 / 显式切换**: 由程序员/库代码主动调用完成, 避免多线程的竞争和锁机制
- **高效并发**：适合 I/O 密集型任务, 避免线程上下文切换的开销
	- 等待 I/O 操作时可以让出执行权
#### 工作原理
1. **创建**: 由程序显式创建, 通过语言内置的协程库或框架
2. **切换**: 通过yield或await等关键字主动让出执行权, 切换到其他协程
3. **恢复**: 继续从上次让出的地方运行
4. **结束**: 执行完毕后, 释放资源, 等待被垃圾回收
## Lock 锁
### Lock Strategy 锁策略
加锁的原因
#### Pessimistic Lock 悲观锁

> 总是假设最坏的情况, 认为共享资源每次被访问的时候就会出现问题(比如共享数据被修改), 所以每次在获取资源操作的时候都会上锁, 这样其他线程想拿到这个资源就会阻塞直到锁被上一个持有者释放

- 多写少读, 竞争激烈场景
- 避免频繁失败和重试影响性能
- 固定开销

> 高并发的场景

- 大量阻塞线程会导致系统的上下文切换. 增加系统的性能开销.
- 存在死锁问题

#### Optimistic Lock 乐观锁

> 总是假设最好的情况, 认为共享资源每次被访问的时候不会出现问题, 线程可以不停地执行, 无需加锁也无需等待, 提交修改时验证对应资源是否被修改 (版本号机制 / CAS 算法)

- 多读少写场景, 竞争较少场景
- 避免频繁加锁影响性能.
- 主要针对单个共享变量

> 高并发的场景

- 不存在锁竞争造成线程阻塞, 也不会有死锁的问题, 在性能更好
- 如果冲突频繁发生 (写占比非常多的情况), 会频繁失败和重试, 影响性能
  - `LongAdder`以空间换时间的方式解决

> 实现: 版本号机制 / CAS 算法实现

- 版本号机制 - 数据表中加上数据版本号  `version` = 数据被修改的次数
- 被修改时, `version++`
- 线程 A 要更新数据值时, 读取数据包括  `version`
- 提交更新: if `old.version == new.version` then 更新, esle 重试更新操作, 直到更新成功

### Lock types 锁的类型
加的是什么锁, 最底层的锁逻辑

| Lock Types 锁类型              | definition                                                                                                                                                                                     |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exclusive Lock 独占锁 / 独享锁 | 只能被一个线程获得<br>- 写锁<br>- 获取写锁后, 尝试获取读锁: 读锁被占用, 获取失败<br>- 可降级为读锁                                                                                             |
| Shared Lock 共享锁             | 被多个线程同时获得<br>- 读锁<br>- **不能**升级为独占锁<br>  - 引起线程的争夺, 会影响性能<br>  - 引起死锁, 假设两个线程的读锁都想升级写锁, 则需要对方都释放自己锁, 而双方都不释放, 就会产生死锁 |
### Lock subtype 更细节的锁 (策略)
加锁时的行为细节 / 方式

| Lock Features                     | definition                                                                                                     |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| Reentrant Lock 可重入锁           | 同一线程可重复获取, 不会死锁 <br>- `synchronized`<br>- 递归锁                                                  |
| 不可重入锁                        | 不能重复获取<br>- `Semaphore()`                                                                                |
| Spin Lock 自旋锁                  | 尝试获取锁的线程不会阻塞, 循环的方式不断尝试<br><br>- 优点: 减少上下文切换, 提高性能<br>- 缺点: 循环会消耗 CPU |
| Segment Lock 分段锁               | 细化了锁的粒度 (`ConcurrentHashMap`), 将资源划分段加锁<br><br>- 优点: 实现高效的并发操作, 只锁数组中的一项     |
| Fair Lock 公平锁                  | 按照线程请求顺序获取锁<br><br>- 缺点: 性能较差, 上下文切换频繁 for 时间顺序                                    |
| Unfair Lock 非公平锁              | 不按顺序分配锁<br><br>- 优点: 性能更好, 可能导致某些线程永远无法获取到锁                                       |
| Interruptible Lock 可中断锁       | 获取锁的过程可以被中断                                                                                         |
| Non-interruptible Lock 不可中断锁 | 申请锁后不可中断，只能等待                                                                                     |

### Java 关键字

|                         | `volatile`                                                                                                                                | `synchronized`                                                        | `ReentrantLock` 可重入锁                                                                   | CAS `Compare And Swap`                                                                       |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Definition              | - 保证线程间可见性: 立即拿到其他线程更改后最新的值. <br>- 禁止指令重排序 (内存屏障): (乱序执行: cpu会不等待当前结果 & 执行下一个命令)<br> | - 自动加锁 & 解锁: 线程访问资源的同步性, 保证任意时刻只有一个线程执行 | - 获取锁之后可以再尝试获取锁<br>- 比`synchronized`更强大 & 高级<br>- Java 提供的显示锁<br> | - 实现锁策略的方式<br>`if Var == Expected: New = Var;` <br>else: 不挂起, 再次尝试 / 放弃操作 |
| 用于                    | 变量                                                                                                                                      | 修饰方法, 代码块                                                      | - **临界区同步**: 多线程访问共享资源的代码块<br>- **可编程锁**                             | - 变量<br>- **不是关键字 / 语法修饰符**                                                      |
| 可见性 **(主内存读取)** | ✅                                                                                                                                         | ✅                                                                     | ✅                                                                                          | ✅ 配合`volatile`                                                                             |
| 原子性                  | ❌                                                                                                                                         | ✅                                                                     | ✅                                                                                          | ✅                                                                                            |
| 锁                      | ❌ 非锁                                                                                                                                    | - 悲观锁思想<br>- 非公平锁<br>- 不可中断锁<br>- 可重入锁              | **默认行为**<br>- 悲观锁思想, 不能更改<br>- 非公平锁<br>- 独占式锁                         | ❌ 非锁<br>- 乐观锁思想<br>- 自旋锁思想                                                       |
#### `synchronized`

> 底层实现机制: 监视器锁 monitor
> **通过监视器锁更新加锁状态, 随着线程竞争的激烈程度逐步升级** (不能降级)

- **偏向锁 (无竞争)**: 只有一个线程反复获得同一个锁
- **轻量级锁 (少量竞争)**: 第二个线程尝试获取偏向锁
- **重量级锁 (竞争激烈)**: 自旋失败, 线程多, 长时间未获取到锁

##### 使用

**1. non-static function**
- `synchronized void method() {}`  **运行前占用对象锁**

**2. static function**
- `synchronized static void method() {}`  **运行前占用 class 的锁**

**3. block** (锁指定对象/类)
- `synchronized(object)`   **运行前占用对象的锁**
- `synchronized(class)`  **运行前占用 Class 的锁**
#### CAS 问题
1. 读取 `var`, 另存为 `expected`, 要更新的**内存位置的值**
2. 计算 `new`
3. 比较 `var == expected`
4. if true, var = new
5. else: 其他线程修改**内存位置的值var**, 重新尝试
	
- **自旋锁机制:** CAS 操作可能会因为并发冲突而失败, 在失败后不断重试, 直到操作成功.

ABA 问题
- 初次读取: V = A -> 准备赋值: V = A -> 无法确定 V 从未被修改过: 可能被改为其他值, 然后又改回 A
- 解决思路 - 在变量前面追加上**版本号或者时间戳**

#### Semaphore

> `Semaphore`(信号量): 控制同时访问**特定**资源的线程数量 (限流), 是共享锁

初始资源个数 = 1: `Semaphore` = 排他锁

```java
// 初始共享资源数量
final Semaphore semaphore = new Semaphore(5);

// 尝试获取许可证, 获取1个许可
// if `state >= 0`: then 可以获取成功, then  `state=state-1`
// if `state < 0`: then 许可证数量不足, then 创建 Node 节点加入阻塞队列, 挂起线程
semaphore.acquire();

// 尝试释放许可证, 释放1个许可
// if 释放成功: 唤醒同步队列中的一个线程, 被唤醒的线程会重新尝试 `state=state-1`
// if `state >= 0`: then 获取令牌成功, else 重新进入阻塞队列, 挂起线程
semaphore.release();
```

两种模式:

- **公平模式:**  调用  `acquire()`  方法的顺序就是获取许可证的顺序, 遵循 FIFO
- **非公平模式:**  抢占式
### Deadlock detection 检测死锁
when multiple threads/processes compete for resources and execution order fails, and all four necessary conditions are met: 争抢资源 & 执行顺序出错 + 四个条件 全部成立

**Mutual Exclusion (互斥条件)**:
- 多线程不能同时使用同一个资源
- 预防 (Prevent): 
	- 部分资源 (除写入) 同时 & 共享 访问 
**No Preemption (不剥夺条件)**:
- 进程获得的资源, 在使用完之前不能被强行剥夺, 只能主动释放
- 预防 
	- 如果无法满足资源, 那就释放已有资源
**Hold and Wait (请求并保持条件)**:
- 已获得资源但请求其他资源。
- 预防 
	- 运行前提交需要的资源
	- 阶段性请求 & 释放资源, 用一点还一点
**Circular Wait (循环等待条件)**:
- 循环等待链: P1 占有 P2 资源, P2 占有 P1 资源
- 预防
	- 资源排序, 按序号请求资源 (请求低到高的, 释放高到低的)

>避免死锁的算法

**System Safety State (系统安全状态)**:
- **safe state** 确保死锁不会发生
**Banker's Algorithm (银行家算法)**:
- 预判是否会进入 unsafe state, 如果会进入那就拒绝分配资源
### 解决方式
**Resource Preemption (资源剥夺)**:
- Suspend the process causing the deadlock. - 释放 CPU
- Reallocate the resources to another process (who has deadlock)
**Terminating Processes (撤销进程)**:
- Terminate the deadlocked process to release the resources it holds.
**Process Rollback (进程回退)**:
- Roll back to a state far enough to avoid the deadlock.
- Requires keeping historical information about the process to restore it to a safe state or point of execution.
### Livelock 活锁 
- processes or threads **keep changing state**, but **make no actual progress**. 在活锁状态下, 处于活锁线程组里的线程状态可以改变, 但是整个活锁组的线程无法推进

举例: 两人过小桥
- 为了让对方先过, 两个人都往旁边让, 但两个人总是让到同一边. 虽然两个人的状态一直在变化, 但却都无法往前推进
### Starvation (Resource Starvation) 饥饿锁 (资源饥饿)
- A thread **waits indefinitely** for a resource because **other threads continuously acquire it first**. 某个线程一直等不到它所需要的资源, 从而无法向前推进
- Happen with unfair scheduling or priority inversion.
- Can continue infinitely without cyclic resource dependency. 无法通过画图判断
## Memory management 内存管理

>Physical memory 物理内存: real, tangible RAM (Random Access Memory) 实际存在的硬件内存.
- OS & app eventually rely on physical memory (RAM) to process data, OS和app最终都必须使用物理内存来执行

>Virtual memory 虚拟内存: An abstract view of memory presented, allowing to use a larger address space than physically available. 内存管理技术, Application认为自己有连续的, 独立的内存空间
- memory protection, simplifies memory management, and allows for efficient memory sharing among multiple programs 为每个进程提供一个独立的, 完整的虚拟地址空间, 解决物理内存不足的问题

“**系统级切蛋糕**”到“**应用级用蛋糕**”层层递进
1. **分页/分段/伙伴/Slab**让物理内存既可拼也可拆
2. **内存池/GC/引用计数**让进程里的分配与回收自动化, 低碎片
### 系统级分配逻辑

| 管理方式                            | 核心思想                         | 典型优缺点                 | 协助理解                          |
| ----------------------------------- | -------------------------------- | -------------------------- | --------------------------------- |
| 连续分配 Fixed / Variable Partition | 连续物理区                       | 实现简单, 易外部碎片       | 长凳一次坐一个人                  |
| 分段 Segmentation                   | 代码段, 数据段… 独立分配         | 模块化, 需连续空间         | 客厅, 厨房配专属房间              |
| 分页 Paging                         | 虚拟地址按等大页映射到任意物理帧 | 无外部碎片, 多级页表有开销 | 切成统一大小的方格地块            |
| 分段+分页                           | 先分段再分页, 两者兼得           | 结构复杂                   | 先按功能分房 & 每间房铺同尺寸地砖 |
| Slab / SLUB                         | 预先按对象大小缓存, 重复利用     | 低碎片, 高性能             | 冰格模具, 一格一冰块              |
分页
- **页表**: “书箱→货架”快递单
- **TLB Translation Lookaside Buffer**: 搬运工袖子里塞的小抄, 避免每次都翻快递单
### 应用级分配逻辑

| 管理方式                | 场景         | 关键点                                                                  | 协助理解                                               |
| ----------------------- | ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| malloc/free手工管理     | C/C++        | 灵活; 易泄漏/悬垂                                                       | “现金支付，花多少付多少，丢了就没了”                   |
| Arena / 内存池          | 服务器、游戏 | 一次性大块申请, 内部小额分配; 释放快                                    | “把钞票先换成代金券，集中结算”                         |
| 标记-清扫 Mark-Sweep GC | JVM, Go      | 自动                                                                    | **标记**: 找到所有可达对象<br>**清扫**: 释放不可达对象 |
| 分代 Generational GC    | JVM, V8      | 新生代: 新建, 很快死亡 (少量复制)<br>老年代: 长时间存活的对象(标记整理) | “幼儿园每天打扫, 养老院定期大扫除”                     |
复制算法: (Copying GC) `Eden 区 + Survivor From 区 + Survivor To 区`
1. 标记 Eden 和 From 里存活的对象, **复制**到 To 区
2. 清空 Eden 和 From
### Stack, Method Area, Heap

3 important memory areas in JVM (java virtual machine)

> Heap 堆

Shared memory area storing all created **instances of objects and arrays** during runtime. 线程共享, 存储对象实例
- dynamically allocated and managed by the JVM's Garbage Collector. 动态分配内存, 大小可变, 由垃圾回收器管理
- Largest memory in process 进程中最大的一块内存.
- 程序员释放, 易内存泄漏 (C++)
	- 频繁 new/delete 会造成内存空间不连续, 造成大量的碎片, 降低程序效率
	- 动态分配, 库函数提供的, 机制很复杂. 库函数会按照一定的算法进行分配, 效率比栈要低得多
- **Free Area**
	- 还没被用的部分
	- 通过new来申请的内存区域

> Method Area 方法区

Shared memory area storing static variables, **runtime constant pool** (where string literals & class-level constants live), method bytecode, **class information** (field & method names).. 所有线程共享, 存储类的定义, 类的字段, 方法, 常量池
- **编译器编译后的代码等数据**: 已被虚拟机加载的类信息, 常量, 静态变量
- 不同的JVM 实现对方法区的实现有所不同, 有些将其称为永久代(Permanent Generation), 有些则使用不同的内存区域。
- can be resized dynamically 方法区的大小可配置

>Stack

Thread-specific memory area storing method call frames, **local variables** (primitives: int, boolean), **references** to objects. 线程私有, 存储局部变量(基本数据类型和对象的引用), 方法的参数, 返回值, 调用信息
- LIFO (last in first out): When a method is called, a new stack frame is pushed onto the stack. When the method completes, its stack frame is popped off. LIFO的原则
- When method is called, create a new stack frame with method’s local variables & control information. After method finishes, remove stack frame. 方法被调用时, 创建一个栈帧保存方法的局部变量和参数, 当方法执行完毕, 栈帧会被销毁
- (C++) 编译器静态分配, 机器系统提供的数据结构, 效率比较高
### 局部性原理
时间 & 空间局部性: 程序往往“扎堆”在**最近用过的对象**以及**与之相邻的对象**, 通过缓存, 预取提高效率
1. **程序结构**: 循环体重复执行同一段代码; 栈帧反复压栈/弹栈
2. **数据结构**: 数组, 连续内存块天然具备空间局部性; 对象池让节点地址聚集
3. **现实业务**: 热点用户, 热门新闻被频繁访问 (Web 缓存)

| 名称                    | 定义                                     | 典型场景                     | 举例                                 |
| ----------------------- | ---------------------------------------- | ---------------------------- | ------------------------------------ |
| 时间局部性 (Temporal)   | **最近被访问**的地址, 很快还会被再次访问 | 函数返回地址                 | 刚翻过的参考书放在手边, 待会儿还要用 |
| 空间局部性 (Spatial)    | 与当前地址**邻近**的地址将被访问         | 连续数组遍历, 指令顺序执行   | 同一本书的相邻页常连着看             |
| 顺序局部性 (Sequential) | 按地址**递增或递减**顺序访问             | 字符串扫描, 文件顺序读       | 看完第 10 页, 下一步第 11 页         |
| 工作集 (Working-Set)    | 进程在时间窗口 Δ 内使用的一组页          | 分页换入后一段时间内持续命中 | 桌面放得下的那几本当前最常查的书     |
#### 硬件/系统设计
1. **CPU 多级 Cache**
    - Cache 行常为 32‒128 Byte ⇒ 一次取相邻数据，吃足空间局部性。
    - LRU/Clock 等替换策略利用时间局部性。
2. **TLB & 页表**
    - 快速缓存虚拟页到物理帧的最近映射。
3. **预取 (Prefetch)**
    - 发现顺序模式后主动加载后续地址。
4. **分页置换**
    - 工作集模型估算“还会用到的页集合”来淘汰冷页。
## Terminology
### Prefetch/Readahead 预读失效 & 缓存感染
**会用的数据恰好在需要之前进 Cache, 一次性扫走或旁路不会复用的大块冷数据**

| 概念                      | 定义                                                         | 典型表现             |
| ------------------------- | ------------------------------------------------------------ | -------------------- |
| 预读 (Prefetch/Readahead) | 按访问模式**提前**把数据搬进高速层 (L1/L2/L3 Cache 或页缓存) | 减少缺页/Cache Miss  |
| 预读失效                  | 数据在被真正访问前已被替换掉, 或压根没有被访问到             | 带宽浪费, 性能掉头   |
| 缓存污染                  | 冷数据挤掉了热数据, 导致原本能命中的访问变成 Miss            | 命中率下降, 抖动加剧 |
### I/O 模型

| 模型                         | definition                                                               | 优点            | 缺点       | 适用场景                                |
| ---------------------------- | ------------------------------------------------------------------------ | --------------- | ---------- | --------------------------------------- |
| 阻塞 I/O                     | 必须等待操作完成才能继续执行                                             | 简单易用        | 效率低     | 简单操作 (read, write, accept, connect) |
| 非阻塞 I/O                   | **轮询**: I/O 操作后立即返回, 若未完成则返回错误, 进程可继续执行其他任务 | 提高 CPU 利用率 | 编程复杂   | 高并发应用                              |
| I/O Multiplexing多路复用     | 进程同时监控多个 I/O 事件 (循环管理)                                     | 高效管理多连接  | 编程复杂   | 网络服务器 & 高并发                     |
| Signal-driven 信号驱动 I/O** | 内核通过信号通知进程 I/O 事件的发生                                      | 异步通知        | 复杂度高   | 异步                                    |
| 异步 I/O                     | 进程发起 I/O 操作后立即返回, 内核在操作完成后通知进程                    | 完全异步        | 复杂度最高 | 异步                                    |
#### 阻塞原因
1. **数据未准备好**
    - **读操作**：数据尚未到达接收缓冲区，read调用会阻塞直到数据可用。
    - **写操作**：发送缓冲区已满，write调用会阻塞直到缓冲区有空闲。
2. **连接未建立**
    - **connect**：在 TCP 连接建立过程中，connect调用会阻塞直到握手完成。
3. **资源不可用**
    - **accept**：没有新的连接请求时，accept调用会阻塞
#### 解决阻塞
1. **使用非阻塞模式**
2. **多路复用**: 使用select、poll、epoll等多路复用技术同时监控多个 I/O 事件
3. **异步 I/O**: 使用aio_read、aio_write等异步 I/O 接口。
4. **多线程/多进程**: 每个线程/进程处理一个阻塞 I/O
