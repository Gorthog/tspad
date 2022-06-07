import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
}

const html = `
    <html>
      <head>
      </head>
      <body>
        <div id="root">
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (e) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime error</h4>' + e + '</div>';
              console.error(e);
            }
          }, false)

        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    iframe.current!.srcdoc = html;
    iframe.current?.contentWindow?.postMessage(code, "*");
  }, [code]);
  return (
    <iframe
      style={{
        backgroundColor: "white",
        minHeight: "0px",
        height: "100%",
        width: "100%",
      }}
      title="preview"
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
};

export default Preview;
