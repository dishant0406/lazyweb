import React, { useEffect, useState, lazy, Suspense } from 'react';
import { languages, themes, useSelectLanguage, useSelectTheme, useUIStore } from '@/hooks/Zustand';
import { useRouter } from 'next/router';
import AceEditor from "react-ace";
import dynamic from 'next/dynamic';

//import theme dynamically  

//themes
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-dreamweaver";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-idle_fingers";

//languages
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/mode-django";
import "ace-builds/src-noconflict/mode-dockerfile";
import "ace-builds/src-noconflict/mode-elixir";
import "ace-builds/src-noconflict/mode-elm";
import "ace-builds/src-noconflict/mode-erlang";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-graphqlschema";
import "ace-builds/src-noconflict/mode-haskell";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-objectivec";
import "ace-builds/src-noconflict/mode-pascal";
import "ace-builds/src-noconflict/mode-perl";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-r";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-xml";



type Props = {
  noHeading?: boolean;
};


const Code = ({ noHeading }: Props) => {
  const { borderRadius } = useUIStore();
  const [heading, setHeading] = useState('');
  const router = useRouter();
  const selectedTheme = (router.query.theme as string) || 'monokai';
  const borderWidth = (router.query.borderWidth as string) || '1';
  const borderColor = (router.query.borderColor as string) || 'rgba(255,255,255,0.5)';
  const selectedLanguage = (router.query.language as string) || 'javascript';
  const value = router.query.code ? atob(router.query.code as string) : '';

  useEffect(() => {

  }, [selectedTheme, selectedLanguage]);

  const onChange = (newValue: string) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        code: btoa(newValue),
      },
    }, undefined, { shallow: true });
  };

  return (
    <div style={{
      borderRadius: `${borderRadius + 1}px`,
      boxShadow: `0 0 0 ${borderWidth}px ${borderColor}`,
    }} className='relative z-[1] shadow-2xl'>
      {!noHeading && <div className='w-full absolute justify-between flex px-[2%] top-[15px] z-[1]'>
        <div className='flex gap-[5px]'>
          <div className='w-[15px] h-[15px] rounded-[50%] bg-[#FF5F56]'></div>
          <div className='w-[15px] h-[15px] rounded-[50%] bg-[#FFBD2E]'></div>
          <div className='w-[15px] h-[15px] rounded-[50%] bg-[#27C93F]'></div>
        </div>
        <input style={{
          fontFamily: 'jetbrainsmono',
        }} className='w-fit bg-transparent mt-[-5px] text-white/50 outline-none' placeholder='Untitled' value={heading} onChange={e => {
          setHeading(e.target.value)
        }
        } />
        <div />
      </div>}
      <Suspense fallback={<div>Loading Editor...</div>}>
        <AceEditor
          placeholder=""
          mode={selectedLanguage}
          theme={selectedTheme}
          className=''
          style={{ borderRadius: `${borderRadius}px`, width: '100%' }}
          onLoad={editor => {
            editor.renderer.setPadding(20);
            editor.renderer.setScrollMargin(50, 20, 0, 0);
          }}
          name="blah2"
          onChange={onChange}
          fontSize={16}
          showPrintMargin={false}
          minLines={5}
          maxLines={Infinity}
          showGutter={false}
          wrapEnabled={true}
          highlightActiveLine={false}
          value={value}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: false,
            tabSize: 2,
            displayIndentGuides: false,
            cursorStyle: 'slim',
            wrap: true,
          }}
        />
      </Suspense>
    </div>
  );
};

export default Code;
