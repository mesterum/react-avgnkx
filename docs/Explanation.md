### How it works?

1. #### Fetch data
In data.js I created a general fetch data and a specific one for itunes. See [Steps](Steps.md) for the loadScript function
```javascript
export function itunesSearch (term,media,callback,limit=10) {
  if(callback&&typeof callback=="function")loadScript.callback=callback
  limit|=0; limit=limit<=0?0:limit
  let query={term: encodeURIComponent(term).replace(/%20/g, '+'),
    media,limit,callback:"loadScript.callback"}
  let url=`https://itunes.apple.com/search?`+
  Object.entries(query).filter(e=>e[1]).
    map(e=>`${e[0]}=${e[1]}`).join('&')
  // console.log(url)
  loadScript(url)
}
```
`itunesSearch` builds a query url from its parameters, sets the callback function and calls loadScript with the built url.

2. #### The (main) page: Search.js
The component is `BtnSelector` which accepts an `initKey` attribute with the default value "movie". Four possible values are valid, the keys of `const MediaType={movie:"Movies", music:"Music", software:"Apps", ebook:"Books",}`. For each value, a button.
The `BtnSelector` is built of:
   1. 4 selector buttons of `MediaType`
   2. a `Form` with an input text and a `Search` button
   3. the list of `Item`s from fetch result

##### The buttons
```javascript
Object.entries(MediaType).map(
  ([key, children]) => 
    <button {...{key, children, 
    disabled: key==skey,
    onClick: () => setSKey(key)
    }}/>
  )}<br/><br/>
```
The `key` attribute is required by React, is an unique identifier. `skey` is the selected key and `setSKey` is its setter. Both are constructed by a special kind of function named **hook**: `const [skey, setSKey] = useState(initKey)`
The convention for the hook name is to have the 'use' prefix. A hook can be called only inside components or other hooks.

In `useState1` I put my business logic of `BtnSelector`. 
```javascript
const useState1 = initKey => {
  const [skey, setSKey] = useState(initKey)
  // const value = useState("");
  const [_,setData] = useState(null);
  // const prevText = useRef("")
  const prevSearches = useRef({}).current
  ...
```
`setData` is a state setter only to trigger the render event when I get the data from `itunesSearch`, I'm not interested in getter. `useRef` gives me a component lifetime object like `useState` but without setter. React don't care if I change it. `prevSearches` it's an object with the same keys as `MediaType` that keeps the fetch result and the query term used in searching for each `MediaType`.
```javascript
...
let selSearches=prevSearches[skey]
  if(!selSearches)selSearches=prevSearches[skey]={
    text: "", data: []}
  else 
    if(!selSearches.data.length)
      selSearches.text=""
...
```
`selSearches` is a temporary, computed (derivated) value
```javascript
...
  const onSearch = term => {
    itunesSearch(term, skey, data=>{
      selSearches.text=term
      setData(selSearches.data=data.results)
    })
  }
  return [skey,setSKey,selSearches,onSearch]
}
```
To understand the importance of `setData` try to remove it and see that after a search, unless you change the media, the data will not be displayed. The render event is triggered by a setState function with a different value.
##### The Form
```javascript
...
<Form onSubmit={onSearch}
  value={selSearches}>{/*selSearches.text*/}
  <button>Search</button>
</Form><hr/>
...
```
I pass a Search handler and the value that should be in the text box. The value is in `selSearches.text` but I pass the container to be asured that the `Form` component is rerendered on every MediaType change.

I start `Form` with another custom hook. 
```javascript
const useInputValue = (initialValue) => {
  const [value, setValue] = useState(initialValue.text);
  useEffect(()=>{
    setValue(initialValue.text)
  },[initialValue])
...
```
`useState` uses its parameter only once per component, not on every invocation. To change the `value` we must call `setValue` but a setState never is called inside a render event. The body of a functional component is the render itself. I **dispatch** the `setValue` effect after the render by the hook `useEffect` with 2 parameters: what to do and how often. In our case, whenever `initialValue` (MediaType) changes.
```javascript
...
  return {
    value,
    onChange: e => setValue(e.target.value)
  };
};
```
`onChange` will be used by the input text.

The definition of `Form`:
```javascript
export default ({ onSubmit, children, value}) => {
  const text = useInputValue(value);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(text.value);
      }}
    >
      <input {...text} />{children}
    </form>
  );
};
```
The input text is inside a form to respond to `enter` key with form's `onSubmit` event. The button passed as child is optional.
##### And the data items
```javascript
  return<>{
...
    {selSearches.data.map(item =>
      <Item {...item}
        key={item.trackId||item.collectionId}/>
    )}
  </>
}
```
The pair of empty tags `<> ... </>` is a shortcut for the `<React.Fragment>` tag to hold multiple elements in one.

Beware of `return` statement, if the value that you want to return starts on the next line, will return nothing like `return;` statement due to automatic semicolon insertion behavior of javascript.

The definition of `Item` component is not interesting.