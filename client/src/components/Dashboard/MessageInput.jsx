import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

import { useEffect, useState, useRef } from 'react';
import api from '../../utils/api';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});
turndownService.use(gfm);

const MessageInput = ({ onSendMessage, placeholder = "Message..." }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder,
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[50px] max-h-[200px] overflow-y-auto w-full p-4 text-sm text-gray-700 markdown-body markdown-regular',
            },
        },
    });

    // Update placeholder when it changes
    useEffect(() => {
        if (editor && placeholder) {
            // Extension reconfiguration is partial, but for placeholder string only, mainly handled by reacting to props if we used extension storage, but cleaner to just let it be or remount.
            // Tiptap doesn't reactively update extension config easily without re-creating editor.
            // However, for chat channel switching, we might want to reset.
        }
    }, [placeholder, editor]);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSend = async () => {
        if (!editor || isUploading) return;

        const html = editor.getHTML();
        const text = editor.getText();

        if (!text.trim() && !html.includes('<img') && !selectedFile) return;

        let attachmentUrl = null;
        let attachmentType = null;

        if (selectedFile) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                // Optimistic UI could be implemented here, but for now we wait for upload
                const res = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                attachmentUrl = res.data.url;
                attachmentType = selectedFile.type; // Use client-side type for mime expectation
            } catch (error) {
                console.error("Upload failed", error);
                setIsUploading(false);
                return; // Prevent sending message if upload fails
            }
            setIsUploading(false);
        }

        const markdown = turndownService.turndown(html);
        onSendMessage(markdown, attachmentUrl, attachmentType);

        editor.commands.clearContent();
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="bg-white border-2 border-gray-200 rounded-xl focus-within:border-brand-primary/40 transition-all shadow-sm flex flex-col">
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50 rounded-t-xl overflow-x-auto">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-200/50'}`}
                    title="Bold"
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6v-8z" /></svg>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-200/50'}`}
                    title="Italic"
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l4-14M6 19h4M14 5h4" /></svg>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('code') ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-200/50'}`}
                    title="Code"
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-200/50'}`}
                    title="Bullet List"
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M4 6h.01M4 12h.01M4 18h.01" /></svg>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-200/50'}`}
                    title="Ordered List"
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h12M7 12h12M7 17h12" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h.01M4 11h.01M4 16h.01" /></svg>
                </button>
            </div>

            <EditorContent
                editor={editor}
                onKeyDown={handleKeyDown}
            />

            {selectedFile && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center shrink-0">
                            {selectedFile.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover rounded" />
                            ) : (
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                            )}
                        </div>
                        <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
                    </div>
                    <button
                        onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="text-gray-400 hover:text-red-500 p-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            <div className="p-2 flex items-center justify-between bg-gray-50/50 rounded-b-xl border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        id="message-attachment"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 rounded-lg transition-colors"
                        title="Attach file"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={editor.isEmpty && !selectedFile || isUploading}

                    className="bg-brand-primary/10 text-brand-primary p-2 rounded-lg hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isUploading ? (
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
