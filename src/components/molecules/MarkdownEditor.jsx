import { useState } from "react";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import { parseMarkdown } from "@/utils/markdown";

const MarkdownEditor = ({ value, onChange, placeholder, className }) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertCodeBlock = () => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || "";
    
    const beforeCursor = text.substring(0, start);
    const afterCursor = text.substring(end);
    const codeBlock = "```javascript\n// Your code here\n```\n";
    
    const newText = beforeCursor + codeBlock + afterCursor;
    onChange({ target: { value: newText } });
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 14, start + 32);
    }, 0);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={insertCodeBlock}
          >
            Code Block
          </Button>
        </div>
        <span className="text-sm text-gray-500">Markdown supported</span>
      </div>
      
      {showPreview ? (
        <div 
          className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-white prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(value || "") }}
        />
      ) : (
        <TextArea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="min-h-[200px]"
        />
      )}
    </div>
  );
};

export default MarkdownEditor;