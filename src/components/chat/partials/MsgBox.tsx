interface IMsgBoxProps {
    position: string;
    message: string;
    msgType?: string;
    date: string;
    status?: 'sent' | 'read';
}

export default function MsgBox({position, message, msgType, date, status}: IMsgBoxProps) {
    const d = new Date(date);
    const time = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <div className="space-y-2 my-2">
            <div className={`flex ${position === 'left' ? 'justify-start' : 'justify-end'}`}>
                <div
                    className={`flex max-w-xl px-4 py-2 rounded shadow ${position === 'left' ? 'text-base-content bg-base-300' : 'text-neutral bg-accent-content'}`}>
                    <span
                        className={`block flex ${position === 'left' ? 'justify-start' : 'justify-end'}`}>{message}</span>
                    <div
                        className={`font-light ml-3 text-xs flex items-end ${position === 'left' ? 'justify-start' : 'justify-end'}`}>
                        <div>
                            {time}
                        </div>
                        <div
                            className={`relative w-2 ${status === 'read' ? 'text-accent' : position === 'right' ? 'text-neutral' : 'text-neutral-content'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className={`h-4 w-4 absolute bottom-0.5 left-0`}
                                 viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className={`h-4 w-4 absolute -bottom-0.5 left-0`}
                                 viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
