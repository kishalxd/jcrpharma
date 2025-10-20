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
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 px-3 py-2 bg-gray-50">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2 gap-0.5">
            <ToolbarButton
              onClick={() => executeCommand('bold')}
              title="Bold (Ctrl+B)"
            >
              <svg className="w-4 h-4 font-bold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h8a4 4 0 0 1 4 4 3.5 3.5 0 0 1-1.5 2.9A4 4 0 0 1 14 19H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm1 2v4h7a2 2 0 1 0 0-4H7zm0 6v4h7a2 2 0 1 0 0-4H7z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('italic')}
              title="Italic (Ctrl+I)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 4H9v2h2.5l-3.5 8H6v2h6v-2H9.5l3.5-8H15V4z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('underline')}
              title="Underline (Ctrl+U)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 21h14v-2H5v2zM12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6z"/>
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
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertList(true)}
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
              </svg>
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2 gap-0.5">
            <ToolbarButton
              onClick={() => executeCommand('justifyLeft')}
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('justifyCenter')}
              title="Align Center"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => executeCommand('justifyRight')}
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
              </svg>
            </ToolbarButton>
          </div>

          {/* Links & Media */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              onClick={createLink}
              title="Insert Link"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.9C4.29 7 2.2 9.09 2.2 11.7s2.09 4.7 4.7 4.7h4v-1.9H6.9c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9.1-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.61 0 4.7-2.09 4.7-4.7S19.71 7 17.1 7z"/>
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={insertImage}
              title="Insert Image"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
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
        className="min-h-[500px] p-6 focus:outline-none text-gray-800 leading-relaxed"
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
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 2rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
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
