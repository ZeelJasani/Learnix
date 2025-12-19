// "use client";


// import { useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";


// export function RichTextEditor() {
//     const editor = useEditor({
//         extensions: [StarterKit],
//     })
// }





// "use client";

// import { useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import { Menubar } from "./Menubar";

// export function RichTextEditor() {
//   const editor = useEditor({
//     extensions: [StarterKit],
//   });

//   return (
//     <Menubar/>
//   )
// }



// from chat gpt


// "use client";

// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import { Menubar } from "./Menubar";
// // import TextAlign from "@/tiptap/extension-text-align";
// import TextAlign from "@tiptap/extension-text-align";

// export function RichTextEditor({ field }: { field: any }) {
//     const editor = useEditor({
//         extensions: [StarterKit, TextAlign.configure({
//             types: ['heading', "paragraph"]
//         })
//         ],
//         immediatelyRender: false,
//         editorProps: {
//             attributes: {
//                 class: "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
//             },
//         },
//         onUpdate: ({ editor }) => {
//             field.onChange(JSON.stringify(editor.getJSON()));
//         },

//         content: field.value ? JSON.parse(field.value) : "<p>hello world 🍭 </p>"
//     });
//     return (
//         <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30" >
//             <Menubar editor={editor} />
//             <EditorContent editor={editor} />
//         </div>
//     )
// }












"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RichTextEditor({ field }: { field: any }) {
    const editor = useEditor({
        extensions: [
            StarterKit, 
            TextAlign.configure({
                types: ['heading', 'paragraph'] // Fixed: removed extra quotes around paragraph
            })
        ],
        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            field.onChange(JSON.stringify(editor.getJSON()));
        },
        // Fixed: Added proper error handling and default content
        content: (() => {
            if (!field?.value) {
                return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world 🍭' }] }] };
            }
            
            try {
                // If it's already a string that looks like HTML, convert to proper JSON structure
                if (typeof field.value === 'string' && field.value.startsWith('<')) {
                    return field.value;
                }
                
                // If it's a JSON string, parse it
                if (typeof field.value === 'string') {
                    return JSON.parse(field.value);
                }
                
                // If it's already an object, return as is
                return field.value;
            } catch (error) {
                console.warn('Error parsing editor content:', error);
                return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world 🍭' }] }] };
            }
        })()
    });

    // Added null check for editor
    if (!editor) {
        return (
            <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
                <div className="p-4">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}