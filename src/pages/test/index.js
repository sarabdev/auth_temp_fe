import React, { useRef ,useEffect} from 'react';
import { render } from 'react-dom';
const  BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
import EmailEditor from 'react-email-editor';
import axios from 'axios';

const App = (props) => {
  const emailEditorRef = useRef(null);

  const exportHtml = async() => {
    emailEditorRef.current.editor.exportHtml(async(data) => {
        const { design, html } = data;

    await axios.post(`${BASE_URL}/templates`,{name:'New Template',body:html})

      console.log('exportHtml', html);
    });
  };


 
  const onReady = () => {

    const editor = emailEditorRef.current.editor;

    // Set content programmatically
    // editor.setBody({
    //   rows: [
    //     {
    //       columns: [
    //         {
    //           contents: [
    //             {
    //               type: 'text',
    //               data: {
    //                 value: 'Hello, world!'
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // });

    // // Set HTML programmatically
    // const html = '<p>This is some <strong>bold</strong> and <em>italic</em> text.</p>';
    // editor.setHtml(html);
   
  };

  return (
    <div>
      <div>
        <button onClick={exportHtml}>Export HTML</button>
      </div>

      <EmailEditor  ref={emailEditorRef} onReady={onReady} />
    </div>
  );
};

export default App