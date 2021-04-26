## 破解

Unipatcher 选择unity\Editor 文件夹

> 如果提示Unity patching failed. Already patched or unpatchable!!!
> 将editor文件夹下的unity.exe.bak恢复，重新破解

## 名词

GameObject： 一个游戏对象 例如Cube、Image 等
Transform： 游戏对象的一个组件，包含名称位置等信息
RectTransform： Transform 的子类（2D）

## Camera

Camera.main // 主相机Object
Camera.main.fieldOfView // 视野？，更改大小可实现缩放效果（貌似默认60）

## GameObject

```c#
// 显示/隐藏
gameObject.SetAction(true/false)
```

### 空物体归类

创建空的GameObject，将组件拖入其中

> 将GameObject的Transform组件删除，其下面GameObject的父相当于上层GameObject

# Transform

### 获取宽高

RectTransform rect = transform.GetComponent<RectTransform>();
Debug.Log(rect.rect.width);
Debug.Log(rect.rect.height);

### 中心点

蓝色圆圈表示Transform的中心点，GameObject的position为该点位置
RectTransform.Pivot
左下角：(0, 0)
右上角：(1, 1)

### 花瓣

表示Transform随父位置大小进行变化
花瓣聚拢
只是位置跟随变化
花瓣拉开
随父按比例伸缩（位置大小都变化）

## Button

添加button组件
Add Component - 输入button

### 添加点击事件

#### 代码添加

GetComponent<Button>.onclick.AddListener(ChangeColor);
GetComponent<Button>.onclick.AddListener(()=>ChangeColor("ssss"))

#### 面板上添加

创建C#脚本，创建时间方法（public void Quit(){}）
将脚本拖入GameObject
在button On Click 中点+，将拖入的脚本拖到第三个参数，下拉选择脚本 - 方法

#### 点击被拦截

上层组件如果添加button组件，点击会被拦截

#### 按下效果

##### 图片切换

Transition 选择Sprite Swap
Pressed Sprite 按下后的图片
Disabled Sprite 禁用后的图片

##### 颜色覆盖

Transition 选择Color Tint

Image
Image Type
Filled 技能冷却效果

## 帧动画

添加组件Raw Image
UV Rect
X/Y 图片向左/向上移动的比例
W/H 图片横/纵向显示的比例

例如 4*2的帧动画素材
X = 0，Y = 0
W = 0.25，H = 0.5
步进 X = 0.25，Y = 0.5

## 富文本

Text组件勾选rich text
Test <b>Test</b> Test <i>Test</i> Test <size=50>Test</size> Test <color=#FF4081>Test</color> Test Test Test Test Test Test Test 

## 组件面板上的属性

### 组件

在脚本中添加
public Transform/Buttom/Image/Text/脚本 component;
在面板中拖入GameObject即可

#### 变量

在脚本中添加
public string/bool/int test;
可以在面板中填写（添加数组时，先点击属性窗口右上角的锁，然后拖入）

### 自定义Class

```c#
// 序列化，添加注解自定义Class才会显示在面板
[System.Serializable]
public class PositionTag
{
    public string text;
    public Vector3 position;
    // 不序列化，添加注解后此属性不会显示在面板
    [System.NonSerialized]
    public Transform transform;

    public Vector3 tagPosition()
    {
    	return position + new Vector3(10, 15, 0);
    }
}
```



### 注解

[header("属性的描述")] // 面板上显示描述

[Range(0, 45)] //面板上将显示为滑块

## 动态GameObject

```c#
// 动态添加GameObject
GameObject obj = new GameObject("GameObject");
// 动态添加组件
lineRenderer = obj.AddComponent<LineRenderer>();
// 查找GameObject
GameObject.Find("Canvas/Panel").gameObject.transform
```

### 预置体Prefabs

在Assets下创建Resources/Prefabs/，将GameObject拖到该文件夹作为预置体

#### 代码动态添加预置体

```c#
GameObject itemPrefab = Resources.Load<GameObject>("Prefabs/PositionTagPanel");
// 上行并未完成实例，需要调用GameObject.Instantiate进行实例化
itemPrefab = GameObject.Instantiate(itemPrefab);
// 设置父
itemPrefab.transform.SetParent(transform);
```

> 动态添加的预置体如果出现红叉，预置体的花瓣未设置对

## Mathf

Clamp 规定值的大小范围
Min
Max
Floor 向下取整
Ceil 向上取整
Round 四舍五入

## Debug

```c#
Debug.Log //在控制台打印

//两个坐标的连线
Debug.DrawLine(Vector3 arg1, Vector3 arg2, Color color)
//两个坐标的连线，seconds线条保持的时间
Debug.DrawLine(Vector3 arg1, Vector3 arg2, Color color, int seconds)
    
//绘制射线，dir 只作为方向，模为长度
Debug.DrawRay(Vector3 pos, Vector3 dir, Color color)
```

## 向量相关

> 向量与坐标的关系理解：
>
> 坐标相当于从零点到该坐标的向量，所以点也可以当做向量在处理

### 坐标系

right：X+
up：Y+
forward：Z+

### 坐标系（UI）

right：X+
up：Y+

### Vector3

https://docs.unity3d.com/2019.1/Documentation/ScriptReference/Vector3.html

### 零向量

Vector3.Zero

### 单位向量

模为1的向量
Vector.Right/Left/Up/Down/Forward/Back

### 1向量

(1.0, 1.0, 1.0)
Vector3.One$\lim_{i=0}$

### 加法

$$
AB=B-A
AB+BC=AC
$$

$$
\begin{align*}
y = y(x,t) &= A e^{i\theta} \\
&= A (\cos \theta + i \sin \theta) \\
&= A (\cos(kx - \omega t) + i \sin(kx - \omega t)) \\
&= A\cos(kx - \omega t) + i A\sin(kx - \omega t)  \\
&= A\cos \Big(\frac{2\pi}{\lambda}x - \frac{2\pi v}{\lambda} t \Big) + i A\sin \Big(\frac{2\pi}{\lambda}x - \frac{2\pi v}{\lambda} t \Big)  \\
&= A\cos \frac{2\pi}{\lambda} (x - v t) + i A\sin \frac{2\pi}{\lambda} (x - v t)
\end{align*}
$$

#### 例：已知平行四边形ABCD的ABD三点，求C

$$
C=D - (B - A)
$$

理解：
$$
AB = CD
\\C=D-CD=D-AB=D-(B-A)
$$
### 叉积

> 几何意义：两个向量构成的平面的法向量

> 不满足交换律

> 法向量方向判断：
> (叉积使用右手法则，unity使用左手坐标系，故unity叉积使用左手法则)
> 左手中指上抬，拇指、中指依次指向两向量，中指方向为法向量方向

#### 例：

```c#
Vector3.Cross(Vector3 arg1, Vector3 arg2)
Vector3 vg1 = new Vector3(1, 0, 0);
Vector3 vg2 = new Vector3(0, 0, 1);
Debug.Log(Vector3.Cross(vg1, vg2));
// (0.0, -1.0, 0.0)
Debug.Log(Vector3.Cross(vg2, vg1));
// (0.0, 1.0, 0.0)
```

### 点积/内积/数量级

> 几何意义：a乘以b在a方向上的投影

$$
a · b = |a||b|cosθ
\\a · b = x1x2 + y1y2
$$

> 两垂直向量点积为0（cos90° = 0）

> 满足交换律，结合律，分配率（与数字计算相同）

### 三角形重心

$$
P = ((x1 + x2 + x3) / 3, ...)
$$

### 两点距离

```c#
Vector2.Distance
```

### 向量夹角

```c#
Vector2.SignedAngle(from, to)
Vector2.SignedAngle(Vector3.right, dir) // 从Vector3.right 到 dir的夹角（逆时针）
Vector3.SignedAngle(from, to, axis)
```

### 直线的表示方式

两点(Debug.DrawLine)
一点+方向(Debug.DrawRay)

### 平面的表示方式

两向量
一点+平面法向量

### 点到直线的垂心

```c#
// 直线上一点，直线方向，点
private Vector3 GetVerticalPointOfPointAndLine(Vector3 linePoint, Vector3 direct, Vector3 point)
{
    float f = Vector3.Dot(point - linePoint, direct) / Vector3.Dot(direct, direct);
    return f * direct + linePoint;
}
```

*计算过程同直线与平面的交点*

### 直线与平面的交点

```c#
// 直线上一点，直线方向，平面法向量，平面上一点
public static Vector3 GetIntersectWithLineAndPlane(Vector3 point, Vector3 direct, Vector3 planeNormal, Vector3 planePoint)
{
	float d = Vector3.Dot(planePoint - point, planeNormal) / Vector3.Dot(direct, planeNormal);
	return d * direct + point;
}
```

#### 计算过程

直线上一点A, 方向t, 平面上一点P, 法向量n，设线面交点X
X在直线上				...1
$$
X = A + mt
$$
XP与法向量垂直		...2
$$
XP · n = 0
$$

$$
(P - X) · n = 0
\\(P - (A + mt)) · n = 0
\\m = ((P - A) · n) / t · n
\\代入1得X
$$

### MonoBehaviour.Start

开始时执行

### MonoBehaviour.Update

每帧执行

### Time.deltaTime

每帧时间

> 与速度的关系：
> 通常会使用形如 Time.deltaTime * 0.2f 作为每帧的运动距离/角度/比例等
> 如 1s 内的帧数为60
> 即 60 * Time.deltaTime = 1s
> 每秒运动的距离为 Time.deltaTime * 0.2f * 60 = 0.2f
> 即速度为 0.2f

### 坐标移动

```c#
// 坐标向xyz轴移动+1
transform.Translate(new Vector3(1, 1, 1))
```

### 坐标移动插值

```c#
// 线性插值
Vector3.Lerp()
// 球面插值
// 初始位置、终止位置、插值（百分比）
Vector3.Slerp(vf, new Vector3(0, 10, 0), Time.deltaTime * 0.2f);
```

> 理解：
> 每帧坐标从vf 到 new Vector3(0, 10, 0) 移动了 Time.deltaTime * 0.2f 的比例，由于Time.deltaTime为每帧时间，故0.2f 可视为速度（每秒移动的比例）

Quaternion
四元素，描述旋转
创建四元数
使用欧拉角
依次绕x, y, z顺时针旋转角度
Quaternion.Euler(10, 15, 20)
Quaternion.Euler(new Vector3(10, 15, 20))
使用旋转轴和角度
绕旋转轴顺时针旋转角度
Quaternion.AngleAxis(30, new Vector3(0, 2, 1))
四元数转欧拉角
Quaternion.eulerAngles

向量旋转
四元素方式
GameObject旋转
obj.rotation = quaternion
向量旋转
v1 = quaternion * v0
旋转的叠加
先旋转quaternion1，再旋转quaternion2
quaternion1 * quaternion2
Transform.RotateAround
// 要旋转的向量、旋转轴、
transform.RotateAround(targetVector3, Vector3.up, mouse_x * 1);

角度旋转插值
// 球面插值（百分比）
Quaternion.Slerp(E.rotation, qe, Time.deltaTime * 0.2F);
理解：
同坐标旋转插值

点绕直线旋转
// 直线上一点，直线方向，点，旋转角（顺时针）
    private Vector3 GetRotatedPoint(Vector3 axisPoint, Vector3 axisDir, Vector3 point, float angle)
    {
        // 直线上一点与直线外一点方向向量
        Vector3 axisPointP = p - axisPoint;
        return axisPoint + Quaternion.AngleAxis(angle, axisDir) * axisPointP;
}

GameObject绕直线旋转
Transform.RotateAround


协程
yield return 0/null
当前帧返回，下一帧继续运行
开始协程
StartCoroutine(StartDj());
StartCoroutine(StartDj(arg1));
StartCoroutine("StartDj");
停止协程
StopCoroutine("StartDj")
例：
在Start中执行
IEnumerator StartDj()
{
while (true)
{
Dj.Translate(Time.deltaTime * 1, Time.deltaTime * 0.05f, 0);
yield return 0;
}
}
在Update中执行（相当于普通方法）
IEnumerator StartDi()
{
Di.Translate(Time.deltaTime * 1, Time.deltaTime * 0.05f, 0);
Debug.DrawLine(Vector3.zero, Di.position, Color.red);
yield return 0;
}
在Update中执行（maybe有其他用处）
IEnumerator StartDi()
{
// 当前帧
Di.Translate(Time.deltaTime * 1, Time.deltaTime * 0.05f, 0);
Debug.DrawLine(Vector3.zero, Di.position, Color.red);
yield return 0;
// 下一帧
Debug.Log("Start Di");
yield return 0;
}

空间中的文字
MeshText 组件

世界坐标转屏幕坐标
理解：
世界坐标转换为UI（Canvas）中的坐标
Vector2 fromPosition = Camera.main.WorldToScreenPoint(pt.position);
pt.lineTransform.position = fromPosition;

世界坐标转换为本地坐标
Vector2 position;
    RectTransformUtility.ScreenPointToLocalPointInRectangle(GameObject.Find("KUI").transform as RectTransform, Input.mousePosition, null, out position);
    参数1 所在画布的transform
    参数2 世界坐标




数据类不需要挂载在Object上，不需要继承MonoBehaviour

Canvas Scaler
Constant Pixel Size
保持原尺寸
Scale With Screen Size
跟随屏幕尺寸缩放
Match
Width 随宽度缩放
Height 随高度缩放

输入
一直触发
Input.mousePosition // 鼠标位置(世界坐标)
Input.GetAxis("Mouse X") // 鼠标横向移动距离
Input.GetAxis("Mouse Y") // 鼠标纵向移动距离
Input.GetAxis("Mouse ScrollWheel") // 鼠标滚轮移动（距离？）
if (Input.GetAxis("Mouse ScrollWheel") > 0)
{
isMovingToDefault = false;
isMoving = false;

transform.Translate(Vector3.forward * 5f);
}
Input.GetKey(KeyCode.Mouse0) // 鼠标左键按下
Input.GetMouseButtonDown(0) // 鼠标左键按下
Input.GetKey(KeyCode.Mouse1) // 鼠标右键按下
Input.GetMouseButtonDown(1) // 鼠标右键按下
EventSystem.current.IsPointerOverGameObject() // 鼠标指向UI返回true，指向3D物体返回false
触发一次
Input.GetButtonDown("Fire1") // 鼠标左键按下
Input.GetButtonDown("Fire2") // 鼠标右键按下
Input.GetButtonUp("Fire1") // 鼠标左键按下
Input.GetButtonUp("Fire2") // 鼠标右键按下
仅作用于挂脚本的UI
IPointerClickHandler // 点击（左右键）
/// <summary>
/// 点击小地图相机移动到置顶位置
/// </summary>
/// <param name="pointerEventData"></param>
public void OnPointerClick(PointerEventData pointerEventData)
{
//Output to console the clicked GameObject's name and the following message. You can replace this with your own actions for when clicking the GameObject.
Vector2 position;
// 点击位置屏幕坐标转局部（小地图Image）坐标
RectTransformUtility.ScreenPointToLocalPointInRectangle(transform as RectTransform, Input.mousePosition, null, out position);
//Debug.Log(((RectTransform)transform).localPosition);
//Debug.Log(pointerEventData.position - ((RectTransform)transform).anchoredPosition);

Vector2 size = ((RectTransform)transform).sizeDelta;
// 相机移动到置顶的x, y比例
MouseBehaviourScript2 mbs2 = Camera.main.GetComponent<MouseBehaviourScript2>();
mbs2.MoveTo(Mathf.Abs(position.x) / size.x, Mathf.Abs(position.y) / size.y);
}
IPointerDownHandler // 按下
IPointerUpHandler // 抬起

UI穿透
点击UI不穿透到3D物体
判断EventSystem.current.IsPointerOverGameObject() // 鼠标指向UI返回true，指向3D物体返回false
UI不拦截射线
添加Canvas组件
取消勾选Interactable和Blocks RayCasts
射线检测
检测射线是否穿过Canvas的GameObject（被上层UI遮挡依然会检测到）
private bool IsPointerOverUIObject(Canvas canvas, Vector2 screenPosition)
{
if (EventSystem.current == null)
return false;

PointerEventData eventDataCurrentPosition = new PointerEventData(EventSystem.current);
eventDataCurrentPosition.position = screenPosition;

GraphicRaycaster uiRaycaster = canvas.gameObject.GetComponent<GraphicRaycaster>();
List<RaycastResult> results = new List<RaycastResult>();
uiRaycaster.Raycast(eventDataCurrentPosition, results);
return results.Count > 0;
}

碰撞器
Mesh Collider
如果只是显示，可以去掉，防止挡住射线？

摄像机渲染模式
Screen Space - Overley 覆盖，画布永远覆盖在相机上，且不会被其他物体阻挡
Screen Space - Camera 画布正对相机，会被其他物体阻挡

Screen Space - Camera
可以创建多个Canvas，order in Layer 控制每个曾的order


C#
索引增加
index = (index + 1)%textures.Length

字符串拼接
StringBuilder.AppendFormat("xxx{0}", name)

随机数
0-9 Random.range(0, 10)

利用LineRenderer在世界坐标画线
GameObject obj = new GameObject("GameObject");
// 添加LineRenderer组件
lineRenderer = obj.AddComponent<LineRenderer>();
// 线宽
lineRenderer.startWidth = 0.2f;
// 顶点数
lineRenderer.positionCount = 2;
// 设置各定点位置
lineRenderer.SetPosition(0, pt.position);
lineRenderer.SetPosition(1, pt.tagPosition());
// 线的材质
lineRenderer.materials = new Material[] { lineMaterial };
// 保持光亮状态？
lineRenderer.generateLightingData = true;

在世界某坐标中绘制标签，面向相机显示
标签线和标签在Canvas中绘制
思路：
将世界坐标转换为屏幕坐标，在该屏幕坐标绘制
优点：
始终正对相机
可使用预置体制作标签
问题：
没有近大远小的效果
各个标签层级关系不确定（跟绘制顺序有关）
Start
foreach (PositionTag pt in positionTags)
{
// 用Image创建线
GameObject obj = new GameObject("GameObject");
Image image = obj.AddComponent<Image>();
// 使用颜色填充
// image.color = Color.cyan;
// 使用图片资源（Sprite）
image.sprite = lineSprite;
// 按九宫格拉伸Sprite
image.type = Image.Type.Sliced;
Transform tran = obj.transform;
// 设置Image的中心点为左边中心
((RectTransform)tran).pivot = new Vector2(0, 0.5f);
// 将Image放在Canvas下
tran.SetParent(transform);
pt.lineTransform = tran;

// 从预置体创建标签并实例化
GameObject itemPrefab = GameObject.Instantiate(Resources.Load<GameObject>("Prefabs/PositionTagPanel"));
itemPrefab.transform.SetParent(transform);
// 设置标签文字
PositionTagPanelScript tpts = itemPrefab.GetComponent<PositionTagPanelScript>();
tpts.updateText(pt.text);
pt.transform = itemPrefab.transform;
}
Update
foreach (PositionTag pt in positionTags)
{
//得到NPC头顶在3D世界中的坐标
//默认NPC坐标点在脚底下，所以这里加上npcHeight它模型的高度即可
Vector3 worldPosition = pt.tagPosition();
//根据NPC头顶的3D坐标换算成它在2D屏幕中的坐标
Vector2 tagPosition = Camera.main.WorldToScreenPoint(worldPosition);
//得到真实NPC头顶的2D坐标
//position = new Vector2(position.x, Screen.height - position.y);
pt.transform.position = tagPosition;

// 线的起始位置（世界坐标转屏幕坐标）
Vector2 fromPosition = Camera.main.WorldToScreenPoint(pt.position);
pt.lineTransform.position = fromPosition;
pt.lineTransform.localRotation = Quaternion.AngleAxis(-GetAngle(fromPosition, tagPosition), Vector3.forward);

var distance = Vector2.Distance(fromPosition, tagPosition);
((RectTransform)pt.lineTransform).sizeDelta = new Vector2(Math.Max(1, distance), 20);
}
GetAngle(Vector3 pa, Vector3 pb)
// 获得两点连线与Vector2.right的夹角
public float GetAngle(Vector3 pa, Vector3 pb)
{
var dir = pb - pa;
var dirV2 = new Vector2(dir.x, dir.y);
var angle = Vector2.SignedAngle(dirV2, Vector2.right);
return angle;
}
PositionTag
[System.Serializable]
public class PositionTag
{
public string text; // 标签文字
public Vector3 position; // 标签线起始的世界坐标
[System.NonSerialized]
public Transform transform; // 标签

[System.NonSerialized]
public Transform lineTransform; // 线

// 标签的位置（在起始位置右上方）
public Vector3 tagPosition()
{
return position + new Vector3(10, 15, 0);
}
}
使用Mesh Text实现
思路：在三维空间绘制文字
优点：
可以实现近大远小的效果
近处的标签可以覆盖远处标签
问题：
使用Transform.LookAt和Transform.LookRotation可以使文字面向相机，但随着视角旋转文字会歪（平行四边形）（maybe可以解决）
//public TextMesh textName;

//// Start is called before the first frame update
//void Start()
//{
//    this.textName = this.GetComponentInParent<TextMesh>();
//}

//// Update is called once per frame
//void Update()
//{
//    // transform.LookAt(-Camera.main.transform.position);
//    Vector3 cameraDirection = Camera.main.transform.forward;
//    cameraDirection.y = 0f;
//    this.textName.transform.rotation = Quaternion.LookRotation(cameraDirection);
//}
OnGUI 绘制（弃用，因为OnGUI绘制总是强制显示在最上层，遮挡UI）
//Vector2 p1;
//// RectTransformUtility.ScreenPointToLocalPointInRectangle(GameObject.Find("KUI").transform as RectTransform, Input.mousePosition, null, out position);
//RectTransformUtility.ScreenPointToLocalPointInRectangle(transform as RectTransform, Input.mousePosition, null, out p1);


////先绘制黑色血条
//// GUI.DrawTexture(new Rect(position.x, position.y, 100, 20), blood_black);

////注解3
////计算NPC名称的宽高
//Vector2 nameSize = GUI.skin.label.CalcSize(new GUIContent(name));
////设置显示颜色为黄色
//GUI.color = Color.white;
////绘制NPC名称
////GUI.Label(new Rect(position.x, position.y - nameSize.y, nameSize.x, nameSize.y), name);
//GUIStyle textStyle = new GUIStyle();
//textStyle.normal.background = tagBackground;
//textStyle.normal.textColor = Color.white;
//textStyle.fontSize = 16;
//textStyle.fixedWidth = 160;
//textStyle.fixedHeight = 40;
//textStyle.alignment = TextAnchor.MiddleCenter;
//GUI.Label(new Rect(position.x - 80, position.y - 40, 160, 40), pt.text, textStyle);