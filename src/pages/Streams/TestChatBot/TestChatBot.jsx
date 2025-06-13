import { useEffect } from 'react';

export default function HeyGenEmbed() {
  useEffect(() => {
    const host = 'https://labs.heygen.com';
    const url =
      host +
      '/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiI5MTdhZWIxOGI5MzQ0Yzk2OGI3ZmYwMWQ4%0D%0AMWU1ZTU2ZCIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0ALzkxN2FlYjE4YjkzNDRjOTY4YjdmZjAxZDgxZTVlNTZkL2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0%0D%0ALndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjI3%0D%0AMThjYzBlMGIxNTQ1MzdiY2VkYzBhODU2NDViNjdiIiwidXNlcm5hbWUiOiJlOGI1MGM1ZDk5ZmE0%0D%0AYTgzOWQ2MGQzYTRjYWE1ZWUxMiJ9&inIFrame=1';
    const clientWidth = document.body.clientWidth;

    const wrapDiv = document.createElement('div');
    wrapDiv.id = 'heygen-streaming-embed';

    const container = document.createElement('div');
    container.id = 'heygen-streaming-container';

    const stylesheet = document.createElement('style');
    stylesheet.innerHTML = `
      html, body {
        background: linear-gradient(
      322deg,
      var(--main-color) 23.22%,
      var(--secondary-color) 110.01%
    );
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
      }
      #heygen-streaming-embed {
        z-index: 9999;
        position: fixed;
        top: 50%; /* Центрування по вертикалі */
        left: 50%; /* Центрування по горизонталі */
        transform: translate(-50%, -50%); /* Вирівнювання по центру */
        width: 200px;
        height: 200px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
        transition: all linear 0.1s;
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
      }
      #heygen-streaming-embed.show {
        opacity: 1;
        visibility: visible;
      }
      #heygen-streaming-embed.expand {
        top: 0;
        left: 0;
        transform: none;
        ${
          clientWidth < 540
            ? 'height: 100%; width: 96%; left: 50%; transform: translateX(-50%);'
            : 'height: 100%; width: 100%;'
        }
        border: 0;
        border-radius: 0px;
      }
      #heygen-streaming-container {
        width: 100%;
        height: 100%;
      }
      #heygen-streaming-container iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    `;

    const iframe = document.createElement('iframe');
    iframe.allowFullscreen = false;
    iframe.title = 'Streaming Embed';
    iframe.role = 'dialog';
    iframe.allow = 'microphone';
    iframe.src = url;


    let visible = false;
    let initial = false;

    window.addEventListener('message', e => {
      if (
        e.origin === host &&
        e.data &&
        e.data.type &&
        e.data.type === 'streaming-embed'
      ) {
        if (e.data.action === 'init') {
          initial = true;
          wrapDiv.classList.toggle('show', initial);
        } else if (e.data.action === 'show') {
          visible = true;
          wrapDiv.classList.toggle('expand', visible);
        } else if (e.data.action === 'hide') {
          visible = false;
          wrapDiv.classList.toggle('expand', visible);
        }
      }
    });

    container.appendChild(iframe);
    wrapDiv.appendChild(stylesheet);
    wrapDiv.appendChild(container);
    document.body.appendChild(wrapDiv);

    // Cleanup function
    return () => {
      if (document.body.contains(wrapDiv)) {
        document.body.removeChild(wrapDiv);
      }
    };
  }, []);

  return null;
}
