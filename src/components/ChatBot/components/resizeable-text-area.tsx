import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect, TextareaHTMLAttributes } from "react";
interface AutoResizeTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxLines?: number;
}

const AutoResizeTextArea = forwardRef(({ maxLines = 8, ...props }: AutoResizeTextAreaProps, ref) => {    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [lineHeight, setLineHeight] = useState(0);
    const LINE_HEIGHT = "24px";

    const resizeToText = () => {
        const textArea = textAreaRef.current!;
        textArea.style.height = 'auto'; // Reset height to recalculate
        const totalLines = Math.floor(textArea.scrollHeight / lineHeight);
        if (totalLines <= maxLines) {
            textArea.style.height = `${totalLines * lineHeight}px`;
            textArea.style.overflowY = 'hidden'; // Hide scrollbar when content is within max lines
        } else {
            textArea.style.height = `${maxLines * lineHeight}px`; // Set to max height
            textArea.style.overflowY = 'auto'; // Show scrollbar when content exceeds max lines
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (textAreaRef.current) {
            const computedStyle = window.getComputedStyle(textAreaRef.current);
            setLineHeight(parseInt(computedStyle.lineHeight, 10));
        }
        resizeToText();
        if (props.onChange) {
            props.onChange(e);
        }
    };

    useImperativeHandle(ref, () => ({
        resetSize: () => {
            if (textAreaRef.current) {
                textAreaRef.current.style.height = LINE_HEIGHT
            }
        }
    }));

    return (
        <textarea
            {...props}
            ref={textAreaRef}
            rows={1}
            className="resize-none w-full rounded focus:outline-none"
            onChange={onChangeHandler}
            style={{ overflowY: 'hidden', height: LINE_HEIGHT }} // Start in this state
        />
    );
});

AutoResizeTextArea.displayName = 'AutoResizeTextArea';

export default AutoResizeTextArea;