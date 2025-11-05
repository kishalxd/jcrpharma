import React, { useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const insertList = (ordered = false) => {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    executeCommand(command);
  };

  const formatBlock = (tag) => {
    executeCommand('formatBlock', tag);
  };

  const createLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.margin = '10px 0';
          
          // Insert the image at cursor position
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.setStartAfter(img);
            range.setEndAfter(img);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            editorRef.current.appendChild(img);
          }
          
          handleInput();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const ToolbarButton = ({ onClick, title, children, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors border border-transparent ${
        active ? 'bg-brand-blue text-white border-brand-blue' : 'text-gray-700 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 overflow-hidden bg-white flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-gray-200 px-3 py-2 bg-gray-50 sticky top-0 z-10">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2 gap-0.5">
            <ToolbarButton
              onClick={() => executeCommand('bold')}
              title="Bold (Ctrl+B)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('italic')}
              title="Italic (Ctrl+I)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('underline')}
              title="Underline (Ctrl+U)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('strikeThrough')}
              title="Strikethrough"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-2.01c0-.41-.08-.76-.25-1.05-.16-.29-.39-.51-.69-.67-.29-.15-.63-.26-1.02-.32-.38-.07-.78-.1-1.2-.1-.41 0-.79.04-1.13.13-.34.09-.63.21-.87.36-.23.16-.41.35-.53.58-.12.23-.18.49-.18.77 0 .24.06.45.17.64.11.18.26.35.45.49.21.14.46.26.74.36.28.1.58.18.91.25l.06.02H9.41c-.42-.22-.78-.53-1.05-.92-.27-.4-.4-.86-.4-1.38zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.39.87.65.21.27.31.58.31.93 0 .52-.21.89-.63 1.12-.42.23-.97.34-1.64.34-.22 0-.45-.02-.69-.06-.23-.04-.46-.1-.69-.18-.23-.08-.44-.19-.62-.33-.18-.14-.33-.32-.44-.53-.11-.21-.17-.46-.17-.75H9.08c0 .58.17 1.11.51 1.57.34.47.82.85 1.46 1.12.63.27 1.36.4 2.17.4.81 0 1.54-.13 2.17-.38.63-.26 1.12-.65 1.48-1.16.36-.51.54-1.12.54-1.82 0-.66-.18-1.23-.54-1.71-.36-.47-.85-.84-1.46-1.1L21 12z"/>
              </svg>
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2 gap-0.5">
            <ToolbarButton
              onClick={() => formatBlock('h1')}
              title="Heading 1"
            >
              <span className="text-sm font-bold">H1</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatBlock('h2')}
              title="Heading 2"
            >
              <span className="text-sm font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatBlock('h3')}
              title="Heading 3"
            >
              <span className="text-sm font-bold">H3</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatBlock('p')}
              title="Paragraph"
            >
              <span className="text-sm">P</span>
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2 gap-0.5">
            <ToolbarButton
              onClick={() => insertList(false)}
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13m-13 6h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertList(true)}
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h13M5 15h13" />
              </svg>
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2 gap-0.5">
            <ToolbarButton
              onClick={() => executeCommand('justifyLeft')}
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('justifyCenter')}
              title="Align Center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8m-8 6h8" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('justifyRight')}
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 6H3m18 6H3m18 6H3" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('justifyFull')}
              title="Justify"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
              </svg>
            </ToolbarButton>
          </div>

          {/* Links & Media */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              onClick={createLink}
              title="Insert Link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={insertImage}
              title="Insert Image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[500px] p-6 pb-24 focus:outline-none text-gray-800 leading-relaxed flex-1 overflow-y-auto"
        style={{ 
          fontSize: '16px',
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
          line-height: 1.2;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.8rem 0;
          line-height: 1.3;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.6rem 0;
          line-height: 1.4;
        }
        
        [contenteditable] p {
          margin: 0.5rem 0;
        }
        
        [contenteditable] ul {
          margin: 0.5rem 0;
          padding-left: 2rem;
          list-style-type: disc;
          list-style-position: outside;
        }
        
        [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 2rem;
          list-style-type: decimal;
          list-style-position: outside;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
          display: list-item;
        }
        
        [contenteditable] a {
          color: #3B82F6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        `
      }} />
    </div>
  );
};

export default RichTextEditor;
