---
title: 002 React Hooks
date: 2021-07
categories:
  - react
tags: 
  - react
---

# React Hooks

## useState

### 为什么使用 useState？

`useState` 的出现是：在函数组件里面使用 class 的 setState

解决的问题：函数组件也能拥有自己维护的 state

### 如何使用 useState

```js
const [name, setName] = useState("rose");
```

### useState 踩坑知识点

`useState 的初始值，只在第一次有效`

例子：当点击按钮修改 name 的值的时候， Child 组件虽然收到了值，但是不会通过 `useState` 赋值给 childName

```js
const Child = memo(({ data }) => {
  console.log("child render...", data);
  const [childName, setChildName] = useState(data);
  return (
    <div>
      <div>child</div>
      <div>
        {childName} --- {data}
      </div>
    </div>
  );
});

const Hook = () => {
  console.log("Hook render...");
  const [count, setCount] = useState(0);
  const [name, setName] = useState("rose");

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>update count </button>
      <button onClick={() => setName("jack")}>update name </button>
      <Child data={name} />
    </div>
  );
};
```

## useEffect

### 为什么要使用 useEffect

useEffect 的出现是：在函数组件里面使用 class 的生命周期函数，而且还是所有函数的合体

### 如何使用 useEffect

```js
useEffect(() => {
  ...
})
```

### useEffect 知识点合集

1. 只在第一次使用的 componentDidMount, 可以用来请求异步数据

> useEffect 最后，加了 [] 就表示只第一次执行

```js
useEffect(() => {
  const user = 获取全国人民信息();
}, []);
```

2. 用来代替 willUpdate 等每次渲染都会执行的生命周期

> useEffect 最后，不加 [] 就表示每一次渲染都执行

```js
useEffect(() => {
  const user = 获取全国人民信息();
});
```

3. 每次渲染都执行感觉浪费性能，所以在 useEffect 最后加上 [], 并且 [] 加的字段表示：这个字段变了，这个 effect 才执行

```js
useEffect(() => {
  const user = name改变了我才获取全国人民信息();
}, [name]);
```

4. 如果想要分别依赖不同项，可以写多个 useEffect

```js
useEffect(() => {
  const user = name改变了我才获取全国人民的name信息();
}, [name]);

useEffect(() => {
  const user = age改变了我才获取全国人民的age信息();
}, [age]);
```

5. 如果之前订阅了生命，最后在 willUnMount 这个生命周期里面要取消订阅，这个用 useEffect 怎么实现？

> 在 effect 的 return 里面可以做取消订阅的事（useEffect return 的函数会在组件销毁的时候执行）

```js
useEffect(() => {
  const subscription = 订阅全国人民吃饭的情报！
  return () => {
    取消订阅全国人民吃饭的情报！
  }
}, [])
```

为什么要取消订阅？

> 大家都知道，render 之后会重新执行 useEffect，如果 useEffect 里面有一个 setInterval 那么每次 render, 再次执行 useEffect 就会再创建一个 setInterval, 然后就混乱了

```js
const [count, setCount] = useState(0);
useEffect(() => {
  console.log("use effect...", count);
  const timer = setInterval(() => setCount(count + 1), 1000);
}, [count]);
```

6. useEffect 的一些暗戳戳的规则：

> 1. useEffect 中使用到的 state 的值，固定在了 useEffect 内部，不会被改变，除非 useEffect 刷新，重新固定 state 的值

```js
const [count, setCount] = useState(0);
useEffect(() => {
  console.log("use effect...", count);
  const timer = setInterval(() => {
    console.log("timer...count: ", count);
    setCount(count + 1);
  }, 1000);
}, []);
```

> 2. useEffect 不能判断包裹(因为 react 判断 useEffect 是哪一个是根据顺序判断的，如果有包裹，有可能前后顺序就不一致了)

```js
const [count, setCount] = useState(0);
if (2 < 5) {
  useEffect(() => {}, []);
}
```

> 3. useEffect 不能被打断

```js
const [count, setCount] = useState(0);
useEffect(() => {}, []);

return; // 函数提前结束

useEffect(...)
```

具体原因跟 uesEffect 的生成执行规则有关

## useRef

### 为什么要使用 useRef?

前面提到的：

> useEffect 中使用 state 的值会被固定在 useEffect 内部，不会改变，除非 useEffect 刷新，重新固定 state 的值

```js
const [count, setCount] = useState(0);
useEffect(() => {
  console.log("use effect...", count);
  const timer = setInterval(() => {
    console.log("use interval...", count);
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

`useEffect` 里面 state 的值是固定的, count 会一直是 1, 这个是有办法解决的，就是使用 `useRef`, 可以理解成 `useRef` 的一个作用：

> 就是相当于全局作用域，一处被修改，其他地方全更新

### 如何使用 useRef?

```js
const countRef = useRef(0);
```

1. 就是相当于全局作用域，一处被修改，其他地方全更新

```js
const Hook = () => {
  const [count, setCount] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    console.log("use effect...", ref);
    const timer = setInterval(() => {
      console.log("timer...count: ", ref.current);
      setCount(++ref.current);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return <div>{count}</div>;
};
```

2. 普通操作，用来操作 dom

> const btnRef = useRef(null)

> 绑定 ref, 注册 click 事件

> 活学活用，记得取消绑定事件！ return () => btnRef.current.removeEventListener('click')

```js
const Hook = () => {
  const [count, setCount] = useState(0);
  const ref = useRef < HTMLButtonElement > null;

  useEffect(() => {
    console.log("use effect...");
    const onClick = () => {
      setCount(count + 1);
    };
    ref.current?.addEventListener("click", onClick, false);

    return () => ref.current?.removeEventListener("click", onClick, false);
  }, [count]);

  return (
    <>
      <div>{count}</div>
      <button ref={ref}>click me</button>
    </>
  );
};
```

## useMemo

### 为什么要使用 useMemo?

举个例子

```js
const MemoChild =
  memo <
  { data: any } >
  (({ data }) => {
    console.log("Child render...: ", data);
    return (
      <>
        <p>child</p>
        <p>{data.name}</p>
      </>
    );
  });

const Memo = () => {
  console.log("Hook render...");
  const [count, setCount] = useState(0);
  const [name, setName] = useState("今天是个好日子");
  const data = {
    name,
  };

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>click me</button>
      <MemoChild data={data} />
    </>
  );
};
```

当我们点击按钮更新 count 的时候, Memo 组件会 render, 一旦 render 执行到这一行代码：

```js
const data = {
  name,
};
```

这行代码会生成有新的内存地址的对象，那么就算带着 memo 的 Child 组件，也会跟着重新 render 尽管最后 Child 使用到的值并没有改变

这样就多余 render 了，感觉性能浪费！于是 `useMemo` 作为一个有着暂存能力的 Hooks 就来了

### 如何使用 useMemo?

```js
const data = useMemo(() => {
  return {
    name,
  };
}, [name]);
```

render 的时候， 就会先根据 `[name]` 里面的 name 值判断一些，因为 useMemo 是有着暂存能力的，暂存了上一次 name 的结果

结果一对比上一次的 name, 我们发现 name 值居然没有变化！那么这次 data 就不重新赋值成新的对象了！

没有新的对象，就没有新的内存地址，那么 Child 就不会重新 render 了!

```js
const MemoChild =
  memo <
  { data: any } >
  (({ data }) => {
    console.log("Child render...: ", data);
    return (
      <>
        <p>child</p>
        <p>{data.name}</p>
      </>
    );
  });

const Memo = () => {
  console.log("Hook render...");
  const [count, setCount] = useState(0);
  const [name, setName] = useState("今天是个好日子");
  const data = useMemo(() => {
    return { name };
  }, [name]);

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>click me</button>
      <MemoChild data={data} />
    </>
  );
};
```

### useMemo 知识点合集

`useMemo` 一看就感觉跟 React.memo() 有蜜汁关系，因为都有 memo

1. 首先 `memo` 的用法是：`函数组件里面的 PureComponent`

> 但是，如果函数组件被 React.memo() 包裹，且其实现中拥有 useState 或 useContext 的 Hook, 当 context 发生变化时， 它仍会渲染

2. 而且，`memo` 是浅比较，意思是，对象只比较内存地址，只要你内存地址没变，管你对象里面的值千变万化都不会触发 render

3. 最后，`useMemo` 的作用是解决值的缓存问题，避免在每次渲染时都进行高开销的计算

## useCallback

### 为什么要使用 useCallback

useMemo 解决了值的缓存问题，那么函数呢？

下面这个 🌰 就是，当点击 count 的按钮, Effect 组件 render, 遇到了：

```js
const onChange = (e) => {
  setText(e.target.value);
};
```

则重新生成了一个 onChange 函数，赋值给了 Child 组件, 浅比较失败， Child 组件重新进行渲染，尽管 Child 组件什么都没有发生

```js
const Child = memo<{ name: string; onChange: any }>(({name, onChange}) => {
  console.log('Child render...');
  return (
    <>
      <div>Child</div>
      <div>{name}</div>
      <input type="text" onChange={onChange} ></input>
    </>
  );
});

const Hooks = () => {
  console.log('Hooks render...');
  const [count, setCount] = useState(0);
  const [name, setName] = useState('互换收益');
  const [text, setText] = useState('')

  const onChange = (e) => {
    setText(e.target.value);
  };
  return (
    <>
      <div>count: {count}</div>
      <div>text: {text}</div>
      <button onClick={() => setCount(count + 1)}>click me</button>
      <Child name={name} onChange={onChange} />
    </>
  )
};
```

### 如何使用 useCallback

```js
const onChange = useCallback((e) => {
  setText(e.target.value);
}, []);
```

### useCallback 知识点合集

1. `useMemo` 与 `useCallback` 类似，都是有着缓存的作用。本质的区别可能就算：

> useMemo 是缓存值的

> useCallback 是缓存函数的

2. 没有依赖，则添加空依赖，即空数组！

## useReducer

### 为什么要使用 useReducer?

useState 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer, 并返回当前的 state 以及其配套的 dispatch 方法

### 如何使用 useReducer？

举个 🌰：

```js
const reducer = (state: number, { type }: { type: string }): number => {
  switch (type) {
    case "add":
      return state + 1;
    case "delete":
      return state - 1;
    default:
      return state;
  }
};

const Hooks = () => {
  const [count, dispatch] = useReducer(reducer, 0);
  return (
    <>
      count: {count}
      <button onClick={() => dispatch({ type: "add" })}>add</button>
      <button onClick={() => dispatch({ type: "delete" })}>delete</button>
    </>
  );
};
```

### useReducer 知识点合集

1. `const [state, dispatch] = useReducer(reducer, initialArg, init)`
2. 惰性初始化：可以选择惰性创建初始 state. 为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 state 将被设置为 init(initalArg)

## useContext

### 为什么要使用 useContext?

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext 的 context value 值。

即使祖先使用 `React.memo` 或 `shouldComponentUpdate`, 也会在组件本身使用 `useContext` 时重新渲染

### 如何使用 useContext

```js
const reducer = (state = 0, { type }) => {
  switch (type) {
    case "add":
      return state + 1;
    case "delete":
      return state - 1;
    default:
      return state;
  }
};

const Context = React.createContext(null);

const Child = () => {
  const [count, dispatch] = useContext(Context);
  return (
    <div>
      <div>child...{count}</div>
      <button onClick={() => dispatch({ type: "add" })}>child add</button>
      <button onClick={() => dispatch({ type: "detele" })}>child detele</button>
    </div>
  );
};

const Hook = () => {
  const [count, dispatch] = useReducer(reducer, 0);
  return (
    <Context.Provider value={[count, dispatch]}>
      <div>
        <div>mom...{count}</div>
        <Child />
        <button onClick={() => dispatch({ type: "add" })}>mom add</button>
        <button onClick={() => dispatch({ type: "detele" })}>mom detele</button>
      </div>
    </Context.Provider>
  );
};
```

### useContet 需要注意的地方

1. useContext 的参数必须是 context 对象本身
2. 调用了 useContext 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以 `通过使用 memoization 来优化`

## 自定义 Hook

### 为什么要使用自定义 Hook

通过自定义 Hook, 可以将组件逻辑提取到可重用的函数中

### 如何使用自定义 Hook

**自定义 Hook 是一个函数，其名称以"use"开头，函数内部可以调用其他的 Hook**. 举个 🌰

```js
import { useState, useEffect } from "react";

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function hanleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```
