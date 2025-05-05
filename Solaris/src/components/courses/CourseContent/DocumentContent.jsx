<<<<<<< HEAD
import React from "react";
import { FileText, Download, Printer, Bookmark } from "lucide-react";
import "./DocumentContent.css";

/**
 * DocumentContent Component
 *
=======
import React from 'react';
import { FileText, Download, Printer, Bookmark } from 'lucide-react';
import './DocumentContent.css';

/**
 * DocumentContent Component
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
 * Displays document content for a course item.
 * In a real application, this might render a PDF or formatted text.
 */
function DocumentContent({ item }) {
  if (!item) return null;

  return (
    <div className="document-content">
      <div className="document-toolbar">
        <div className="toolbar-title">
          <FileText className="toolbar-icon" />
          <span>{item.title}</span>
        </div>
        <div className="toolbar-actions">
          <button className="toolbar-button">
            <Download className="button-icon" />
            <span className="button-text">Download</span>
          </button>
          <button className="toolbar-button">
            <Printer className="button-icon" />
            <span className="button-text">Print</span>
          </button>
          <button className="toolbar-button">
            <Bookmark className="button-icon" />
            <span className="button-text">Bookmark</span>
          </button>
        </div>
      </div>
<<<<<<< HEAD

      <div className="document-body">
        <div className="document-text">
          <h2 className="document-heading">Sample Document Content</h2>

          <p className="document-paragraph">
            This is a placeholder for the document content of "{item.title}". In
            a real implementation, this would be the actual document content,
            possibly rendered from HTML, Markdown, or a PDF.
          </p>

          <p className="document-paragraph">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies lacinia, nisl nisl aliquam nisl, eget
            aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies
            lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet
            nisl.
          </p>

          <h3 className="document-subheading">Key Concepts</h3>

          <ul className="document-list">
            <li className="document-list-item">
              First key concept explanation
            </li>
            <li className="document-list-item">
              Second key concept with more detailed information about the topic
            </li>
            <li className="document-list-item">
              Third important element to remember for assessments
            </li>
          </ul>

          <p className="document-paragraph">
            Additional content would be displayed here in a real implementation.
            The document might include images, tables, code snippets, and other
            rich content depending on the subject matter.
=======
      
      <div className="document-body">
        <div className="document-text">
          <h2 className="document-heading">Sample Document Content</h2>
          
          <p className="document-paragraph">
            This is a placeholder for the document content of "{item.title}". In a real implementation, 
            this would be the actual document content, possibly rendered from HTML, Markdown, or a PDF.
          </p>
          
          <p className="document-paragraph">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies 
            lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl 
            eget ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
          
          <h3 className="document-subheading">Key Concepts</h3>
          
          <ul className="document-list">
            <li className="document-list-item">First key concept explanation</li>
            <li className="document-list-item">Second key concept with more detailed information about the topic</li>
            <li className="document-list-item">Third important element to remember for assessments</li>
          </ul>
          
          <p className="document-paragraph">
            Additional content would be displayed here in a real implementation. The document might 
            include images, tables, code snippets, and other rich content depending on the subject matter.
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
          </p>
        </div>
      </div>
    </div>
  );
}

export default DocumentContent;
