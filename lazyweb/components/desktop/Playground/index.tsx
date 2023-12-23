import React, { useRef, useEffect, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Resizable } from 'react-resizable';
import CreateRoomModal from "@/components/utility/Modals/CreateRoomModal";
import { isDesktop } from "react-device-detect";
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'
import io from 'socket.io-client';
import 'react-reflex/styles.css'
import { toast } from "react-toastify";
import MemebersModal from "@/components/utility/Modals/Members";
import { event } from "nextjs-google-analytics";
import ReactTooltip from 'react-tooltip';
import { useRouter } from "next/router";

const socket = io(process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL || 'http://localhost:4000');

const PlaygroundComponent = () => {
  const editorRef = useRef(null);
  const [logs, setLogs] = useState<any>([]);
  const [code, setCode] = useState<any>("console.log('hello lazyweb')");
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const router = useRouter()
  const [isRoomJoined, setIsRoomJoined] = useState<boolean>(false);
  const [roomID, setRoomID] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [memebersModalOpen, setMemebersModalOpen] = useState<boolean>(false);
  const [members, setMembers] = useState<{
    id: string;
    name: string;
  }[]>([]); // [{id: '123', name: 'abc'}
  const iframeRef = useRef<
    HTMLIFrameElement | null
  >(null);

  const injectScript = (iframe: any, code: any) => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open('text/html', 'replace');
    iframeDoc.write(`
      <html>
        <body>
          <script>
            let lineNumber = 0; // A counter to simulate line numbers for each log statement
            const consoleMethods = ["log", "warn", "error", "info", "table"];
            consoleMethods.forEach((method) => {
              const original = console[method];
              console[method] = function(...args) {
                lineNumber++;
                window.parent.postMessage({ 
                  type: method, 
                  message: args.map((arg) => typeof arg === "object" ? JSON.stringify(arg) : arg).join(" "), 
                  line: lineNumber 
                }, '*');
                original.apply(console, args);
              };
            });
  
            // Handling unhandled promise rejections
            window.addEventListener('unhandledrejection', function (e) {
              lineNumber++;
              window.parent.postMessage({ type: 'error', message: e.reason, line: lineNumber }, '*');
            });
  
            // Handling other errors
            window.addEventListener('error', function (e) {
              lineNumber++;
              window.parent.postMessage({ type: 'error', message: e.message, line: lineNumber }, '*');
            }, false);
            
            // Wrap the user's code in a try-catch block
            try {
              ${code}
            } catch(e) {
              lineNumber++;
              window.parent.postMessage({ type: 'error', message: e.message, line: lineNumber }, '*');
            }
  
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  useEffect(() => {
    socket.on('codeUpdate', (newCode) => {
      setCode(newCode);
    });

    socket.on('setEditable', (editable) => {
      // Handle editability here, if needed
    });

    socket.on('membersList', (members) => {
      setMembers(members);
    })

    socket.on('joinError', (error) => {
      toast.error(error);
    })

    socket.on('leftRoom', (data) => {
      toast.info(`${data.name} left the room`)
    })

    socket.on('roomClosed', () => {
      toast.info('Room Closed, Reloading Page...')
      setTimeout(() => {
        window.location.reload()
      }
        , 1000);
    });

    return () => {
      socket.off('codeUpdate');
      socket.off('setEditable');
    };
  }, []);



  const handleRun = (code: any) => {
    setLogs([]); // Clear logs before running new code
    if (!iframeRef.current) return;
    if (!code) return;


    const newIframe = document.createElement("iframe");
    newIframe.style.width = '0px';
    newIframe.style.height = '0px';
    newIframe.style.border = 'none';
    newIframe.title = 'output';
    iframeRef.current.replaceWith(newIframe);
    iframeRef.current = newIframe;

    injectScript(newIframe, code);
  };


  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.type) {
        const color = event.data.type === 'log'
          ? 'white'
          : event.data.type === 'warn'
            ? 'yellow'
            : event.data.type === 'error'
              ? 'red'
              : event.data.type === 'info'
                ? 'blue'
                : 'white';

        setLogs((prevLogs: any) => {
          const updatedLogs = [...prevLogs];
          const existingLogIndex = updatedLogs.findIndex(log => log.line === event.data.line);

          if (existingLogIndex === -1) {
            updatedLogs.push({
              type: event.data.type,
              message: event.data.message,
              color: color,
              line: event.data.line
            });
          } else {
            updatedLogs[existingLogIndex] = {
              type: event.data.type,
              message: event.data.message,
              color: color,
              line: event.data.line
            };
          }

          return updatedLogs;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const renderLogs = () => {
    return logs.map((log: any, index: any) => (
      <div key={index} className={`console-log log-${log.type}`}>
        <div className="console-log-icon">
          {log.type === 'error' && '❌ '}
          {log.type === 'warn' && '⚠️ '}
          {log.type === 'info' && 'ℹ️ '}
          {log.type === 'log' && '✅ '}
        </div>
        <div className="console-log-content">
          {`${log.type.toUpperCase()}:  ${log.message}`}
        </div>
      </div>
    ));
  };



  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    console.log("hhh", editor, monaco);
    editorRef.current = editor;
  }

  useEffect(() => {
    handleRun(code);
  }
    , [code]);

  return (
    <>
      <div className="relative">
        {/* <button className="absolute bottom-[10px] right-[10px] bg-[#1e1e1e] text-white px-[10px] py-[5px] rounded-md">Create Room</button> */}
        {!isRoomJoined && <div className="fixed z-[2] bottom-[10px] right-[10px]">
          <div className="relative inline-flex group">
            <div
              className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
            </div>
            <button onClick={() => {
              event('create-room', {
                category: 'playground',
                label: 'create-room'
              })
              
              setIsCreateOpen(true)
            }} title="Create Room"
              className="relative inline-flex items-center bg-[#1e1e1e] justify-center px-4 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none "
              role="button">Create Room
            </button>
          </div>
        </div>}
        {
          isRoomJoined && <div className="fixed z-[2] flex gap-[5px] bottom-[10px] right-[10px]">
            <abbr title={'Click to Copy Room ID'} className="relative inline-flex group">
              <div
                className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
              </div>
              <button onClick={() => {
                //clipoard copy room id
                event('copy-room-id', {
                  category: 'playground',
                  label: 'copy-room-id'
                })

                if (displayName === 'Admin') {
                  setMemebersModalOpen(true)
                } else {
                  navigator.clipboard.writeText(roomID);
                  toast.success('Room ID Copied to Clipboard')
                }
              }}
                className="relative inline-flex items-center bg-[#1e1e1e] justify-center px-4 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none "
                role="button">{displayName}
              </button>
            </abbr>
            <abbr title={'Disconnect'} className="relative inline-flex group">
              <div
                className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
              </div>
              <button onClick={() => {
                //clipoard copy room id
                event('disconnect-room', {
                  category: 'playground',
                  label: 'disconnect-room'
                })

                socket.disconnect()
                window.location.reload()
                setDisplayName('')
                setRoomID('')
                setIsRoomJoined(false)
              }}
                className="relative inline-flex items-center bg-[#1e1e1e] justify-center px-4 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none "
                role="button">X
              </button>
            </abbr>
          </div>
        }
        <div onClick={()=>{
          event('go-to-home', {
            category: 'playground',
            label: 'home'
          })
          router.push('/')
        }} className="fixed hover:scale-[1.05] transition-all duration-300 cursor-pointer z-[2] shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] top-[1rem] right-[1rem]">
          <a data-tip data-for='info'>
            <img src='/assets/playfavicon.ico'/>
          </a>
        </div>
        <div onClick={()=>{
          event('go-to-home', {
            category: 'playground',
            label: 'home'
          })
          router.push('/')
        }} title="Go to Home" className="fixed bg-transparent text-white flex items-center hover:scale-[1.05] transition-all duration-300 cursor-pointer z-[2] left-[1rem] bottom-[1rem]">
          Made with ❤️ by LazyWeb
        </div>
        {/* @ts-ignore */}
        <ReflexContainer orientation={
          isDesktop ? 'vertical' : 'horizontal'
        }>
          <ReflexElement className={
            isDesktop ? "left-pane" :''
            }>
            <div className="pane-content">
              <Editor
                height={
                  isDesktop ? '100vh' : '50vh'
                }
                theme="vs-dark"
                loading={<div className="flex items-center justify-center w-full h-full text-white bg-gray">
                  <h1>Loading Editor...</h1>
                </div>}
                value={code}
                width={'100%'}
                defaultLanguage="javascript"
                options={{
                  fontFamily: 'jetbrainsmono',
                  fontSize: 16,
                  padding: {
                    top: 20,
                  }
                }}
                onChange={(value) => {
                  setCode(value);
                  socket.emit('codeEdit', { roomId: roomID, newCode: value });
                }}
                defaultValue="console.log('hello lazyweb')"
                onMount={handleEditorDidMount}
              />
            </div>
          </ReflexElement>
          <ReflexSplitter className="!h-[50vh] md:!h-[100vh]" />
          <ReflexElement className={
            isDesktop?"right-pane":""
          }
            minSize={200}
            maxSize={800}>
            <div className="pane-content">
              <div className="console md:h-[100vh] h-[50vh]">
                <div className="console-header mb-[10px]">
                  <h3>| Console |</h3>
                </div>
                {renderLogs()}
              </div>
            </div>
          </ReflexElement>
        </ReflexContainer>
      </div>
      <ReactTooltip className='bg-gray' type='success' id='info' place='bottom'>
          JavaScript Playground
      </ReactTooltip>
      <iframe ref={iframeRef} title="output" style={{ width: '0px', height: '0px', border: 'none' }}></iframe>
      {<CreateRoomModal setDisplayName={setDisplayName} code={code} setIsRoomJoined={setIsRoomJoined} setRoomID={setRoomID} socket={socket} isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />}
      {isRoomJoined && <MemebersModal roomID={roomID} socket={socket} isOpen={memebersModalOpen} setIsOpen={setMemebersModalOpen} />}
    </>
  );
};

export default PlaygroundComponent;
