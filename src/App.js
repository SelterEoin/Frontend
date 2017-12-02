import React, { Component }  from 'react';
import { MegadraftEditor, MegadraftIcons, MyPageLinkIcon } from 'megadraft';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
var ReactDOM = require('react-dom');
import {Editor, EditorState,RichUtils, convertToRaw,getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;
import { createStore } from 'redux';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';

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
    axios.get('/one_word', {
    params: {
      ID: id_kursora,
      content: text
    }
  })
.then(function(response){
  var dataforwordRAW_subclass = response.data.subclass_of_list_response;
  var dataforwordLIST_subclass = dataforwordRAW_subclass.map(function(person)
{return <li><a href = '#'>{person}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_subclass}</ul>,document.getElementById('SUBCLASSES_CLASS'))

var dataforwordRAW_class_above = response.data.classes_above_list_response;
var dataforwordLIST_class_above = dataforwordRAW_class_above.map(function(person)
{return <li><a href = '#'>{person}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_class_above}</ul>,document.getElementById('UPPERCLASSES_CLASS'))

var dataforwordRAW_INDI_CLASS = response.data.instances_from_the_clicked_class_list_response;
var dataforwordLIST_INDI_CLASS = dataforwordRAW_INDI_CLASS.map(function(person)
{return <li><a href = '#'>{person}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_INDI_CLASS}</ul>,document.getElementById('INDI_CLASS'))

var dataforwordRAW_CLASS_INDI = response.data.sorted_above_INDI_list_response;
var dataforwordLIST_CLASS_INDI = dataforwordRAW_CLASS_INDI.map(function(person)
{return <li><a href = '#'>{person}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_CLASS_INDI}</ul>,document.getElementById('CLASS_INDI'))

var dataforwordRAW_INDI_INDI = response.data.instances_from_the_same_class_list_response;
var dataforwordLIST_INDI_INDI = dataforwordRAW_INDI_INDI.map(function(person)
{return <li><a href = '#'>{person}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_INDI_INDI}</ul>,document.getElementById('INDI_INDI'))
})
  .catch(function (error) {
    console.log(error);
  });
  }
  /*-------------------------------------------------------------------------------------------*/
  _search_all(props){
    const {editorState} = this.state;
    var selectionState = editorState.getSelection();
    var id_kursora = selectionState.focusOffset
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var text = currentContentBlock.getText();
    let html = stateToHTML(currentContent);
    let contentState = stateFromHTML(html);
    var globalObject = this;
    console.log(html)
    console.log(text)
  axios.get('/search_all',{params: {content:text}})
        .then(function(response){
 var words_in = response.data.response_search_all_list
console.log(words_in)
    var newHTMLContent = html;
    words_in.forEach(currentWord => {
          console.log(words_in)
          newHTMLContent = newHTMLContent.replace(currentWord, <strong>${currentWord[0]}</strong>);
        });
    globalObject.setState({
      editorState: EditorState.createWithContent(stateFromHTML(newHTMLContent))
    });
 var words_in_list = words_in.map(function(person){
 return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{words_in_list}</ul>,document.getElementById('SEARCH_ALL_DOM'))
   }).catch(function(error){
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
_data_OWL_LIB1(props){
axios.get('/OWL_DATA_LIB_button1',{})
      .then(function(response){
ReactDOM.render(document.getElementById('LIB'))
 }).catch(function(error){
   console.log(error);
 });
}
/*-------------------------------------------------------------------------------------------*/
_data_OWL_LIB2(props){
axios.get('/OWL_DATA_LIB_button2',{})
      .then(function(response){
ReactDOM.render(document.getElementById('LIB'))
 }).catch(function(error){
   console.log(error);
 });
}
/*-------------------------------------------------------------------------------------------*/
_data_OWL_LIB3(props){
axios.get('/OWL_DATA_LIB_button3',{})
      .then(function(response){
ReactDOM.render(document.getElementById('LIB'))
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
    <div id  = 'LIB'>
    Please click which data pack you want to use.
<button onClick={this._data_OWL_LIB1.bind(this)}> PLACES </button>
<button onClick={this._data_OWL_LIB2.bind(this)}> GUNS </button>
<button onClick={this._data_OWL_LIB3.bind(this)}> PEOPLE </button>
    </div>

    <div id  = 'UPPERCLASSES_CLASS'>If pressed word is a class - upperclasses of this class will display here.</div>

    <div id  = 'SUBCLASSES_CLASS'>If pressed word is a class - subclasses of this class will display here.</div>

    <div id  = 'INDI_CLASS'>If pressed word is a class - individuals of this class will display here.</div>

    <div id  = 'CLASS_INDI'>If pressed word is a individual - upperclasses of this individual will display here.</div>

    <div id  = 'INDI_INDI'>If pressed word is a individual - siblings of this individual will display here.</div>

    <div id = 'SEARCH_ALL_DOM_BUTTON'>
<button onClick={this._search_all.bind(this)}> Click to analize currently inputted text </button>
    </div>
    <div id = 'SEARCH_ALL_DOM'> In this place all words that are in dictionary of choosen discipline, will display.</div>

    <div id  = 'OWL_DATA_CLASSES'>
    <button onClick={this._data_OWL1.bind(this)}>Click to show Classes defined in the ontology</button>
    </div>

    <div id  = 'OWL_DATA_INDIVIDUALS'>
    <button onClick={this._data_OWL2.bind(this)}>Click to show The individuals (or instances) defined in the ontology</button>
    </div>

    <div id  = 'OWL_DATA_OBJECT_PROPERTIES'>
    <button onClick={this._data_OWL3.bind(this)}>Click to show ObjectProperties defined in the ontology</button>
    </div>
    </div>
    </div>
    );
  }
}
