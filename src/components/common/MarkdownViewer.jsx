import axios from "axios";
import { useTranslation } from "contexts/TranslationContext";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown';

const MarkdownViewer = ({ file }) => {
    const { language } = useTranslation();
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        axios.get(`/assets/md/${language}/${file}`)
            .then((response) => {
                setMarkdown(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    });
    return (
        <Markdown>{markdown}</Markdown>
    );
}

export default MarkdownViewer;
