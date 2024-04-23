import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import MarkdownRenderer from './MarkdownRenderer';
import { Margin, Padding } from '@mui/icons-material';

function API_Documentation() {
    const [documentation, setDocumentation] = useState('');

    useEffect(() => {
        // Function to fetch documentation file
        const fetchDocumentation = async () => {
            try {
                const response = await fetch('api_documentation.md');
                const text = await response.text();
                setDocumentation(text);
            } catch (error) {
                console.error('Error fetching documentation:', error);
            }
        };

        fetchDocumentation();

        return () => {
            // Future developers can add cleanup logic if needed
        };
    }, []);

    return (
        <div>
            <Navbar />
            <div style={{ margin: '20px' }}>
                <MarkdownRenderer source={documentation} />
            </div>
        </div>
    );
}

export default API_Documentation;
