import React, {useState, useCallback, useRef,useEffect} from 'react';
import {data,itunesSearch} from '../data'
import Form from './Form'

export default ({ name }) => 
  <>Hello {name}! <br/>
  <BtnSelector initKey="ebook"/>
  {/*<div>{JSON.stringify(data.results[0])}</div>*/}
  </>;

const MediaType={movie:"Movies", music:"Music", software:"Apps", ebook:"Books",}
const useState1 = initKey => {
  const [skey, setSKey] = useState(initKey)
  // const value = useState("");
  const [_,setData] = useState(null);
  // const prevText = useRef("")
  const prevSearches = useRef({}).current
  let selSearches=prevSearches[skey]
  if(!selSearches)selSearches=prevSearches[skey]={
    text: "", data: []}
  else 
    if(!selSearches.data.length)
      selSearches.text=""
  // const onSetKey = key => {
  //   prevText.current = selSearches.text// = value[0]
  //   setSKey(key)
  // }
  const onSearch = term => {
    itunesSearch(term, skey, data=>{
      selSearches.text=term
      setData(selSearches.data=data.results)
    })
  }
  // console.log(selSearches.text)
  return [skey,setSKey,selSearches,onSearch]
}
const BtnSelector = ({initKey="movie"}) => {
  const [skey, setSKey, selSearches, onSubmit] = useState1(initKey)
  return<>{
    Object.entries(MediaType).map(
    ([key, children]) => 
      <button {...{key, children, 
      disabled: key==skey,
      onClick: () => setSKey(key)
      }}/>
    )}<br/><br/>
    <Form onSubmit={onSubmit}
      value={selSearches}>{/*selSearches.text*/}
      <button>Search</button>
    </Form><hr/>
    {selSearches.data.map(item =>
      <Item {...item}
        key={item.trackId||item.collectionId}/>
    )}
  
  </>
}

//https://material-ui.com/demos/selection-controls/
//https://github.com/azz/styled-css-grid
import { Grid, Cell } from 'styled-css-grid'
const Item = ({artworkUrl100, artistName, collectionName, trackName}) => 
  <><Grid columns={4}
    gap={"24"} >
    <div className="pic"><img src={artworkUrl100} alt=""  style={{
    paddingRight: "1em"}}/></div>
  <Cell width={3}>
    <div className="sel"><button>Fav</button> </div>
    <div className="artist">{artistName}</div>
    <div className="track">{collectionName}</div>
    <div className="collection">{trackName}</div>
  </Cell>
  </Grid>
  <hr/></>
