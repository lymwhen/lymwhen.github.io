# RecyclerView

[Listview与RecyclerView对比浅析【重点对比缓存】_recycleview listview_augfun的博客-CSDN博客](https://blog.csdn.net/augfun/article/details/114456710)



```java
package com.test.yt.boradcastlist;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.test.yt.R;
import com.test.dao.GroupArrayBean;
import com.test.dao.TerminalBean;

import java.util.ArrayList;
import java.util.List;

public class TerminalListAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final String TAG = "TerminalListAdapter";

    private static final int ITEM_BROADCAST_TERMINAL = R.layout.item_broadcast_terminal_only;

    private Context context;

    private List<TerminalBean> terminalList;

    private OnTerminalClickListener onTerminalClickListener;

    // 一般构造方法传入Context，用于获取Resource
    public TerminalListAdapter(Context context) {
        this.context = context;
    }

    // 接口，点击事件等
    public void setOnTerminalClickListener(OnTerminalClickListener onTerminalClickListener) {
        this.onTerminalClickListener = onTerminalClickListener;
    }

    // 设置数据方法
    public void setData(List<TerminalBean> terminalList) {
        this.terminalList = terminalList;
        notifyDataSetChanged();
    }

    // View（布局）类型，一般正好用布局文件的资源id作为类型
    // 只有一种View时，可以不实现此方法
    @Override
    public int getItemViewType(int position) {
        return ITEM_BROADCAST_TERMINAL;
    }

    // 创建ViewHolder
    // 可根据第二参数ViewType创建不同的ViewHolder
    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int viewType) {
        return new TerminalViewHolder(LayoutInflater.from(context).inflate(viewType,viewGroup,false));
    }

    // 绑定数据，在这里更新列表项UI
    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int i) {

        TerminalViewHolder vh = (TerminalViewHolder) viewHolder;
        TerminalBean d = getData(i);

        vh.tvName.setText(d.getEndpointName());
        vh.tvIp.setText(d.getEndpointIP());
        vh.bg.setOnClickListener(new View.OnClickListener() {
        	@Override
        	public void onClick(View view) {
          		if(onTerminalClickListener != null) {
          			onTerminalClickListener.onClicked(d);
          		}
          	}
        });
    }

    // 总项数
    @Override
    public int getItemCount() {
        return this.terminalList != null ? this.terminalList.size() : 0;
    }

    public interface OnTerminalClickListener {
        void onClicked(TerminalBean t);
    }
}

```

```java
rvList = findViewById(R.id.rv_list);
adapter = new BroadcastListAdapter(this);
adapter.setOnTerminalClickListener(new BroadcastListAdapter.OnTerminalClickListener() {
    @Override
    public void onClicked(TerminalBean t) {
        Intent intent = new Intent(ITCBroadcastActivity.this, ITCPCMActivity.class);
        intent.putExtra("terminals", (Serializable) Arrays.asList(t));
        startActivity(intent);
    }
});
rvList.setAdapter(adapter);
rvList.setLayoutManager(new LinearLayoutManager(this));
rvList.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
```

除了纵向列表，RecyclerView还支持横向、网格、瀑布布局。

> 定义 Adapter 时，您需要替换三个关键方法：
>
> - [`onCreateViewHolder()`](https://developer.android.google.cn/reference/androidx/recyclerview/widget/RecyclerView.Adapter?hl=zh-cn#onCreateViewHolder(android.view.ViewGroup, int))：每当 `RecyclerView` 需要创建新的 `ViewHolder` 时，它都会调用此方法。此方法会创建并初始化 `ViewHolder` 及其关联的 `View`，但不会填充视图的内容，因为 `ViewHolder` 此时尚未绑定到具体数据。
> - [`onBindViewHolder()`](https://developer.android.google.cn/reference/androidx/recyclerview/widget/RecyclerView.Adapter?hl=zh-cn#onBindViewHolder(VH, int))：`RecyclerView` 调用此方法将 `ViewHolder` 与数据相关联。此方法会提取适当的数据，并使用该数据填充 ViewHolder 的布局。例如，如果 `RecyclerView` 显示的是一个名称列表，该方法可能会在列表中查找适当的名称，并填充 ViewHolder 的 [`TextView`](https://developer.android.google.cn/reference/android/widget/TextView?hl=zh-cn) widget。
> - [`getItemCount()`](https://developer.android.google.cn/reference/androidx/recyclerview/widget/RecyclerView.Adapter?hl=zh-cn#getItemCount())：RecyclerView 调用此方法来获取数据集的大小。例如，在通讯簿应用中，这可能是地址总数。RecyclerView 使用此方法来确定什么时候没有更多的列表项可以显示。
>
> [使用 RecyclerView 创建动态列表  | Android 开发者  | Android Developers (google.cn)](https://developer.android.google.cn/guide/topics/ui/layout/recyclerview?hl=zh-cn)
>
> Adapter 的原理可以归结为：
>
> **`getItemCount`告知adapter总项数，在`onCreateViewHolder`和`onBindViewHolder`中根据position参数创建和填充View**



# 使用特殊数据构造列表

时长会有子项展开、树状结构的列表，实现方式：

- 将显示的项平铺在一维列表中
- 根据数据结构构造`getItemCount`、`getItemViewType`等方法

数据量小的时候，第一种方法可能更好一点，这样所有的方法都可以只关注这个一位列表构造

---

如子项展开结构的`getItemViewType`方法：

```java
@Override
public int getItemViewType(int position) {
    for(GroupData g : groupList) {
        if(position == 0) {
            return ITEM_BROADCAST_GROUP;
        } else {
            position--;
        }

        if(g.isExpand) {
            if(position < g.num) {
                return ITEM_BROADCAST_TERMINAL;
            } else {
                position -= g.num;
            }
        }
    }
    return 0;
}
```

