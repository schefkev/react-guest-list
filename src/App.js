/** @jsxImportSource @emotion/react */
import './App.css';
import { css } from '@emotion/react';

const hello = css`
  color: aliceblue;
`;

export default function App() {
  return (
    <div>
      <h1 css={hello}>Hello</h1>
    </div>
  );
}
