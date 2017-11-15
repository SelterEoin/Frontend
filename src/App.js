import React, { Component }  from 'react';

import { MegadraftEditor, MegadraftIcons, MyPageLinkIcon } from 'megadraft';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

var ReactDOM = require('react-dom');
import {Editor, EditorState,RichUtils, convertToRaw,getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

import { createStore } from 'redux';

var axios = require('axios');
var qs = require('qs');


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState})
    this.onClick = this.handleClick.bind(this);
  }

  /*------------------------------------------------------------------------------------------*/
  handleClick = (event) => {
    const {editorState} = this.state;
    var selectionState = editorState.getSelection();
    var id_kursora = selectionState.focusOffset
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var text = currentContentBlock.getText();
    console.log(id_kursora+text)
    axios.get('/click_event=', {
    params: {
      ID: id_kursora,
      content: text
    }
  })
  .then(function (response) {
    var dataforwordRAW = response.data.dataforword;
    var dataforwordLIST = dataforwordRAW.map(function(person)
  {return <li><a href = '#'>{person}</a></li>;});
  ReactDOM.render(<ul>{dataforwordLIST}</ul>,document.getElementById('DATAWORD'))
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  /*-------------------------------------------------------------------------------------------*/

  _data_OWL1(props){
  axios.get('/OWL_DATA_CLASSES',{})
        .then(function(response){
     console.log(response.data);
 /*console log odpowiada za wyswietlanie co jest pbierane z serwera(na stronie sie nie wyswietla)*/
   console.log(response.status);
   console.log(response.statusText);
   console.log(response.headers);
   console.log(response.config);
 var dataCLASSES = response.data.dataCLASSESback
 var dataCLASSESlist = dataCLASSES.map(function(person){
 return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{dataCLASSESlist}</ul>,document.getElementById('OWL_DATA_CLASSES'))
   }).catch(function(error){
     console.log(error);

	var tymczasowa_lista = ['ASDASDASDASDASD' , '2', '3', '4', '5','6','7']
	/*map robi liste slow */
	var list = tymczasowa_lista.map(function(person){
	return <ol><a href = '#'>{person}</a></ol>;
	 });
	  ReactDOM.render(<ul>{list}</ul>,document.getElementById('OWL_DATA_CLASSES'))
   });
 }
/*-------------------------------------------------------------------------------*/
 _data_OWL2(props){
 axios.get('/OWL_DATA_INDIVIDUALS',{})
       .then(function(response){
    console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
var dataIND = response.data.dataINDIback
var dataINDlist = dataIND.map(function(person){
return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{dataINDlist}</ul>,document.getElementById('OWL_DATA_INDIVIDUALS'))
  }).catch(function(error){
    console.log(error);
  });
}
  /*-------------------------------------------------------------------------------------------*/
_data_OWL3(props){
axios.get('/OWL_DATA_OBJECT_PROPERTIES',{})
      .then(function(response){
   console.log(response.data);
 console.log(response.status);
 console.log(response.statusText);
 console.log(response.headers);
 console.log(response.config);
var dataPROPERTIES = response.data.dataPROPERTIESback
var dataPROPERTIESlist = dataPROPERTIES.map(function(person){
return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{dataPROPERTIESlist}</ul>,document.getElementById('OWL_DATA_OBJECT_PROPERTIES'))
 }).catch(function(error){
   console.log(error);
 });
}
  /*-------------------------------------------------------------------------------------------*/

  render() {

    const megadraftActions = [
      { type: "inline", label: "B", style: "BOLD", icon: MegadraftIcons.BoldIcon },
      { type: "inline", label: "I", style: "ITALIC", icon: MegadraftIcons.ItalicIcon },
      { type: "separator" },
      { type: "block", label: "UL", style: "unordered-list-item", icon: MegadraftIcons.ULIcon },
      { type: "block", label: "OL", style: "ordered-list-item", icon: MegadraftIcons.OLIcon },
      { type: "block", label: "H2", style: "header-two", icon: MegadraftIcons.H2Icon },
      { type: "block", label: "QT", style: "blockquote", icon: MegadraftIcons.BlockQuoteIcon }
    ];

      const {editorState} = this.state;
      const contentState = convertToRaw( editorState.getCurrentContent());
      const contentState2 =  editorState.getCurrentContent();
      var synrequest =  JSON.stringify(convertToRaw(editorState.getCurrentContent()))
	    const x = editorState.getSelection();
      var usersWithName = synrequest
	  /*y odpowiada za pobieranie samego tekstu z edytora*/
      const y = editorState.getCurrentContent().getPlainText()
	/*to odpowiada za pobieranie zaznaczenia*/
      var selectionState = editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = editorState.getCurrentContent();
      var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      var start = selectionState.getStartOffset();
      var end = selectionState.getEndOffset();
      var selectedText = currentContentBlock.getText().slice(start, end);
      var end2 = selectionState.focusOffset
      var end3 = selectionState.startOffset
      var text = currentContentBlock.getText();
      var textsplit = text.split(" ");
      var ttt = textsplit[0]
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      var blockWithLinkAtBeginning = contentState2.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    return (
    <div id='content'>
      <div className='editor' onClick={this.onClick}>
          <MegadraftEditor
      editorState={this.state.editorState}
			handleKeyCommand={this.handleKeyCommand}
      onChange={this.onChange}
			handleKeyCommand={this.handleKeyCommand}
			keyBindingFn={this.keyBindingFn}
      handleBeforeInput={this.handleBeforeInput}
      handlePastedText={this.handlePastedText}
      actions={megadraftActions}
        />
        </div>
		<div id  = 'wynik'>
    <div id  = 'DATAWORD'></div>
    <div id  = 'OWL_DATA_CLASSES'>
    <button onClick={this._data_OWL1.bind(this)}>Show Classes defined in the ontology</button>
    </div>
    <div id  = 'OWL_DATA_INDIVIDUALS'>
    <button onClick={this._data_OWL2.bind(this)}>Show The individuals (or instances) defined in the ontology</button>
    </div>
    <div id  = 'OWL_DATA_OBJECT_PROPERTIES'>
    <button onClick={this._data_OWL3.bind(this)}>Show ObjectProperties defined in the ontology</button>
    </div>
    </div>
		</div>
    );
  }
}
