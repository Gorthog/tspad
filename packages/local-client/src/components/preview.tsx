import { useEffect, useRef } from "react";
import "./preview.css";

interface PreviewProps {
  code?: string;
  err?: string;
}

const html = `
    <html>
      <head>
      </head>
      <body>
        <div id="root">
        <script>
          const handleError = (e) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime error</h4>' + e + '</div>';
            console.error(e);
          }

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (e) {
              handleError(e);
            }
          }, false)



        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    iframe.current!.srcdoc = html;
    setTimeout(() => {
      iframe.current?.contentWindow?.postMessage(code, "*");
    }, 50);
  }, [code]);
  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
