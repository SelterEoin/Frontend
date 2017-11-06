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

    var speech_partsARRAY = response.data.speech_parts;
    var speech_partsLIST = speech_partsARRAY.map(function(person)
  {return <li><a href = '#'>{person}</a></li>;});
  ReactDOM.render(<ul>{speech_partsLIST}</ul>,document.getElementById('speech_partsUI'))

  var synonyms = response.data.synonims;
	var synolist = synonyms.map(function(person){
	return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{synolist}</ul>,document.getElementById('synonim_menu'))
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  /*-------------------------------------------------------------------------------------------*/

  _daneslownik(props){
  axios.get('/slownik_info',{})
        .then(function(response){
     console.log(response.data);
 /*console log odpowiada za wyswietlanie co jest pbierane z serwera(na stronie sie nie wyswietla)*/
   console.log(response.status);
   console.log(response.statusText);
   console.log(response.headers);
   console.log(response.config);
 var dane1 = response.data.res
 var dane1list = dane1.map(function(person){
 return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{dane1list}</ul>,document.getElementById('slownik_info'))
   }).catch(function(error){
     console.log(error);

	var tymczasowa_lista = ['dog' , 'cat', 'costam', 'xd', 'xd']
	/*map robi liste slow */
	var synolist = tymczasowa_lista.map(function(person){
	return <li><a href = '#'>{person}</a></li>;
	 });
	  ReactDOM.render(<ul>{synolist}</ul>,document.getElementById('slownik_info'))

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
    <div id  = 'slownik_info'>
    <button onClick={this._daneslownik.bind(this)}>Show "OWL" data</button>
    </div>
    </div>
    <div id = 'prz2'>{ttt}</div>
      <div id = 'prz3'>{end2}</div>
		</div>
    );
  }
}
