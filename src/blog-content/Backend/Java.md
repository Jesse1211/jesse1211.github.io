---
title: Java
categories:
  - Back-End
  - Java
---
# Java 
### 特点
1. **封装**
    - 把对象的属性和行为'封装'在一个不可分割的**独立单元**(即对象)中
    - 信息隐藏: 尽可能**隐藏对象的功能实现细节**. 
	    - 把不需要让外界知道的信息隐藏起来，有些对象的属性及行为允许外界用户知道或使用，但不允许更改，而另一些属性或行为，则不允许外界知晓，或只允许使用对象的功能
	 - 减少耦合, 自由修改 & 控制内部的结构, 隐藏细节
2. **继承**
    - 子类具有父类相同的行为: 子类对象具有父类的实例域和方法 / 继承方法.
	- 代码复用性, 维护性
3. **Polymorphism  多态**
    - 同一个行为具有多个不同表现形式或形态的能力
	- 编译时, 重载
	- 运行时, 多态: 子与父转换, 子类不同的功能(重写父类的方法)
		- 实现原理: 动态绑定实现, 虚方法表存储方法指针, 调用时根据对象类型从虚方法表查找
	- 消除类型之间的耦合关系, 可替换性, 可扩充性, 接口性, 灵活性, 简化性
### 编译与解释并存

High-Level programming language

- **Compiled 编译型**
	- Compiles code to machine codes 编译器**一次性**翻译源代码 -> 机器码
	- Fast execution, slow development, 执行速度快, 开发效率低
	- C, C++, Go, Rust
- **Interpreted 解释型**: interpret code to source code 解释器**一句一句**解释源代码 -> 机器代码
	- Fast development, slow execution 开发效率快, 执行速度慢
	- Python, JavaScript, PHP
- Support Multi-thread

>Java 程序
1. Develop: 源代码 `.java`
2. 编译: 生成字节码 `.class`
3. 解释: 解释字节码 binary

|             | Java                               | C++      |
| ----------- | ---------------------------------- | -------- |
| OOP         | ✅                                  | ✅        |
| 内存        | 不提供指针, 更安全                 | 提供指针 |
| 继承        | 单继承 (接口可以多继承)            | 多重继承 |
| 垃圾回收 GC | 自动内存管理                       | 手动管理 |
| 方法重载    | ✅                                  | ✅        |
| 操作符重载  | ❌ (增加了复杂性, 不符最初设计思想) | ✅        |
| 多线程      | ✅                                  | ❌        |
### 拆箱 & 装箱

- **装箱**: 用引用类型包装基本类型 int -> Integer
- **拆箱**: 包装类型转换为基本类型 Integer -> int
- 频繁拆装箱影响系统性能

### `&`和`&&`, `|` 和 `||`

`&`: `逻辑与`
`&&`: 短路与运算
- 如果`&&`左边的表达式的值是 false, 右边的表达式会直接短路掉, 不会进行运算

`|` 和`||`同理
### 重载 Overload & 重写 Overwrite

| 区别点     | 重载方法 Overload | 重写方法 Overwrite                                         |
| :--------- | :---------------- | :--------------------------------------------------------- |
| 发生阶段   | 编译期            | 运行期                                                     |
| 发生范围   | same class        | child class. 不能重写`private/final/static`和`constructor` |
| 参数列表   | 必须修改          | 不能修改                                                   |
| 返回类型   | 可修改            | 比 parent 返回值类型**更小或相等**                         |
| 异常       | 可修改            | child 声明抛出的异常类比 parent 抛出的异常类**更小或相等** |
| 访问修饰符 | 可修改            | 不能做更严格的限制(可以降低限制)                           |

```java
// 重载
StringBuilder sb = new StringBuilder();
StringBuilder sb2 = new StringBuilder("HelloWorld");

// 重写
class Parent {
    private void privateMethod()
        System.out.println("Parent: private method");

    public final void finalMethod()
        System.out.println("Parent: final method");

    public static void staticMethod()
        System.out.println("Parent: static method");
}

class Child extends Parent {
    // ❌ 这不是重写, 而是一个新的方法 (和 privateMethod 无关)
    public void privateMethod() {
        System.out.println("Child: 'private' method with same name");
    }

    // ❌ 编译错误: 不能重写 final 方法
    // public void finalMethod() {
    //     System.out.println("Child: final method");
    // }

    // ✅ 这不是重写, 而是“隐藏” (method hiding)
    public static void staticMethod() {
        System.out.println("Child: static method");
    }
}

public class Test {
    public static void main(String[] args) {
        Parent p = new Child();

		// 调用的是 Parent 的 private 方法 (根本不会被继承)
        // p.privateMethod(); // ❌ 编译错误, private 方法不能在子类中调用

        // 调用的是 Parent 的 final 方法 (被继承但不能被重写)
        p.finalMethod();   // 输出: Parent: final method

        // 调用的是 Parent 的 static 方法 (与对象实际类型无关)
        p.staticMethod();  // 输出: Parent: static method
    }
}

```

### Interface & Abstract

|                     | Interface                                                                            | Abstract                                                                                                                      |
| :------------------ | :----------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| Intuitions          | 行为的多样化: 一套行为标准, 不同的类实现同一接口<br>隐藏复杂性, 只显示必要部分的技术 | 为多个相关的类提供一个共同的基础框架, 包括状态的初始化.<br>允许子类继承父类属性和方法的机制. 通过继承, 子类可以重用父类的代码 |
| 实现方式            | `implements`                                                                         | `extends`                                                                                                                     |
| 不能直接实例化      | 实现(接口)                                                                           | 继承(抽象类)                                                                                                                  |
| 包含 & 实现抽象方法 | 实现类中实现                                                                         | 子类中实现                                                                                                                    |
| 设计目的            | 对类的行为进行约束                                                                   | 代码复用, 强调所属关系                                                                                                        |
| 实现 & 继承         | 多接口实现 & 继承                                                                    | 单一继承 & 多接口实现                                                                                                         |
| 成员变量            | `public static final`  类型, 不能被修改 & 有初始值                                   | 任何修饰符, 子类重新定义 / 赋值                                                                                               |
| function            | `public abstract`, `default`, `static`, `private`                                    | 抽象和非抽象 function<br>抽象 function 必须在子类中实现,<br>非抽象方法有具体实现, 可以直接在抽象类中使用或在子类中重写        |

### 变量 Variable - 成员变量与局部变量

|          | 成员变量 Member Variable                                                                 | 局部变量 Local variable                                                                          |
| -------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 语法形式 | - 类 (class)<br>- 被  `public`,`private`,`static`  等修饰符所修饰<br>- 可以被`final`修饰 | - 代码块或方法中定义的变量或是方法的参数<br>- 不能被修饰符 / `static`修饰<br>- 可以被`final`修饰 |
| 存储方式 | - Heap / Method areas<br>- 如果是`static`: class<br>- 如果不是`static`: 实例             | Stack                                                                                            |
| 生存时间 | 取决于对象的创建                                                                         | 调用结束即消亡                                                                                   |
| 默认值   | - 自动 / 手动赋值<br>- `final`必须手动赋值.                                              | 不会自动赋值                                                                                     |

```java
public class VariableExample {

    // 成员变量: 堆
    private String name;
    private int age;

	// 被 static 修饰的成员变量属于class, 不属于对象: 元空间, 不存到堆.
    static int b = 20;

    // 方法中的局部变量
    public void method() {
		static int d = 40; // 编译错误, 不能在方法中使用 static 修饰局部变量
        String str = "Hello, world!"; // 局部变量, 存放在栈中
    }
}
```

### `static`

节省内存 - 静态变量只会被分配一次内存

| 修饰对象 | 作用                                                                      |
| -------- | ------------------------------------------------------------------------- |
| 变量     | 被类的所有实例共享                                                        |
| 方法     | 与实例无关                                                                |
| 代码块   | 类加载时: 初始化数据, 只执行一次                                          |
| 内部类   | 与外部类绑定但独立于外部类实例                                            |
| 导入     | 可以直接访问静态成员, 无需通过类名引用, 简化代码书写, 但会降低代码可读性. |
#### 静态方法 & 实例方法

`static function`不能调用 non-static member

- 静态方法属于 class, 在 class 加载时会分配内存, 通过`class.function`访问. 非静态成员属于实例对象, 需要通过类的实例对象去访问
- 先有`static fuction`后有`non-static function`

**无需创建对象**: `类名.方法名 Person.method(); | 对象.方法名 person.staicMethod()`

#### 子类和父类执行顺序

1. 执行父类的静态代码块 (类第一次加载时执行)
2. 执行子类的静态代码块 (类第一次加载时执行)
3. 执行父类的构造方法
4. 执行子类的构造方法

- 静态代码块: 在类加载时执行, 仅执行一次，按父类-子类的顺序执行
- 构造方法: 在每次创建对象时执行, 按父类-子类的顺序执行, 先初始化块后构造方法
### `final`, `finally`, `finalize`

- `final` 是一个修饰符
	- 类: 不能被继承, String, Integer 和其他包装类都是 final
	- 方法: 不能被重写, 不能改变父类中被 final 修饰的方法
	- 变量: 初始化后不能修改
		- 基本数据类型: 不能更改
		- 引用类型: 不能更改指向对象, 但是指向的对象内容可以改变
- `finalize` 是Object 类的一个Function
	- 在垃圾回收器将对象从内存中清除出去之前做一些必要的清理工作
	- 在垃圾回收器准备释放对象占用的内存之前被自动调用. 不能显式地调用 finalize 方法
- `try-catch-finally`
	- `finally`
		- 一定被执行
		- **用来释放资源**
	- `try`: 用于捕获异常. 可接 n 个`catch`. if no `catch`, then `finally`
	- `catch`: 处理 try 捕获到的异常
	- 特殊情况
		- finally 之前虚拟机被终止运行; 程序所在的线程死亡; 关闭 CPU
		- 有`catch return`: `finally` 最后执行
		- 有`finally return` & `try return`: 忽略 `try return`
		```java
		public static int f(int value) {
		    try {
		        return value * value;
		    } finally {
		        if (value == 2) {
		            return 0;
		        }
		    }
		}
		System.out.println(f(2));
		// 0
		```
### `equals` & hashCode & `==`
#### `==` & `equals`
`==`
- 对象的引用是否指向同一个对象实例
- 基本数据类型 (`int`, `double`, `char`) 值是否相等

`equals() 方法`
- 两个对象的内容是否相等.
#### 为什么重写 equals 时必须重写 hashCode ⽅法
`hashCode` 哈希码
- 计算对象的内存地址 / 对象属性

基于哈希的集合类 (如 HashMap) 需要基于 `equals` & `hashCode`存储和查找对象
- 如果 equals 相等, 那么hashCode 必须相等
- 查找对象: 使用 key 的哈希码来确定对象位置, 然后通过 `equals()` 方法找到对应的对象
- 没有重写 `hashCode()`方法: 相等的对象有不同的哈希码, 导致重复元素或键值冲突等问题
- ==java如何解决hash冲突==
#### 为什么两个对象有相同的 hashcode 值, 它们也不⼀定相等
哈希冲突: 哈希函数将输入域映射到较小的输出域, 不同的输入值会产生相同的输出值. 两个不相等的对象有相同的 hashCode
- 解决: 比较键对象的哈希码 & 使用 equals 检查键对象是否真正相等
	- 如果哈希码相同 & equals 为 false, 两个对象就不被视为相等
### Java 创建对象有哪几种方式

1. `new`: 调用类的构造方法来创建对象
	```java
	Person person = new Person();
	```
2. 反射机制: 在运行时创建对象, 并且可以访问类的私有成员, 在框架和工具类中比较常见
	```java
	Class clazz = Class.forName("Person");
	Person person = (Person) clazz.newInstance();
	```
3. `clone` 拷贝: 需要继承 `Cloneable` 接口并重写 `clone()`
	```java
	Person person = new Person();
	Person person2 = (Person) person.clone();
	```
4. 序列化机制: 继承 `Serializable`
	```java
	Person person = new Person();
	ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.txt"));
	oos.writeObject(person);
	ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.txt"));
	Person person2 = (Person) ois.readObject();
	```
### String, StringBuffer, StringBuilder

> String: 字符串常量

- 采用 final 进行保存, 每次修改需要创建新对象
- 不可变字符串
- immutable

> StringBuffer: 操作对象, 不生成新的对象

- 不采用 final 进行保存
- 可变字符串
- 线程安全, `synchronized`
- 较慢, 锁开销

> StringBuilder: StringBuffer 简易替换

- 不采用 final 进行保存
- 可变字符串
- 非线程安全 (推荐单线程场景)

String + String 运行时使用 `StringBuilder` 拼接

```java
String s2 = "Hello";
String s3 = s2 + "World";

// 运行时
String s3 = new StringBuilder()
	.append(s2)
	.append("World")
	.toString();
```
#### 为什么String 不可变类

1. 使用安全. 因为字符串经常用作参数传递. 
2. 状态不会改变, 更容易进行缓存和重用. (字符串常量池存在的意义) 所有的引用都指向常量池中的同一个对象, 从而节约内存
3. 哈希值固定不变, String 适合作为 HashMap / HashSet 等集合的键, 因为计算哈希值只需要进行一次, 提高了哈希表操作的效率
### 泛型 Generics

**占位符**, 编译器自动转换
- 编译时被具体类型“填充”
- 实例化的 class 才能传递类型参数, 静态方法的加载先于类的实例化
- `ArrayList<E> extends AbstractList<E>`

**1. 泛型类**
```java
public class Generic<T>{
    public Generic(T key) {
        // ...
    }
}
//在实例化泛型类时, 必须指定T的具体类型
Generic<Integer> genericInteger = new Generic<Integer>(123456);
```

**2. 泛型接口**
```java
public interface Generator<T> {
    public T method();
}

// 实现泛型接口, 不指定类型:
class GeneratorImpl<T> implements Generator<T>{
    @Override
    public T method() {
        return null;
    }
}

// 实现泛型接口, 指定类型:
class GeneratorImpl implements Generator<String> {
    @Override
    public String method() {
        return "hello";
    }
}
```

**3. 泛型方法**:

```java
public static <E> void printArray( E[] inputArray )
{
	System.out.printf( "%s ", element[0] );
}

// 创建不同类型数组：Integer, Double 和 Character
Integer[] intArray = { 1, 2, 3 };
String[] stringArray = { "Hello", "World" };
printArray( intArray  );
printArray( stringArray  );
```

> 静态泛型**方法**

- 静态泛型方法没有办法使用类上声明的泛型的. 只能使用自己声明的  `<E>`

```java
class Util<T> {
    // ❌ 不能使用类上的 T
    // public static T invalidMethod(T input) { ... } // 编译错误

    // ✅ 正确方式：自己声明一个 <E>
    public static <E> E genericStaticMethod(E input) {
        return input;
    }
}
```

### 异常处理
#### Error
严重的错误, 程序无法处理的. 应用程序通常无法恢复
- OutOfMemoryError 表示内存不足, StackOverflowError 表示栈溢出
#### Exception
程序可以处理的异常
1. 编译时异常 (Checked Exception): 
	- 编译时必须被显式处理 (捕获或声明抛出)
	- 可能抛出某种编译时异常, 但没有捕获或没有在方法声明中用 throws 子句声明它, 不通过编译, IOException, SQLException...
2. 运行时异常 (Runtime Exception): 
	- 运行时抛出, 是 RuntimeException 的子类.
	- Java 编译器不要求必须处理它们
	- 运行时异常通常是由程序逻辑错误导致的, NullPointerException, IndexOutOfBoundsException...
### 反射
**运行过程**中构造任意类的对象, 获取任意类的成员变量和成员方法, 获取任意一个对象所属的类信息, 调用任意一个对象的属性和方法

- 动态加载类并创建对象
	```java
	String className = "java.util.Date";
	Class<?> cls = Class.forName(className);
	Object obj = cls.newInstance();
	System.out.println(obj.getClass().getName());
	```

- 访问字段和方法:
	```java
	// 加载并实例化类
	Class<?> cls = Class.forName("java.util.Date");
	Object obj = cls.newInstance();
	
	// 获取并调用方法
	Method method = cls.getMethod("getTime");
	Object result = method.invoke(obj);
	System.out.println("Time: " + result);
	
	// 访问字段
	Field field = cls.getDeclaredField("fastTime");
	field.setAccessible(true); // 对于私有字段需要这样做
	System.out.println("fastTime: " + field.getLong(obj));
	```
#### 反射有哪些应用场景

1. Spring: 动态加载和管理 Bean
	```java
	Class<?> clazz = Class.forName("com.example.MyClass");
	Object instance = clazz.newInstance();
	```
2. Java 的动态代理 (Dynamic Proxy) 机制就使用了反射来创建代理类. 代理类在运行时动态处理方法调用, 这在实现 AOP 和拦截器时非常有用
	```java
	InvocationHandler handler = new MyInvocationHandler();
	MyInterface proxyInstance = (MyInterface) Proxy.newProxyInstance(
	    MyInterface.class.getClassLoader(),
	    new Class<?>[] { MyInterface.class },
	    handler
	);
	```
3. JUnit 和 TestNG 等测试框架发现和执行测试方法. 
	```java
	Method testMethod = testClass.getMethod("testSomething");
	testMethod.invoke(testInstance);
	```
### `Future`

> 异步思想的运用
> 避免程序一直原地等待耗时任务执行完成, 执行效率太低

1. 将任务交给子线程去异步执行 (提交给  `Future` 处理)
2. 同时做其他事情. (随时可以取消任务 & 获取任务的执行状态)
3. 等其他事情做完后, 从  `Future`  取出任务执行结果
