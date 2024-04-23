import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MathJax } from 'better-react-mathjax';
const MarkdownRenderer = ({ source, maxLines }) => {
  // Calculate the height based on the number of lines
  const lineHeight = 16; // Typical line height in pixels
  const containerHeight = maxLines ? `${maxLines * lineHeight}px` : `auto`;
  console.log(containerHeight);
 
  // Apply CSS styles for scrollability
  const containerStyle = {
     maxHeight: containerHeight, // Use maxHeight instead of rows
     innerWidth: '100%',
     overflowY: 'auto',
  };
 
  return (
     <MathJax>
       <div style={containerStyle}>
         <ReactMarkdown>{source}</ReactMarkdown>
       </div>
     </MathJax>
  );
 };

export default MarkdownRenderer;  
 