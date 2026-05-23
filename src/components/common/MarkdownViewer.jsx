import axios from "axios";
import { useTranslation } from "contexts/TranslationContext";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown';

const MarkdownViewer = ({ file }) => {
    const { language } = useTranslation();
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        axios.get(`/assets/md/${language}/${file}`, { signal: controller.signal })
            .then((response) => {
                setMarkdown(response.data)
            })
            .catch(error => {
                if (error.code !== 'ERR_CANCELED') {
                    console.error(error)
                }
            })
        return () => controller.abort();
    }, [file, language]);
    return (
        <Markdown>{markdown}</Markdown>
    );
}

export default MarkdownViewer;
