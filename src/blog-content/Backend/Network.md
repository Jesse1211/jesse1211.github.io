---
title: Network
categories:
  - Back-End
  - Network
---
# Network

# Network

Distributed system which connects independent computers to share data & resources. (分散的, 具有独立功能的计算机系统, 通过通信设备 & 线路连接, 由功能完善的软件实现资源共享和信息传递的系统)
## Open System Interconnect OSI

- Every level implements independent functions & protocols, connect to neighbors by interfaces without disturb. (每层实现独立功能 & 协议, 和邻层使用接口通信, 互不打扰)
- The theoretical OSI model. (理论上的网络通信模型)

|                    | 内容                                                                                               | 网络协议                                   | 丢包后果                     |
| ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------- |
| Application layer  | 提供网络服务 & 用户应用软件接口<br>- message                                                       | HTTP, 域名系统: DNS, 电子邮件系统: SMTP... |                              |
| Presentation layer | 确保系统间交流信息顺畅, 数据转换, 压缩, 加密                                                       | JPEG, ASCII, SSL/TLS                       |                              |
| Session layer      | 管理 (建立, 维护, 重连) 应用程序之间的会话                                                         |                                            |                              |
| Transport layer    | 端到端通信服务, 确保数据可靠传输                                                                   | - TCP (segment)  <br>- UDP (datagram)      | TCP: 重传<br>UDP: 直接缺一条 |
| Network layer      | 负责多网络间数据传输, 处理数据包的分组, 转发和路由选择, 确保数据可以从源端传输到目标端<br>- packet | - IP<br>- ICMP (诊断网络通信问题)          | 完整才交付                   |
| Data Link layer    | 确保数据传输可靠, 建立&维护相邻节点链路<br>- Ethernet, Wifi                                        | - ARP (Address Resolution Protocol)        | 整报作废                     |
| Physical layer     | Bits                                                                                               |                                            |                              |
减少IP丢包风险 (避免IP分片):
- **MTU (Maximum Transmission  Unit)** 位于链路 / 网络层: 一次 IP 包承载的最大总长度 (头+数据)
- TCP握手阶段交换MSS (Maximum Segment Size) TCP payload size
	- MSS = MTU − IP头 − TCP头
- 可用MSS为最小值

>Head-of-line blocking 队头阻塞

| 层次                  | Head-of-line blocking 队头阻塞原因   | example                      |
| --------------------- | ------------------------------------ | ---------------------------- |
| **传输层 (TCP)**      | 丢包: 缓存后续分节, 整个连接等待重传 | HTTP/2 (多流在一个 TCP 连接) |
| **应用层 (HTTP/1.1)** | pipelining 响应顺序固定              | HTTP/1.1                     |
### TCP / IP 
The structure which used in practical usage. (实际应用层面上的网络通信模型结构)
1. Application layer
2. Transport layer
3. Internet layer
4. Link layer

### 5-level structure 五层体系结构
1. Application layer
2. Transport layer
3. Network layer
4. Data Link layer
5. Physical layer

### Process from URL to rendering 从URL到显示网页的过程
1. **DNS**: 
	- interpret domain to IP address 解析域名为 IP
2. **TCP**: 
	- Establish TCP connect from the server in IP address (3-way handshake, IP protocol)
	- 通过 IP 地址 与服务器建立 TCP 连接. (TCP 三次握手, 使用**IP**协议)
3. **HTTP**: 
	- HTTP request to server. Use OSPF (open shortest path first) to control IP pkgs between routers
	- 构建 HTTP 请求, 发送到服务器, 使用**OSPF协议**控制路由器间的IP数据包
4. **Server receives request 服务器处理请求**
	- Processes request & generates HTTP response based on URL (根据请求的资源路径, 生成 HTTP 响应消息)
	- ARP to interpret IP to MAC address (when router communicates to server)
	- **ARP协议**转换IP地址到MAC地址 (路由器与服务器通信时)
		- Ethernet and Wi-Fi are designed to work with MAC addresses. IP is a layer above (Layer 3), and the data has to be packaged in a form that the underlying network can deliver.
5. **Browser receive HTTP response 浏览器接收 HTTP 响应**: 
	- Interpret HTML, build DOM Tree, interpret CSS & JS..., render
6. **Connect termination 断开连接**: 
	- TCP 4-way-handshake
## Transport Layer : TCP & UDP

|            | TCP                                                                                                                                          | UDP                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 元组       | 四元组: server & client 有多个 socket (src's & dest's ip & port)                                                                             | 二元组: server & client 只有一个socket (dest's ip & port), (也可以四元组唯一标识一个回话) |
| 报文       | 字节流, 拆分报文成多个 TCP 报文传输. 在目的站组装                                                                                            | 报文, 不拆分, 一次全发                                                                    |
| 效率       | 低                                                                                                                                           | 高                                                                                        |
| 可靠性     | - 面向连接, 三次握手四次挥手<br>- 流量: 滑动窗口<br>- 拥塞: 慢开始, 拥塞避免, 快重传, 快回复<br>- 重发机制: 不丢包<br>- 顺序控制<br>- 无差错 | ❌<br>可以检查信息有无corrupt                                                              |
| 双共性     | 全双工                                                                                                                                       | 1-1, 1-多, 多-1, 多-多                                                                    |
| 应用层协议 | SMTP 电子邮件, HTTP, SSH (效率要求低, 准确性高)                                                                                              | DNS 域名转换, TFTP 文件传输, SNMP 网络管理, NFS 远程文件服务器 (效率要求高, 准确性低)     |

- TCP is Full Duplex (全双工通信: 双向传输数据)
	- Half-close connection: One side initiates closure & another side acknowledges the FIN with an ACK segment. Sender can receive data but send data
	- When both side in half-close, TCP connection is terminated. 
	- 任何一方都可以在数据传送结束后发出连接释放的通知, 待对方确认后进入半关闭状态. 当另一方也没有数据再发送的时候, 则发出连接释放通知, 对方确认后就完全关闭了 TCP 连接
### TCP
1. **Checksum 校验和**: 
	- error detection mechanism to determine the integrity of the data transmitted over a network
	- 检测报文段在传输过程中的变化。如果接收方检测到校验和错误，就会丢弃这个报文段
2. **Sequence number 序列号/确认机制**
	- a counter used to keep track of every byte sent outward by a host. If a TCP packet contains X bytes of data, then the sequence number will be increased by X after the packet is transmitted.
	- TCP 将数据分成段, 每段数据都有唯一的序列号, 以确保数据包的顺序传输和完整性. 发送方如果没有收到接收方的确认应答, 会重传数据
3. **Flow control 流量控制 & sliding window**:
	- receiver can handle the transmitted data from sender comfortably, prevent traffic congestion &  buffer overwhelming
	- 避免发送方发送过快, 压垮接收方缓冲区: 接收方发送窗口大小, 发送方根据大小调整发送速度
4. **Retransmission 超时重传**:
	- retransmitted the segment when it is handed down to an IP and there's no acknowledgment for the data before TCP's automatic timer expires
	- 如果发送方发送的数据包超过了最大生存时间, 接收方还没有收到, 发送方会重传数据包以保证丢失数据重新传输
5. **Congestion control 拥塞控制 Slow Start**: 
	- 防止全网因发送速率过高而导致路由器队列溢出和大量丢包
	1. 慢启动: `cwnd = 1` (指数增长, 直到超出threshold)
	2. 拥塞避免 (Congestion Avoidance)
		- 线性增长
	3. 快速重传 (Fast Retransmit)
		- 发送端收到 **3 个重复 ACK** (某段丢失), 立即重传, 无需等 RTO
	4. 快速恢复 (Fast Recovery)
6. 保证连接的可靠性: 三次握手 & 四次挥手
#### 缺陷 & 改进
1. 连接开销大
    - 三次握手 & 四次挥手 增加 RTT
    - **改进**: QUIC/HTTP3 将握手和加密合并
2. 拥塞控制过于保守
    - 慢启动 & 线性拥塞避免导致网络下无法快速填满
    - 快重传 & 快恢复 后 `cwnd` 大幅减少. 吞吐骤降
    - **改进**: 算法升级
3. 头部阻塞 Head-Of-Line Blocking
    - 接收端保证按序交付, 网络乱序 / 重传被缓存, 直到缺失数据到达才能交付
4. 无线/高丢包场景不友好
    - 丢包当拥塞: 收缩cwnd, 性能一直偏低
5. 单路径传输
    - 一条连接只能走一条路径, 无法利用多链路/多接口带宽, 也无动态切换能力
    - **改进**: 多路径并行 (HTTP/2 + QUIC)
#### 粘包
**接收方无法区分这些数据的边界**: 连续发送多个数据包, 接收时收到多个数据包的数据, “粘”在了一起
- 因为面向字节流没有边界的概念, 只保证顺序一致, 不丢失, 不重复, **不保证一次发的就是一次收的**
- 应用层定义消息边界
#### 3-way handshake 三次握手
>intuition: establish reliable communication, ensure both sides' capable to send & receive 建立可靠的通信信道, 双方确认自己与对方的发送与接收是正常的
1. C -> S: `SYN (Seq=x)`,  **SYN_SEND** 
	- pkg loss 超时重传机制: retransmits after Retransmission Timeout
2. S -> C: `SYN+ACK(SEQ=y,ACK=x+1)`,  **SYN_RECV** 
	- pkg loss: stuck in accept(), await for ACK pkg from client
3. C -> S `ACK(ACK=y+1)`, both in **ESTABLISHED** 
	- Retransmission Timeout in server
	- Capable to carry data

>SYN (Synchronize Sequence Numbers)
- A control bit in the TCP header to initiate a TCP connection 同步序列编号: TCP 协议中用来建立连接的一个标志位
- Ensure both sides of the connection are synchronized and ready to exchange data reliably. 确保序列号的同步, 使得后续的数据能够有序传输
- Avoid old pkg as new connection 防止旧的报文段被误认为是新连接

>三次挥手原因
1. **Server can receive, Client can send**, **Server 确认对方发送正常, 自己接收正常**
2. **Client can send & receive, Server can send**, **Client 确认自己 & 对方发送, 接收正常**
3. **Server & client can send & receive**, **Server 确认自己 & 对方发送, 接收正常**
#### 4-way handshake 四次挥手

TCP is Full Duplex (全双工通信: 双向传输数据): Both side requests connection termination
- Both sides can send data until handshake complete **客户端 & 服务端可以继续传输数据直到四次挥手结束**

1. C -> S: `FIN (Seq=x)`, done sending data, wants to close the connection. **FIN-WAIT-1** 
2. S -> C: `ACK (ACK=x+1)`, confirm received message
	- Sever **CLOSE-WAIT** , Client  **FIN-WAIT-2** 
	- `CLOSE-WAIT`
		- can not terminate connection if some data still in transmission. 此时服务端可能还有一些数据没有传输完成, 不能立即关闭连接
		- To ensure all data are processed before server side termination 保证服务端在关闭连接之前将待发送的数据处理完
3. S -> C: `FIN (SEQ=y)`, done sending data, wants to close the connection, **LAST-ACK** 
4. C -> S: `ACK (ACK=y+1)`, **TIME-WAIT**
	- Server receive, **CLOSE**
	- if Client waited over  **2MSL** without response, Server closed, then Client terminate connection
	- `TIME-WAIT`
		- In this status, client can retransmit ACK to ensure termination 客户端可以重新发送 ACK 确保对方正常关闭连接
		- Wait 2MSL to ensure old pkg are gone to avoid interfering future connections 确保旧数据包完全消失, 避免它们干扰未来建立的新连接

>四次挥手原因
1. Client FIN: Client is ready to close, please confirm
2. Server ACK: Sever confirms, will initiate close soon
3. Server FIN: Server is ready to close, please confirm
4. Client ACK: Client confirms, TIME_WAIT State to ensure client closes after server closes

#### Why 2MSL before CLOSED? 为什么需要等待 2MSL, 才进入 CLOSED?

1. Ensure Server will receive the last ACK pkg & both in CLOSED status **保证客户端发送的最后一个 ACK 报文段能够到达服务端, 确保都进入CLOSED状态.** 
	- handle pkg loss: Server will retransmit the FIN, Client need to retransmit the FIN + ACK
2. Avoid invalid pkg in future connection **防止已失效的连接请求报文段出现在本连接中**
	- 2MSL ensures all pkg are expired 下一个连接中不会出现这种旧的连接请求报文段。
3. MSL: Maximum Segment Lifetime
	- 报⽂最⼤⽣存时间, 任何报⽂在⽹络上存在的最⻓时间, 超过这个时间报⽂将被丢弃
	- 2MSL a round trip between both sides, 恰好一个来回
### UDP
- **No guaranteed delivery 不保证消息交付**: 
	- not confirm if packet received, no acknowledgments 不确认
	- no retransmissions 不重传
	- no timeout mechanisms at the protocol level. 无超时
- **No guaranteed order 不保证交付顺序**: 
	- No sequence numbers. 不设置包序号
	- No built-in reordering. 不重排
	- no head-of-line blocking 不会发生队首阻塞 (无序保证不存在第一辆汽车爆胎造成延迟)
- **No connection state 不跟踪连接状态**:  
	- Connectionless. No session states 不必建立连接或重启状态机
- **No congestion control 不进行拥塞控制**:  
    - No feedback mechanisms to detect or respond to network congestion. 不内置客户端或网络反馈机制
>保证消息的不丢失: 通过应用层的重传机制 (Sequence numbers, retransmission after timeout)
## HTTP & HTTPS & Web Socket

### HTTP
HTTP: plain text w/o encryption over TCP, 性能慢, Port 80

| HTTP | Feature                                                                                                                                                                                                                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0  |                                                                                                                                                                                                                                                                                                    |
|      | **Stateless protocol 无状态协议**                                                                                                                                                                                                                                                                  |
|      | **plain text, no authentication 明文传输, 无法验证身份**                                                                                                                                                                                                                                           |
|      | **Non-persistent connection (Short connection) 非持久连接 (短连接)**<br>	- **单工**: 1 TCP for 1 HTTP Connect. 每个HTTP请求需要新的 TCP 连接. <br>	- `Connection: keep-alive` enable long connection 强制开启长连接<br>		- 复用同一条 TCP 传多次请求-响应，减少握手次数                            |
| 1.1  |                                                                                                                                                                                                                                                                                                    |
|      | **Persistent connections 持久连接**:  (默认 `keep-alive`)<br>	- TCP connections stay open for multiple requests/responses 复用同一条 TCP 传多次请求-响应                                                                                                                                           |
|      | **Pipelining 流水线处理**: <br>	- Multiple requests sent without waiting for previous responses.<br>	- 支持客户端在前一个请求的响应到达之前发送下一个请求, 以提高传输效率<br>	- **队头阻塞**: 多条请求的响应必须按请求顺序                                                                         |
| 2.0  |                                                                                                                                                                                                                                                                                                    |
|      | **Binary protocol 二进制协议**:  <br>	- No plain-text More efficient parsing 代替文本格式来传输数据, 解析更加高效<br>	- 拆成二进制帧 (Frame)                                                                                                                                                       |
|      | **Multiplexing 多路复用**:  (单线程逻辑, 避免HTTP1.1队头阻塞)<br>    - 连接 => 数据流 => 帧 (带序号, 支持乱序) => 消息<br>	- 多个请求同时复用一个 TCP 连接, 每个流独立, 丢包会阻塞当前流<br>	- 每个流可指定权重, 且有窗口大小做流量控制<br>	- 无法避免TCP队头阻塞: 因为多个HTTP请求共用一个TCP连接 |
|      | **Header compression 头部压缩**:<br>    - HPACK 动态字典压缩 (基于静态表+动态表), 对重复头部可压缩至原体积的 20%-30% (e.g. Cookie), 但对唯一头部压缩率较低                                                                                                                                         |
|      | **Server push 服务端推送**:  <br>    - 需Client通过 `Accept-Push-Policy`<br>    - 少用: <br>		- 命中率低: 再次推送已缓存资源<br>	- 替代: 预加载指令                                                                                                                                                |
| 3    |                                                                                                                                                                                                                                                                                                    |
|      | QUIC (Quick UDP Internet Connection) = UDP + TLS 1.3 + 多路复用 + 流量/拥塞控制<br>- HTTP 3 只是把 HTTP 语义映射到 QUIC 流                                                                                                                                                                         |
|      | - **Multiplexing 多路复用**<br>	- 没有头部阻塞: 每个 Stream 独立重传, 每条流独立排序, 丢包仅影响该流, 别的流继续跑                                                                                                                                                                                 |
|      | - **连接标识**: 链路迁移无需重连 (QUIC 用 Connection ID识别连接, IP更新不需要重新握手)                                                                                                                                                                                                             |
|      | - **加密**: 首部 + 流控 + ACK 都加密，带来更难的中间盒干预<br>	- TLS 1.3 与握手合并, 首包即可加密, 减少 RTT                                                                                                                                                                                        |
#### Structure 结构
- Request 请求
	- **Request Line:** method (GET, POST, PUT, DELETE), URL, HTTP version
	- **Header:** Metadata about Client, Request, Server
		- User-Agent (浏览器信息), Accept (接受的内容类型), Content-Type (请求主体的数据类型)...
	- **Body:** Data from Client
		- POST请求的表单数据...
- Respond 响应
	- **Respond Line:** Http version, status code & message
	- **Header:** metadata about server and returned data
		- Content-Type (响应主体的数据类型), Content-Length (响应主体的大小)...
	- **Body:** actual data returned
		- HTML, image, JSON...
### HTTPS
Secured HTTP: HTTP + SSL/TLS, Port 443
- Multi-layer protection via **SSL/TLS protocol** 通过 SSL/TLS 协议的多层次安全机制
- Ensures identity verification and data encryption 验证服务器身份, 加密通信
	- Encrypts the entire HTTP payload (including URL path, not the domain) 加密HTTP所有数据 (包括URL, 但是握手过程会暴露Domain)
#### HTTPS Connection:  (SSL / TLS handshake)
- Handshake 握手阶段: Only the **server's private key** can decrypt the session key, 非对称加密生成的会话密钥只有服务器的私钥才能解密
	- session key: 共享密钥
	- private key 私钥: 加密后只能用公钥验证
		- 保留在server中, 用于上锁 / 解锁
	- public key 公钥: 加密后只能用私钥解
		1. Certificate signing request to CA  
		2. CA签署后, 返回server, 之后发给client
- 握手阶段: Asymmetric Encryption: 身份认证 & 密钥协商
	1. **Server sends public key** via certificate 服务器向客户端发送公钥
	2. Client: validates server certificate via CA 客户端: 验证合法性
	3. **Client encrypts session key** using server’s public key 客户端用公钥加密自己的session密钥
	4. **Server decrypts** using its private key to obtain session key 服务器用私钥解密, 得到会话密钥
- 传输阶段: Symmetric Encryption: 
	- used after key exchange: faster for data transmission 对称加密提升效率
	- **Server encrypts** data by session key
	- **Client decrypts** data by session key
#### 校验证书
1. Read certificate metadata: owner, issuer, expiration 会读取证书的所有者, 有效期, 颁发者等信息
2. Check if the domain in the certificate matches the website 校验网站域名是否一致
3. Check certificate validity (e.g., expired or revoked) 校验证书的有效期是否过期
4. Compare the certificate issuer to trusted CA 开始查找内置的 CA, 与服务器返回证书中的颁发者进行对比, 确认是否为合法机构
5. Use the CA's public key to decrypt the certificate’s signature to get hash H2 使用 CA 公钥解密 Certificate 的 Signature 内容, 得到⼀个 Hash 值 H2
6. Generate hash of the certificate content locally to get hash H1 使⽤同样的 Hash 算法获取证书的 Hash 值 H1
7. H1 == H2:
    - If identical → certificate is trusted
    - If different → show a security warning

> If a man-in-the-middle **modifies the certificate**, they cannot generate a valid signature without the CA’s private key, so the browser will **reject it**. if 中间人篡改了证书, 但由于他没有 CA 机构的私钥, 所以无法生成正确的 Signature, 因此就无法通过校验
### Terminologies
#### Cache 缓存
缓存层: 浏览器 / 代理
1. **强缓存 (freshness caching)** 
	- 直接用本地副本, 不请求服务器 (看本地冰箱够不够新鲜)
	- `Expires / Cache-Control`
2. **协商缓存 (validation caching)** 
	- 带条件字段去问服务器, 若未变返回 304, 省体积但仍 1 RTT (打电话问超市要不要换)
	- `ETag / Last-Modified`
	- 幂等的动态接口可以缓存
#### 长 vs 短链接
- non-persistent / Short-Lived 短连接: **一次请求一次 TCP** (一次性纸杯)
	- HTTP/1.0
- persistent / Long-Lived 长连接: **TCP 多次请求复用** (保温杯, 可续水)
	- `Connection: keep-alive`
	- HTTP/1.1, HTTP/2, QUIC
#### POST & PUT

|                           | POST                                                   | PUT                              |
| ------------------------- | ------------------------------------------------------ | -------------------------------- |
| 用途                      | 创建资源, 提交数据给服务器处理<br>- 导致服务器状态变化 | 更新资源, 若不存在则创建         |
| 幂等 (多次执行结果一致性) | ❌ 不安全                                               | ✅ 安全                           |
| Body                      | 支持非完整数据, 由服务器处理                           | 必须完整数据, 适用于更新完整资源 |
| URL 传送参数长度限制      | ✅ (浏览器 / 服务器限制)                                | ❌                                |
| Browser cacheable         | ❌ 可以调节                                             | ❌                                |
| 请求参数                  | Request Body                                           | Request Body                     |

#### HTTP Status code
- 1xx - 临时响应: 请求已被接收, 需要继续处理
	- `POST: 100 Continue` 客户端继续发送数据
- 2xx - 请求已被服务器接收, 理解, 接受 
	- `GET: 200 OK`
	- `POST: 201 Created, 200 OK`
	- `PUT, DELETE: 200 OK, 204 No Content`
- 3xx - 重定向: 3xx + Location head (URL)
- 4xx - 客户端错误, 妨碍服务器处理
	- `400 Bad Request`：请求格式错误
	- `401 Unauthorized`：需要身份认证
	- `403 Forbidden`：禁止访问
	- `404 Not Found`：资源不存在
	- `405 Method Not Allowed`：请求方法不被允许
- 5xx - 服务器无法完成请求, 服务器错误 / 异常
	- `500 Internal Server Error`
	- `502 Bad Gateway`
	- `503 Service Unavailable`
	- `504 Gateway Timeout`
### Web Socket

编程接口: 网络传输协议, 位于应用层

- 出现之前用的是HTTP轮询
	- 每隔一段发出HTTP 请求询问, 了解服务器有没有新的信息 (聊天室)

|          | WebSocket                                   | HTTP                                                                           |
| -------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| 通信协议 | 双向实时通信协议                            | 单向通信协议, 只能由客户端发起, 服务器无法主动通知客户端, 不具备服务器推送能力 |
| TCP      | ✅ 单个 TCP 连接 (一次握手) 上进行全双工通信 | ✅                                                                              |
| 数据量   | 开销小, Header 小                           | 开销大, Header 完整                                                            |
| 前缀     | 明文`ws`, 密文`wss`                         | `http://` or `https://`                                                        |
| body     | 文本 / 二进制                               | 看版本                                                                         |

## IP Internet Protocol (Network layer)
a protocol, or set of rules, for routing and addressing packets of data so that they can travel across networks and arrive at the correct destination 数据包的格式和处理规则, 确保数据能够计算机网络之间从一个设备传输到另一个设备

1. **Addressing 寻址**
	- Unique IP address which used to identify packet's src & dest & ensure accurate delivery.
	- 唯一, 标识数据包的源地址和目的地址, 确保准确地传输到目标设备
2. **Routing 路由**
	- Determines the path through the network to reach the destination.
	- IP 协议负责决定数据包在网络传输中的路径. 
3. **Fragmentation & Reassembly 分片和重组**
	- If too large to be transmitted, fragment into smaller pieces & receiving end will reassemble them according to headers
	- 数据包过大时, 将数据包分成更小的片段进行传输. 接收端会根据头部信息将这些片段重新组装成完整的数据包

- Example: Device X, Y communicate
	1. X send Data 设备 X 发送数据包:
		- X creates an IP packet with source IP_X and destination IP_Y and data
		- Send to local router after encapsulated 数据包封装后, 通过本地网络发送到路由器
	2. Router send pkt 路由器转发数据包:
		- Router checks routing table to find the next hop for IP_Y. 路由器根据路由表查找目的地址 IP_Y, 确定数据包的传输路径
		    - The packet is forwarded hop-by-hop toward the destination. 每个路由器都根据路由表选择下一跳, 最终到达目标设备的网络
	3. Y Receives 设备 Y 接收数据包:
		- Reads the IP header, checks integrity, and hands the payload to the upper layer (e.g. TCP/UDP).
		- 读取 IP 头部信息, 验证数据包的完整性, 取出数据部分, 交给上层协议处理 (如 TCP 或 UDP)
### 位前缀分类 (Classful) & 用途
目的: 实现安全隔离, 区分职责, 自动配置, 测试排障

| 分类         | 私有地址       | 额外用途                                                            |
| ------------ | -------------- | ------------------------------------------------------------------- |
| A/B/C        |                | **Unicast 单播**: 一对一通信                                        |
| A (大型网络) | 10.0.0.0/8     | **Loopback 环回地址**: 主机内部完成网络协议栈, 不经过物理网卡       |
| B (中型网络) | 172.16.0.0/12  | **Link-Local 链路本地**: 自动分配IP地址, 同链路临时通信             |
| C (小型网络) | 192.168.0.0/16 | **Directed Broadcast 定向广播**: 子网内最高地址广播给同网段所有主机 |
| D            |                | **Multicast 组播**: **一对多**, 视频直播, 组播协议                  |
| E            |                | **Reserved 实验 / 特殊用途**                                        |

网络协议栈: 
- OSI / TCP-IP 在操作系统里的“落地实现” (HTTP, TLS, TCP, IP, Ethernet, 电缆)
### IP vs Domain 
- IP (identifies)
	- 地址, unique, 连入网络后动态分配 (需要 MAC 地址来区分不同的设备)
	- 网络层和以上各层使用的地址, 是一种逻辑地址. IP 地址用来区别网络上的计算机
	- 在一个子网中的设备, 分配的 IP 地址前缀都是一样的, 路由器就能根据 IP 地址的前缀知道这个设备属于哪个子网, 剩下的寻址就交给子网内部实现, 从而大大减少了路由器所需要的内存
- Domain (nickname)
	- 收件人, unique, 不可变更
	- 数据链路层和物理层使用的地址, 写在网卡上的物理地址, 用来定义网络设备的位置
	- 更长, 需要更多内存存储
- One domain → multiple IPs: Load Balancing (负载均衡)
- One domain → One IP: virtual hosting (用户访问)
- One IP → Multiple domains (虚拟主机或共享服务器场景)
### ICMP (Internet Control Message Protocol) 协议的功能
- A **connectionless** protocol for delivering control messages and error reports. 面向**无连接**的协议, 用于传输出错报告控制信息 
- diagnose network issues. 主机与路由器之间传递控制信息 
	- reporting unreachable destinations, timeouts, and other diagnostics. 报告错误, 交换受限控制和状态信息
- `ping`, `traceroute`, router notifications.
	- 自动发送 ICMP 消息: 当遇到 IP 数据无法访问目标, IP 路由器无法按当前的传输速率转发数据包等情况时 (`PING`)
#### `ping` (Packet Internet Groper) 的原理
Based on ICMP, Test network reachability and latency 测试网络连接的质量 (可达性, 延迟)
- 发送多个请求, 提供平均响应时间和丢包率等信息

1. 应用层调用
    - 执行ping 目标地址, 产生原始套接字 Raw Socket
2. 构造 ICMP 报文
3. IP 封装与路由
    - 操作系统将 ICMP 报文封装到 IP 数据报
    - 查路由表决定下一跳
        - 如果同网段 → 物理网卡
        - 如果其它网段 → 默认网关
4. ARP 解析
    - 如果 IP 在本地网段: ARP 获得目标 MAC
    - else: 发给网关 MAC
5. 物理层传输: 层层转发到达目标主机
6. 目标主机
    - 收到 IP 数据报, 内核回复 Echo Reply
7. 收到回复
    - Ping 根据序列号, 时间戳计算 RTT, 统计信息
### `ARP` vs `RARP`

|          | ARP (Address Resolution Protocol)                                                                                                                                                                                                | RARP (Reverse ARP)                                                                                                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 功能     | 通过 IP 查找 MAC                                                                                                                                                                                                                 | 通过 MAC 查找 IP                                                                                                                                                                                                                                                                   |
| 工作流程 | 1. **广播 ARP 请求**: 主机 A 发送一条以太网广播帧：`Who has y.y.y.y? Tell x.x.x.x`<br>2. **ARP 响应**: 拥有 IP=`y.y.y.y` 的主机发出单播应答：`y.y.y.y is at 00:11:22:33:44:55`<br>3. **缓存**在 ARP Cache (有超时机制), 后续复用 | 1. **广播 RARP 请求**: 无盘工作站在启动时发出广播：`Who has MAC 00:11:22:33:44:55? Tell me your IP`<br>2. **RARP 响应**: 查询本地映射表, 应答`MAC 00:11:22:33:44:55 => IP 192.168.1.20`<br>3. **使用 IP 启动系统**: 工作站拿到 IP 后, 继续进行 BOOTP/DHCP 获取子网掩码, 网关等信息 |
| 常见应用 | 局域网内 IP 数据包转发前的“门牌号”查询                                                                                                                                                                                           | 静态映射, 不支持动态配置. <br>- 被 DHCP 取代 (完整网络配置, 动态管理)                                                                                                                                                                                                              |

| 协议      | 特点                                                     | 局限                       |
| --------- | -------------------------------------------------------- | -------------------------- |
| **RARP**  | 基于 MAC 查 IP                                           | 不能跨网段, 无网关/DNS     |
| **BOOTP** | UDP, 可跨网段, 更多参数 (子网掩码, 默认网关, DNS 服务器) | 配置静态, 扩展性有限       |
| **DHCP**  | 动态分配, 支持租约, 丰富网络参数, 集中管理               | 需要 DHCP Server, 实现复杂 |

### NAT
将内网私有 IP & port 映射为公网 IP & Port
- 实现私有网络访问互联网, 节约 IPv4 地址, 隐藏内网结构, 端口转发
- 网络层(L3), 端口映射在传输层 (L4)

1. **地址复用**：让大量私有 IP 主机共用一个或少量公网 IP
2. **地址/端口转换**：将私有 IP:端口替换为公网 IP:端口，并记录映射关系
3. **安全隔离**：隐藏内网结构，外部无法直接访问私有地址（除非预先做端口映射）
4. **灵活管理**：可配置静态或动态映射、端口转发等策略
#### 类型与映射方式
##### 静态 NAT
- 一对一: 内网 & 外网 IP 永久对应
- 固定公网访问的服务器
##### Dynamic 动态 NAT
- 动态一对一: 公网 IP 池中临时分配一个地址
- 用完即还, 供其他主机复用
##### 端口地址转换 PAT/NAPT
- 多对一映射: 内网多个 IP:端口 → 同一公网 IP, 不同端口
- 家庭/企业网关

### 内网和外网通信
1. DNS: 域名 `example.com` => IP
	- 找“电话号码”
2. 找到 & 发向默认网关
	- 拨线到总机
	- **ARP**: 找网关 MAC
3. **NAT** 地址转换, 隐藏内部结构
	- 找到公网上的“化名”, 改写IP/端口
	- 转换Source IP & Port
4. 转给 Internet 路由
5. 找到外网主机 `example.com`
6. NAT 回译响应
	- 总机找回Client
	- 转换回Source IP & Port
7. 到原内网主机

## DNS Domain Names System

翻译官: Domain -> IP address

- `三级域名.二级域名.顶级域名`: `www.xxx.com`
- Recursive query 递归查询: A 问 B, B 一定要给 A 想要的答案
	- 公共DNS, ISP DNS
- Iterative query 迭代查询: 如果 B 没有答案, B 告诉 A 如何获得
	- Root, TLD, Authoritative DNS
- 域名缓存
	- 浏览器缓存: 浏览器对获取的 IP 进行缓存
	- OS 缓存: `host` 文件

### 访问步骤
寻找`www.baidu.com`的 IP 地址

1. local check: 搜索本地 DNS 缓存 (browser & OS DNS cache)
2. 若没有命中, OS asks **local DNS server** (Recursive query)
   - 若没有命中, (iterative query: Root -> TLD -> Authoritative DNS)
     1. Local -> Root: get TLD address (`.com`域名由`xxx`管理, 你去问问它)
     2. Local -> TLD: get Authoritative DNS server address(负责`baidu.com`的是`yyy`, 你去问它)
     3. Local -> Authoritative: 找到有`baidu.com`权限域名服务器, 得到 IP 地址
3. cache IP at all levels (DNS, OS, browser)
4. Browser uses IP to connect to server

### UDP or TCP
DNS uses both UDP and TCP, DNS 使用 TCP & UDP
- TCP: **Zone transfers** between primary and secondary DNS servers 区域传送 (主域名服务器向辅助域名服务器传送变化的那部分数据)
	- zone data can be large, and TCP ensures reliable, ordered delivery.
	- 数据同步传送的数据量多, TCP 允许的报文长度更长 & 保证数据的正确性
- UDP: **Standard DNS queries** from clients 客户端想 DNS 服务器查询域名 (域名解析)
    - Most query responses are small (≤ 512 bytes), which fits within a single UDP packet.
    - UDP is faster due to no overhead in connection establishment, DNS resolvers and servers must implement retry and timeout mechanisms for reliability.
	- 返回的内容不会超过 UDP 报文的最大长度
	- UDP 传输提高了响应速度, 要求域名解析服务器和域名服务器都必须自己处理超时和重传从而保证可靠性

## CDN Content Delivery Network

根据用户位置分配最近的资源, 上网访问的是最近的 CDN 节点 (边缘节点), 缓存了源站内容的代理服务器

- w/o CDN:
	- 提交 domain -> 浏览器解释 domain -> DNS 解析得到 target 主机 IP 地址 -> 根据 IP 地址访问发出请求 -> 收到数据并回复
- w/ CDN:
	- DNS 返回 CNAME, CDN 通过 CNAME 找到边缘服务器 (as a proxy)
- **CNAME**: Canonical Name, 向 CDN 的全局负载均衡
	- 在域名解析中作为代理, 导向 CDN 的调度域名: **CNAME 本身不返回 IP**, 告诉 DNS “请去解析另一个域名”

### 负载均衡系统

- 由于没有返回 IP 地址, 本地 DNS 向负载均衡系统再次发送请求, 进入到 CDN 的全局负载均衡系统进行智能调度

1. Browser -> Local DNS server for domain (`www.xxx.com`)
2. Local DNS -> Authoritative DNS for CNAME (`cdn.xxx.net`)
3. Local DNS -> CDN's DNS for actual IP (optimal edge server IP) using CNAME
   - Intelligent scheduling: 健康状况, 服务能力, 响应时间...
4. Browser -> CDN edge server IP by HTTP request for content delivery

### 核心原理
1. **部署边缘节点**
2. **请求路由与接入**
    - 用户发起域名解析 / 连接任意 IP: 通过重定引导流量到最优的边缘节点
3. **缓存拉取 & 更新**
    - **Pull 模式**: 边缘节点向源站首次请求拉取并缓存
    - **Push 模式**: 源站推送新内容到边缘节点
4. **缓存命中与回源**
    - 边缘节点直接响应
    - 未命中: 回源至中心或源站获取内容, 更新本地缓存后返回

### 请求调度技术
1. **DNS 调度**: 基于地理位置 / 运营商, 返回最优边缘节点 IP
2. **Anycast 路由**: 缘节点对外使用相同 Anycast IP, 引导用户流量到网络拓扑最短/延迟最低的节点
3. **HTTP 重定向**: 源站收到请求后下发重定向, 指向指定的边缘节点域名 / IP

### 缓存管理与策略
- **Cache-Control / Expires**: 指定缓存 TTL
- **主动失效 Purge vs 被动过期**
    - Purge: 手动清除热点更新内容
    - 被动过期: 过期后自动回源更新
- **多级缓存架构**: 边缘 → 区域 → 源站
- **缓存键 Cache Key**: 决定唯一缓存对象
    - 组成: URL, Host, Query, Cookie...

### 优点
1. **静态资源加速**: 图片/视频/JS/CSS 等, 由边缘节点缓存并就近分发
2. **动态内容加速**: 连接保持 Keep-Alive, TCP 优化, 智能调度, 协议加速 (QUIC/WebSocket)
3. **SSL/TLS 卸载**: 边缘节点终端 TLS 握手, 减轻源站证书和加密压力
4. **安全防护**
5. **日志与监控**

### 缓存代理
- 缓存系统
  - Parent cache layer 一级节点: 直连源站, 缓存配置高
  - Edge cache layer 二级节点: 直连用户, 缓存配置低
- Cache hit ratio 命中率: 命中缓存的概率
- Origin fetch rate 回源率: 用代理的方式回源站取的概率
  - if 二级缓存, else if 一级缓存, else 回源站

## Cookie & Session & Token

> 跟踪浏览器用户身份的会话方式, 但是应用场景不同. 解决 http 无状态的缺点

### **`Session`**
- 服务器和客户端一次会话的过程. 保存在服务器上. 
	- 服务器记录客户端信息, 客户端浏览器再次访问时只需要从该 session 中查找用户的状态
- 保存在**服务端**, 记录用户的状态, 相对更高安全性
- 购物车场景: 添加商品到购物车, 系统不知道哪个用户操作的, 服务端给特定的用户创建特定的  `Session`  之后就可以标识这个用户并且跟踪这个用户

### **`Cookie`**

- 保存在客户端浏览器中的一小块文本串的数据. 
	- 客户端向服务器发起请求时, 客户端保存来自服务端的 Cookie, 在客户端下次向同一服务器再发起请求时, Cookie 被携带发送到服务器. 服务端可以根据这个 Cookie 判断用户的身份和状态
- 保存在**客户端(浏览器端)**
- 最好前端加密  `Cookie`  信息, 服务器解密
  - 保存已经登录过的用户信息, 下次访问自动填充信息
  - 保存用户首选项, 设置
  - 保存  `SessionId` / `Token`, 携带`Cookie`向后端发送请求, 后端记录用户当前的状态
  - 记录和分析用户行为: 获取在某个页面的停留状态

### **`Token`**

- 使用 JWT等机制在客户端存储状态信息, 客户端在每次请求中发送该 Token
- 难立即吊销: 需黑名单或短 TTL + Refresh Token

## 认证 (Authentication) & 授权 (Authorization)

**认证 (Authentication):**

- 你是谁, 为身份/用户验证
- 验证身份的凭据 (用户名/用户 ID 和密码), 系统通过凭据知道你这个用户.
- 验证过后, 服务器生成cookie / JWT

**授权 (Authorization):**

- 你有权限干什么
- 发生在  **Authentication (认证)**  之后
- `Role-based, Claims-based, Policy-based` in Dot Net

