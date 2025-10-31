
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReportDisplayProps {
  content: string;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ content }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-500/10">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
            h2: ({node, ...props}) => <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 mt-8 mb-4 border-b-2 border-slate-700 pb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl sm:text-2xl font-semibold text-purple-300 mt-6 mb-3" {...props} />,
            p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300" {...props} />,
            li: ({node, ...props}) => <li className="pl-2" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-purple-200" {...props} />,
            hr: ({node, ...props}) => <hr className="border-slate-700 my-8" {...props} />,
        }}
      />
    </div>
  );
};
