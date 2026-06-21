---
title: C++
categories:
  - Back-End
  - C++
---

# C++


|                                      | C                                                                                                     | C++                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 编程范式                             | **面向过程**, 强调函数和过程<br>- 程序由函数 / 子程序组成<br>- 数据和算法分离, <br>- 函数调用实现功能 | C 基础上扩展**面向对象**<br>- 类, 对象, 继承, 多态, 封装 |
| **类**, **模板**, **命名空间**等特性 | ❌没有                                                                                                 | ✅有                                                      |
| 内存管理                             | 手动, malloc, calloc, realloc, free                                                                   | 手动 + 构造函数, 析构函数, new, delete                   |
| 数据抽象                             | struct组织数据, 无法在结构体内部定义函数                                                              | struct & class 包含成员变量和成员函数                    |
| 模板与泛型                           | 没有模板机制, 依赖宏和手动复制粘贴                                                                    | template机制, 可以实现类型安全的泛型编程                 |
| 命名空间                             | 全局标识符位于同一命名空间, 易发生命名冲突                                                            | namespace: 按功能模块分组                                |
| 异常处理                             | 手动处理报告错误, 没有内置异常处理机制                                                                | try-catch-throw: 抛出异常并捕获                          |
| 标准库差异                           | 大部分轮子都要自己造                                                                                  | STL                                                      |
| 编译与链接                           | `.c`, 编译期间不会修改符号名 / 添加额外类型信息                                                       | `.cpp / .cc` 编译器支持函数重载, C++ 链接器链接          |
## 执行顺序
### 1. Preprocessor 预处理 `.cpp` -> `.i`
- 处理宏定义, 头文件包含, 条件编译等
- `#` 开头 = 预处理指令

| Preprocessor 预处理                          | Definition                                         | example                                                                    |
| -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| `#include`                                   | 头文件包含处理, 直接拷贝到当前文件中               | `#include <xxx>`: 系统文件目录下查找<br>`#include "xxx"`: 用户自定义的文件 |
| `#define`                                    | 宏定义<br>文本替换: 没有类型, 给出立即数, 多个拷贝 | `#define TEMP 123`                                                         |
| `#undef`                                     | 取消宏定义                                         | `#undef TEMP`                                                              |
| `#warning`                                   | 发出警告                                           |                                                                            |
| `#error`                                     | 终止编译 & 输出错误信息                            | `#error "This file should not be compiled"`                                |
| `#ifdef, #ifndef, #if, #elif, #else, #endif` | 条件编译: 根据条件控制哪些代码被编译               | `#ifdef DEBUG`<br>`... // 如果DEBUG被定义就执行`<br>`#endif`               |
### 2. Compilation 编译 `.i` -> `.s` (汇编代码)
处理当前文件
#### 接口分离 (interface separation) 机制
- `.h` 提供接口
- `.cpp` 提供实现
- 单独编译
- 静态绑定 Static Binding: 分配`non virtual` 函数调用 / 变量引用 的地址
	- 知道“符号引用”, 不知道具体地址, 链接阶段会分配地址 & 重定位
- 链接器组合
#### Memory alignment 内存对齐
- 安排存储位置, 使得每个变量的地址都是其自身大小的整数倍
- 硬件原因: 减少CPU读取数据的次数, 提升性能
- 平台原因 (移植原因): 不是所有的硬件平台都能访问任意地址上的任意数据, 某些硬件平台只能在某些地址处取某些特定类型的数据, 否则抛出硬件异常
- `struct`
#### `inline`
- a request to the compiler, replace the functions call with the actual code 建议编译器内联展开函数, 编译器可以无视该建议, ==为什么是建议==
- 函数的定义建议在头文件中, 否则会导致链接错误(unresolved external symbol)
- 复杂函数会增加代码体积, 降低程序性能
#### Template 模板
产生特定具体类型函数的模具, 也就是重复的事情交给了编译器
```c++
template<class T> 
T Add(T left, T right) 
{ 
	return left + right; 
}
```
 - **根据传入类型推演生成对应类型的函数, 地址不同**
 - 实例化
	 - 隐式: 编译器推演类型 `Add(a1, a2)`
	 - 显示: 指定类型 `Add<double>(a1, a2)`
 - 参数
	 - 类型 class, typename
	 - 非类型 variable, constant `template<class T,size_t N>`

### 3. Assembly 汇编: `.s` -> `.o` (换成机器码, 生成目标文件)
### 4. Linking 链接: `.o` -> `.exe` (合并`o` & 库文件 => 可执行文件)
- 整合所有文件, 解决符号引用 (如外部函数, 变量)
	- 调用其他文件的函数
	- 类成员函数 `Class::helper()`
- 合并多个目标文件 (.o/.obj) 和库文件 (.a/.so/.lib/.dll)
	- 链接器找库文件的实现, 合并到最终程序 (重定位: 重新分配地址)
#### `extern`
external linkage 外部链接: 在文件间共享数据 (**全局变量, 函数, 模板声明**)
- 分离式编译: 将程序分割为若干个文件被独立编译
- 分开变量的声明 & 定义

> 变量的声明: 向程序表名变量的类型和名字, 一个文件如果想使用别处定义的名字则必须包含对那个名字的声明

>变量的定义: 申请存储空间 & 与变量名相关联, 为变量指定初始值. 变量可以声明多次 & 定义一次. - 函数: 带有{}是定义, 否则是声明

```c++
//fileA.cpp
int i;                //声明并定义i
int j = 1;            //声明并定义j
double max(double d1,double d2){} //定义

//fileB.cpp
extern int i;         //声明i而非定义
extern int j = 2;     //定义j而非声明, 报错, 多重定义
int j;                //错误, 重定义, j是在全局范围内声明
extern double max(double d1,double d2); //声明
```
##### non-const 全局变量
extern 全局变量: 在其他文件中寻找这个变量的定义. **全局 non-const 默认外部链接**
```c++
//fileA.cpp
int i = 1;         // 声明并定义全局变量i, 分配内存 + 默认具有外部链接

//fileB.cpp
extern int i;     // 声明i，链接全局变量, 寻找定义: 告诉编译器, i已在其他地方定义, i = 1;

//fileC.cpp
extern int i = 2;  //错误，多重定义: fileA.cpp
int i;             //错误, 多重定义: fileA.cpp
main()
{
    extern int i;  //正确, 链接全局变量, 寻找定义 (不分配内存, 不定义变量)
    int i = 5;     //正确，新的局部变量i, 覆盖外部i
}
```
##### const 全局变量
默认`internal linkage`内部链接, 需要在定义时指明extern
```c++
//fileA.cpp
extern const int i = 1;        //定义

//fileB.cpp                    
extern const int i;        //声明, 访问外部定义
```

### 5. 运行时
- 虚函数 `virtual`
	- optional 改写 (运行时动态绑定, 多态)
## 关键字
### 纯虚函数 
`virtual void speak() = 0;`
- 基类变成 **抽象类** → 不能实例化
- 子类 **必须实现** 纯虚函数, 也声明为抽象类
- 用来定义 **接口规范**
### `.h` 头文件
>声明 (declarations), 被`.cpp` 文件包含后编译 (不直接编译)
- 通过 `#inclue ".h"`包含到 `.cpp` 文件中
- 包含:
	- 类的声明, 不能赋值 (数据 & 函数)
		- redefinition 重定义函数成员: 没有写`class`中
	- 类静态数据成员的定义和赋值, 建议只是定义
	- 非类成员函数的声明
	- 常数: `constant a=5;`
		- 默认 internal, 只在包含它的文件中有效, 对其他文件不可见
	- 静态函数
	- 内联函数 (inline)
		- 在调用时被展开 (不是跳过去执行函数), 不需要链接成目标代码
- 不能包含:
	- 非静态变量 (不是类的数据成员) 的声明
	- `using namespace`: 应放在.cpp中, `.h` 文件中使用 `std::string`
#### 头文件如何关联源文件

1. `a.h` 声明, `b.cpp` 实现
2. `c.cpp` 使用 `#include "a.h"`: 使用的被`b.cpp`实现

实现: 
- `a.cpp` 实现`a.h`
- `b.cpp` 要用到 `a.cpp`: `#include "a.h"`
	- 本身不需要知道 `a.cpp`，但链接阶段必须包含 `a.o`
```text
a.h (声明)
↓        ↓
a.cpp    b.cpp
↓        ↓
a.o      b.o      ← 各自独立编译为目标文件
   ↓     ↓
链接器将它们合并 → 执行文件
```
### `.cpp`源文件
>实现 (definitions), 单独编译成 `.o/.obj`，最终链接为可执行文件
- 实现头文件中声明的函数
- 定义类的静态成员
- 定义全局变量
- 包含 `.h` 文件来获得声明
### `struct` 结构体 vs `union` 共同体 vs `class`

|                    | Struct                                     | Union                      |
| ------------------ | ------------------------------------------ | -------------------------- |
| definition         | 自定义类型, 将不同类型的数据组合成一个整体 | 不同类型变量占用同一段内存 |
| 成员同时存在       | ✅ 独立地址                                 | ❌ 占用同一段内存           |
| 长度 `sizeof(...)` | 内存对齐后所有成员长度的总和               | 最长数据成员的长度         |
| Memory alignment   | ✅                                          | ❌                          |
#### struct vs class 
- Defaults: struct public, class private
- 相同: 
	- Properties: Data members, member functions, Constructors and destructors, Inheritance (single and multiple), Polymorphism (virtual functions), and Templates.
### `#define` vs `const`

|           | `#define` (preprocessor directive) | `const`                                                                                                                                                                             |
| --------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| variables | 没有类型, 所给出的是一个立即数     | 有类型名字, 存静态区域                                                                                                                                                              |
| 处理阶段  | (编译之前)替换, 多个拷贝           | 编译时确定, 一个拷贝                                                                                                                                                                |
| 用指针    | ❌                                  | ✅                                                                                                                                                                                   |
| 定义函数  | 只是文本替换, 副作用多             | `const method`: Immutability Guarantee<br>- Only call `const method` & change `mutable` variables of the object<br>- 只能调用同一个对象的 `const` 成员函数 & 修改`mutable` 成员变量 |
### new & delete vs malloc & free

`new`
1. 简单数据类型: 分配内存
2. 复杂数据类型: `new` then `constructor`

`delete`
1. 简单数据类型: delete = free
2. 复杂数据类型: `deconstructor` then `delete`

|            | new & delete                                                                                                                                   | malloc & free                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| definition | c++关键字, 编译器支持                                                                                                                          | 库函数, 需要c的头文件支持                                              |
| 参数       | 无须制定内存块的大小, 编译器计算                                                                                                               | 显式地指出所需内存的尺寸                                               |
| 返回类型   | 安全性的操作符: 成功, 返回对象类型的指针, 类型严格与对象匹配                                                                                   | 成功分配返回void, 需要类型转换                                         |
| 分配失败时 | 抛出bad_alloc异常                                                                                                                              | 返回 NULL                                                              |
| 自定义类型 | - 先 `new`, 申请足够的内存. 调用`constructor`, 返回自定义类型指针<br>- delete先`deconstructor`, 调用 delete 释放内存<br>- 底层是 malloc & free | malloc/free是库函数, 动态的申请和释放内存, 无法执行 `(de)constructors` |
| 重载       | ✅                                                                                                                                              | ❌                                                                      |
| 内存区域   | new: 自由存储区 (free store) 动态分配内存空间<br>                                                                                              | malloc: 从Heap上动态分配内存                                           |

为什么需要 new/delete
- malloc/free无法满足动态对象都要求. new/delete 是运算符, 编译器保证调用(de)constructor. 但是 malloc/free 不会, 因为是库函数
### `static`
1. `Function.Variable`函数体内: Function内部, 初始化只执行一次 (不同于auto变量)
2. `namespace`模块内：修饰全局变量或全局函数, 模块内使用
3. `Class.Variable` 类中成员变量: 整个类所有, 只有一份拷贝
4. `Class.Function` 类中成员函数: 整个类所有, 不接受this指针, 只能 `static` variable
## STL (standard template library)

| 重要组件         | 描述                                                                                                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 容器 Containers  | template class & operations: vector, list, queue, stack, set, map                                                                                                                                  |
| 算法 Algorithms  | function for template: 容器元素操作 (`sort`, `find`, `copy`, `for_each`)                                                                                                                           |
| 迭代器 iterators | point to the memory addresses: 访问容器元素 <br>(Random Access iterators 随机访问迭代器, Bidirectional iterators 双向迭代器, Forward iterators 前向迭代器, input/output iterators 输入/输出迭代器) |
| Functors         | Treat objects as function 像函数一样调用的对象<br>(`plus`, `equal_to`, `logical_and`)                                                                                                              |
### Iterator 迭代器
- 将不同容器的底层存储实现封装成一致的访问方式, 使得标准算法 (std::sort, find, for_each) 适用于所有支持相应迭代器的容器
- 遍历, 修改, 插入, 删除无需直接操作指针 / 索引

- `std::vector`: 触发**重分配**使所有迭代器失效 (push_back, emplace_back)
	- 如果没有重新分配, 之前的iterator有效, 插入点之后的iterator失效
- `std::deque`
    - 两端插入/删除 / 中间insert/erase 可能使**所有迭代器失效*
	- 两端插入时: reference和pointers有效
- 顺序链表 `std::list, forward_list`
	- insert: iterator, pointer和 reference 有效
    - erase被删除节点的迭代器失效, 其他保持有效
- 关联容器 `std::map, set`
	- insert: iterator, pointer和 reference 有效
    - erase 被删除元素的迭代器失效, 其他保持有效
- 无序关联容器 `std::unordered_map, unordered_set`
    - **rehash**: 所有迭代器失效
    - insert/erase (不触发 rehash) 指向被删除元素的迭代器失效
### 线程不安全的情况
- 在对同一个容器进行多线程的读写, 写操作时
- 在每次调用容器的成员函数期间都要锁定该容器;
- 在每个容器返回的迭代器 (例如通过调用begin或end) 的生存期之内都要锁定该容器;
- 在每个在容器上调用的算法执行期间锁定该容器

## Pointer 指针 vs Reference 引用

|            | Reference                             | Pointer                                                      |
| ---------- | ------------------------------------- | ------------------------------------------------------------ |
|            | - `ref` = value<br>- `&ref` = address | - `ptr` = the pointer<br>- `*ptr` = the value that points to |
| definition | 内存地址                              | 独立空间, 储存内存地址 (ref内容)                             |
| 更新       | 不可改变, 创建时必须被初始化          | 可改变指向                                                   |
| 储存大小   | 被引用对象的大小                      | 存储内存地址                                                 |
| 初始化     | 对象的引用                            | NULL                                                         |
| 参数传递   | `&x`<br>- 操作对象                    | `*x`<br>- 被解引用操作, `*x + ..`                            |
| 级         | 没有分级                              | 多级                                                         |
```c++
// 值传递
void Func1(int x) { x = x + 10; } 

int n = 0; 
Func1(n); 
cout << "n = " << n << endl; // n = 0 

// 指针传递
void Func2(int *x) { (* x) = (* x) + 10; } 
int n = 0; 
Func2(&n); 
cout << "n = " << n << endl; // n = 10 

// 引用传递
void Func3(int &x) { x = x + 10; } 
int n = 0; 
Func3(n); 
cout << "n = " << n << endl; // n = 10
```
### Smart pointers 智能指针
自动管理动态分配的对象生命周期, 确保程序不会出现内存和资源泄漏
- 类: 超出作用域会自动调用析构函数, 释放资源

1. `shared_ptr` 共享, 同一时刻多指针 -> 同一个对象
2. `unique_ptr` 独占, 同一时刻一个指针 -> 同一个对象
3. `weak_ptr` 辅助 `shared_ptr`, 不增加引用计数, 防止循环引用 (memory leak) 解决相互引用导致的死锁问题
### 野指针

野指针不是NULL, 是未初始化 / 未清零的指针, 指向的内存地址不是程序员所期望的, 可能指向了受限的内存.
1. 指针变量没有被初始化
2. 指针指向的内存被释放了, 但是指针没有置NULL
3. 指针超过了变量了的作用范围, 比如`b[10]`, 指针`b+11`

### Lists & Methods & Pointers
#### List of pointers 指针数组, 一维指针数组
- `[]` 优先级高, 先数组, 再指针
- 与p结合成为一个有n个指针类型的数组元素 
- `*p=a`: 表示指针数组第一个元素的值, a的首地址的值
```c++
int a = 10, b = 20;
int *p[2] = { &a, &b };  // p[0] 指向 a 的指针, p[1] 指向 b 的指针
std::cout << *p[0] << std::endl;  // 输出 10
std::cout << *p[1] << std::endl;  // 输出 20
```
#### List of integers 数组指针 (二级指针), 指向数组的指针 
- 先指针, 再数组
1. 说明p是一个指针, 指向一个整型的, 长度n的一维数组
2. 执行p+1时, p要跨过n个整型数据的长度. 
3. 数组指针是指向数组首元素的地址的指针
```c++
int arr[2] = { 1, 2 };
int (*p)[2] = &arr;  // 数组指针：p 是指向一个长度为 2 的 int 数组的指针
std::cout << (*p)[0] << std::endl;  // 1
std::cout << (*p)[1] << std::endl;  // 2
```
#### Method pointer
- 指针指向函数 `value = (*fun)(params)`
	```c++
	int Fun(int x) {return x;}
	int (*p)(int x) = &Fun;
	int res = (*p)(1);
	```
#### List of method pointers 
- 先数组, 后指针, 每个指针对函数
	```c++
	int Fun1(int x) {return x;}
	int Fun2(int y) {return y;}
	
	int (*p[2])(int x); // `value = (*fun[index])(params)`
	p[0] = &Fun1;
	p[1] = &Fun2;
	int res1 = (*p[0])(1);
	int res2 = (*p[1])(1); 
	```
#### Pointer to list of method pointers
- 先指针, 再数组, 每个数组是指针
	```c++
	int Fun1(int x) {return x;}
	int Fun2(int y) {return y;}
	
	int (*p[2])(int x);
	int (*(*pfun)[2])(int x); // `(*(*pfun)[index])(params)`

	pfun = &p;
	p[0] = &Fun1;
	p[1] = &Fun2;
	int res1 = (*(*pfun)[0])(99)
	int res2 = (*(*pfun)[2])(99)
	```
### Pointer vs Reference vs Value 传递
| 对比项           | 值传递 (Value)                    | 引用传递 (Reference)                                                                                              | 指针传递 (Pointer)                 |
| ---------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 编译期           | 确定类型, 生成拷贝机器码          | 确定类型为引用, 生成间接寻址机器码                                                                                | 确定类型为指针，生成解引用机器码   |
| 运行时           | 复制到栈帧里的形参                | 绑定引用 → 把地址存到栈帧                                                                                         | 复制地址                           |
| **性能**         | 可能有拷贝开销                    | 高效, 无拷贝                                                                                                      | 高效, 无拷贝                       |
| **能否修改实参** | ❌                                 | ✅                                                                                                                 | ✅                                  |
| **可否为空**     | ❌                                 | ❌                                                                                                                 | ✅ nullptr                          |
| **安全性**       | 高, 不会误改                      | 中, 可能误改                                                                                                      | 较低, 可能 nullptr 误用            |
| **典型场景**     | 小对象, 输入参数                  | 大对象, 输入/输出参数                                                                                             | 动态分配, 内部能改变所指向的堆内存 |
| 返回值           | 拷贝值 (不一定, 多数编译器用 RVO) | 不拷贝 (加 `const` 避免外部修改)                                                                                  | 拷贝指针, 不拷贝对象               |
| 局限             |                                   | - 不返回局部变量的引用 (生命周期结束)<br>	- 临时变量没有被赋予实际的变量                                          |                                    |
| 优点             |                                   | - 参数作为局部变量在栈中开辟了内存空间: 实参变量的地址<br>- 操作为成间接寻址: 通过Stack栈中存放的地址访问实参变量 |                                    |
## overload 重载, override 覆盖, overwrite 隐藏
| 特性           | Overload 重载 | Override 重写 | Hiding 名称隐藏 |
| -------------- | ------------- | ------------- | --------------- |
| 是否在同一类中 | ✅             | ❌ 跨类        | ❌ 跨类          |
| 函数名相同     | ✅             | ✅             | ✅               |
| 参数相同       | ❌             | ✅             | 无所谓          |
| 需要 `virtual` | ❌             | ✅             | ❌               |
| 发生时机       | 编译时        | 运行时        | 编译时          |
| 是否影响多态性 | ❌             | ✅             | ❌               |
>`virtual`: for override / polymorphism, the method must be `virtual`
## 内存泄漏

内存浪费: Heap内存未释放 / 无法释放, 导致运行速度减慢 / 系统崩溃

1. `(de)constructors` 中`new, delete`没有配套
2. 释放时没有使用`delete[]`，使用了`delete`
3. base class 没有`virtual deconstructor`: 子类的`constructors`不会被调用
4. 没有正确的清楚嵌套的对象指针

```cpp
struct Base {
    virtual ~Base() { std::cout << "Base dtor\n"; }
};

struct Derived : Base {
    ~Derived() override { std::cout << "Derived dtor\n"; }
};

Base* p = new Derived();
delete p;

// Derived dtor
// Base dtor
```
## 栈溢出

函数中的局部变量造成的溢出, 分配的的大小超过栈的最大值
- 函数调用层次过深
- 局部变量体积太大

**解决**
1. 增加栈内存的数目
2. 使用堆内存
	- 数组定义改成指针, 动态申请内存
	- 局部变量变成全局变量
	- static
## 特殊成员函数
`class Empty {};`

编译器只要“用得上”就生成，对空类也一样
1. 默认构造函数 `Empty()`
2. 析构函数 `~Empty()`
3. 拷贝构造 `Empty(const Empty&)`
4. 拷贝赋值 `Empty& operator=(const Empty&)`
### 数据成员
- **至少 1 字节**（所谓 _EBO_ 前的 padding）：保证不同对象地址不相同。
- 不含虚函数时没有 vptr；若类含虚函数，即使函数体为空，也会有隐藏的 vptr 指针。
## 线程并发约束

| 概念                                             | 作用                                                                                                                        | 常见触发方式           |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **并发执行 concurrent execution**                | 多线程“逻辑上”同时运行, 对同对象可能发生读/写                                                                               | `std::thread`, 并发库  |
| **顺序一致性 sequenced-before / happens-before** | 程序中的“观察顺序”规则<br>1. **sequenced‑before**: 单线程内的语句出现顺序 <br>2. **happens‑before**: 跨线程可见性的因果顺序 | 加锁, 原子操作, fence  |
| **数据竞争 data race**                           | 至少两个线程无同步地访问同一存储位置，且其中一个为写操作 → **未定义行为**                                                   | 忽视锁或 `std::atomic` |

